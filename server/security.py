import os, re, time, json, hmac, hashlib, secrets, smtplib, ssl, sqlite3, threading
from collections import defaultdict, deque
from email.message import EmailMessage
from flask import request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash

HERE = os.path.dirname(os.path.abspath(__file__))
MAIL_CONF = os.path.join(HERE, "mail.conf")
SECRET_FILE = os.path.join(HERE, ".secret")
RESERVED = {"admin", "root", "support", "picko", "official", "system", "owner", "moderator", "staff", "help"}
COMMON = {"12345678", "123456789", "1234567890", "password", "password1", "qwertyui", "qwerty123",
          "11111111", "00000000", "iloveyou", "abcd1234", "12341234", "asdfghjk", "zxcvbnm1"}
CODE_TTL = 600

def _secret():
    try:
        return open(SECRET_FILE).read().strip()
    except Exception:
        s = secrets.token_hex(32)
        with open(SECRET_FILE, "w") as f:
            f.write(s)
        try: os.chmod(SECRET_FILE, 0o600)
        except Exception: pass
        return s

SECRET = _secret()

class Limiter:
    def __init__(self):
        self.d = defaultdict(deque)
        self.lock = threading.Lock()
        self.n = 0
    def hit(self, key, limit, window):
        now = time.time()
        with self.lock:
            q = self.d[key]
            while q and q[0] < now - window:
                q.popleft()
            if len(q) >= limit:
                return False, int(q[0] + window - now) + 1
            q.append(now)
            self.n += 1
            if self.n % 500 == 0:
                for k in [k for k, v in self.d.items() if not v or v[-1] < now - 3600]:
                    del self.d[k]
            return True, 0
    def count(self, key, window):
        now = time.time()
        with self.lock:
            q = self.d[key]
            while q and q[0] < now - window:
                q.popleft()
            return len(q)
    def clear(self, key):
        with self.lock:
            self.d.pop(key, None)

RL = Limiter()

def client_ip():
    return (request.headers.get("CF-Connecting-IP") or request.remote_addr or "?").strip()

def norm_email(e):
    e = str(e or "").strip().lower()
    m = re.fullmatch(r"([a-z0-9._+\-]{1,64})@(gmail\.com|googlemail\.com)", e)
    if not m:
        return None
    local = m.group(1).split("+")[0].replace(".", "")
    if len(local) < 6:
        return None
    return local + "@gmail.com"

def mask(e):
    l, d = e.split("@")
    return l[:2] + "***@" + d

def policy(pw, un=""):
    if len(pw) < 8: return "رمز باید حداقل ۸ حرف باشه"
    if len(pw) > 100: return "رمز خیلی طولانیه"
    if pw.lower() in COMMON: return "این رمز خیلی رایجه، یه رمز سخت‌تر انتخاب کن"
    if un and pw.lower() == un.lower(): return "رمز نباید با نام کاربری یکی باشه"
    if not (re.search(r"[A-Za-z\u0600-\u06FF]", pw) and re.search(r"\d", pw)):
        return "رمز باید هم حرف داشته باشه هم عدد"
    return None

def send_mail(to, subject, body):
    conf = json.load(open(MAIL_CONF))
    msg = EmailMessage()
    msg["From"] = "Picko <%s>" % conf["user"]
    msg["To"] = to
    msg["Subject"] = subject
    msg.set_content(body)
    ctx = ssl.create_default_context()
    with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=ctx, timeout=20) as s:
        s.login(conf["user"], conf["app_password"].replace(" ", ""))
        s.send_message(msg)

def _h(email, purpose, code):
    return hmac.new(SECRET.encode(), ("%s|%s|%s" % (email, purpose, code)).encode(), hashlib.sha256).hexdigest()

def setup(app, db, me, err, toint):
    app.config["MAX_CONTENT_LENGTH"] = 12 * 1024 * 1024
    try: os.chmod(os.path.join(HERE, "picko.db"), 0o600)
    except Exception: pass
    c = db()
    c.executescript("""
    create table if not exists emails(uid integer primary key, email text unique, ts real);
    create table if not exists emcodes(email text, purpose text, h text, exp real, tries integer default 0, primary key(email,purpose));
    create table if not exists xog(id integer primary key autoincrement, uid integer, board text, over integer default 0, res text, rw integer default 0, ts real);
    """)
    c.commit(); c.close()

    def jerr(m, code=400):
        return jsonify(error=m), code

    @app.before_request
    def guard():
        p = request.path
        if not p.startswith("/api/"):
            return None
        a = request.headers.get("Authorization", "")
        if a:
            key = "t:" + hashlib.sha256(a.encode()).hexdigest()[:16]
            lim = 900
        else:
            key = "i:" + client_ip()
            lim = 90
        ok, w = RL.hit("g|" + key, lim, 60)
        if not ok:
            return jerr("درخواست‌ها زیاد شد، کمی صبر کن", 429)
        if p in ("/api/send", "/api/csend") and request.method == "POST":
            ok, w = RL.hit("s|" + key, 60, 60)
            if not ok:
                return jerr("خیلی سریع پیام می‌فرستی", 429)
        return None

    @app.after_request
    def headers(r):
        r.headers["X-Content-Type-Options"] = "nosniff"
        r.headers["Referrer-Policy"] = "no-referrer"
        r.headers["X-Frame-Options"] = "DENY"
        if request.path.startswith("/api/") and "avatar" not in request.path and "photo" not in request.path:
            r.headers["Cache-Control"] = "no-store"
        return r

    def user_json(u, token=None):
        return dict(token=token or u["token"], id=u["id"], username=u["username"], name=u["name"])

    def rotate(c, uid):
        t = secrets.token_hex(24)
        c.execute("update users set token=? where id=?", (t, uid))
        c.commit()
        return t
    def consume(c, email, purpose, code):
        r = c.execute("select * from emcodes where email=? and purpose=?", (email, purpose)).fetchone()
        if not r or r["exp"] < time.time():
            return False
        if r["tries"] >= 5:
            c.execute("delete from emcodes where email=? and purpose=?", (email, purpose)); c.commit()
            return False
        if hmac.compare_digest(r["h"], _h(email, purpose, str(code).strip())):
            c.execute("delete from emcodes where email=? and purpose=?", (email, purpose)); c.commit()
            return True
        c.execute("update emcodes set tries=tries+1 where email=? and purpose=?", (email, purpose)); c.commit()
        return False

    @app.route("/api/email/code", methods=["POST"])
    def email_code():
        d = request.get_json(silent=True) or {}
        purpose = str(d.get("purpose", ""))
        if purpose not in ("signup", "link", "reset"):
            return jerr("درخواست نامعتبر")
        em = norm_email(d.get("email"))
        if not em:
            return jerr("فقط آدرس جیمیل معتبر قبول می‌شه")
        u = None
        if purpose == "link":
            u = me()
            if not u: return jerr("login", 401)
        ip = client_ip()
        ok, w = RL.hit("ec|" + ip, 10, 3600)
        if not ok: return jerr("تعداد درخواست کد زیاد بود، بعداً امتحان کن", 429)
        ok, w = RL.hit("ee|" + em, 1, 60)
        if not ok: return jerr("%d ثانیه صبر کن و دوباره بزن" % w, 429)
        ok, w = RL.hit("eh|" + em, 5, 3600)
        if not ok: return jerr("برای این ایمیل زیاد کد گرفتی، بعداً امتحان کن", 429)
        c = db()
        owner = c.execute("select uid from emails where email=?", (em,)).fetchone()
        if purpose in ("signup", "link") and owner:
            c.close(); return jerr("این ایمیل قبلاً برای یه حساب استفاده شده")
        if purpose == "reset" and not owner:
            c.close(); return jsonify(ok=True)
        if not os.path.exists(MAIL_CONF):
            c.close(); return jerr("ارسال ایمیل هنوز روی سرور راه‌اندازی نشده", 503)
        code = "%06d" % secrets.randbelow(1000000)
        c.execute("insert or replace into emcodes(email,purpose,h,exp,tries) values(?,?,?,?,0)",
                  (em, purpose, _h(em, purpose, code), time.time() + CODE_TTL))
        c.commit(); c.close()
        try:
            send_mail(em, "کد پیکو", "کد تأیید پیکو: %s\n\nاین کد ۱۰ دقیقه اعتبار دارد.\nاگر خودت درخواست نکردی این ایمیل را نادیده بگیر." % code)
        except Exception as e:
            print("mail error:", e)
            return jerr("ارسال ایمیل ناموفق بود", 502)
        return jsonify(ok=True)

    def register():
        d = request.get_json(silent=True) or {}
        un = str(d.get("username", "")).strip().lower()
        name = str(d.get("name", "")).strip()[:30] or un
        pw = str(d.get("password", ""))
        ok, w = RL.hit("reg|" + client_ip(), 6, 3600)
        if not ok: return jerr("از این شبکه زیاد حساب ساخته شده، بعداً امتحان کن", 429)
        if not re.fullmatch(r"[a-z0-9_]{3,20}", un):
            return jerr("نام کاربری باید ۳ تا ۲۰ حرف انگلیسی، عدد یا _ باشه")
        if un in RESERVED:
            return jerr("این نام کاربری رزرو شده")
        pe = policy(pw, un)
        if pe: return jerr(pe)
        raw_em = str(d.get("email", "")).strip()
        em = None
        c = db()
        if raw_em:
            em = norm_email(raw_em)
            if not em:
                c.close(); return jerr("فقط آدرس جیمیل معتبر قبول می‌شه")
            if c.execute("select 1 from emails where email=?", (em,)).fetchone():
                c.close(); return jerr("این ایمیل قبلاً برای یه حساب استفاده شده")
            if not consume(c, em, "signup", d.get("code", "")):
                c.close(); return jerr("کد ایمیل درست یا معتبر نیست")
        tok = secrets.token_hex(24)
        try:
            cur = c.execute("insert into users(username,name,pw,token,created,last_seen) values(?,?,?,?,?,?)",
                            (un, name, generate_password_hash(pw), tok, time.time(), time.time()))
            uid = cur.lastrowid
            if em:
                c.execute("insert into emails(uid,email,ts) values(?,?,?)", (uid, em, time.time()))
            c.commit()
        except sqlite3.IntegrityError:
            c.close(); return jerr("این نام کاربری قبلاً گرفته شده")
        c.close()
        return jsonify(token=tok, id=uid, username=un, name=name)

    DUMMY = generate_password_hash("dummy-password-1")

    def login():
        d = request.get_json(silent=True) or {}
        ident = str(d.get("username", "")).strip().lower()[:80]
        pw = str(d.get("password", ""))[:200]
        ip = client_ip()
        k1, k2 = "lf|" + ip, "lu|" + ident
        if RL.count(k1, 900) >= 15 or RL.count(k2, 900) >= 8:
            return jerr("تلاش ناموفق زیاد بود، ۱۵ دقیقه بعد دوباره امتحان کن", 429)
        c = db()
        u = None
        if "@" in ident:
            em = norm_email(ident)
            if em:
                r = c.execute("select uid from emails where email=?", (em,)).fetchone()
                if r: u = c.execute("select * from users where id=?", (r["uid"],)).fetchone()
        else:
            u = c.execute("select * from users where username=?", (ident,)).fetchone()
        good = check_password_hash(u["pw"] if u else DUMMY, pw)
        if not u or not good:
            c.close()
            RL.hit(k1, 10 ** 6, 900); RL.hit(k2, 10 ** 6, 900)
            return jerr("نام کاربری یا رمز اشتباهه", 401)
        RL.clear(k2)
        tok = u["token"]
        if not tok:
            tok = rotate(c, u["id"])
        c.close()
        return jsonify(user_json(u, tok))

    def override(name, rule, fn):
        if name in app.view_functions:
            app.view_functions[name] = fn
        else:
            app.add_url_rule(rule, name, fn, methods=["POST"])
    override("register", "/api/register", register)
    override("login", "/api/login", login)

    @app.route("/api/reset", methods=["POST"])
    def reset():
        d = request.get_json(silent=True) or {}
        em = norm_email(d.get("email"))
        pw = str(d.get("password", ""))
        if not em: return jerr("جیمیل معتبر وارد کن")
        ok, w = RL.hit("rs|" + client_ip(), 10, 3600)
        if not ok: return jerr("تلاش زیاد بود، بعداً امتحان کن", 429)
        c = db()
        r = c.execute("select uid from emails where email=?", (em,)).fetchone()
        if not r:
            c.close(); return jerr("کد درست یا معتبر نیست")
        u = c.execute("select * from users where id=?", (r["uid"],)).fetchone()
        pe = policy(pw, u["username"])
        if pe:
            c.close(); return jerr(pe)
        if not consume(c, em, "reset", d.get("code", "")):
            c.close(); return jerr("کد درست یا معتبر نیست")
        c.execute("update users set pw=? where id=?", (generate_password_hash(pw), u["id"]))
        t = rotate(c, u["id"])
        c.close()
        RL.clear("lu|" + u["username"])
        return jsonify(user_json(u, t))
    @app.route("/api/email/link", methods=["POST"])
    def email_link():
        u = me()
        if not u: return jerr("login", 401)
        d = request.get_json(silent=True) or {}
        em = norm_email(d.get("email"))
        if not em: return jerr("جیمیل معتبر وارد کن")
        c = db()
        if c.execute("select 1 from emails where email=?", (em,)).fetchone():
            c.close(); return jerr("این ایمیل قبلاً برای یه حساب استفاده شده")
        if not consume(c, em, "link", d.get("code", "")):
            c.close(); return jerr("کد درست یا معتبر نیست")
        c.execute("insert or replace into emails(uid,email,ts) values(?,?,?)", (u["id"], em, time.time()))
        c.commit(); c.close()
        return jsonify(email=mask(em))

    @app.route("/api/security")
    def security():
        u = me()
        if not u: return jerr("login", 401)
        c = db()
        r = c.execute("select email from emails where uid=?", (u["id"],)).fetchone()
        c.close()
        return jsonify(email=(mask(r["email"]) if r else None), mail_ready=os.path.exists(MAIL_CONF))

    @app.route("/api/change_password", methods=["POST"])
    def change_password():
        u = me()
        if not u: return jerr("login", 401)
        d = request.get_json(silent=True) or {}
        ok, w = RL.hit("cp|%s" % u["id"], 8, 900)
        if not ok: return jerr("تلاش زیاد بود، بعداً امتحان کن", 429)
        if not check_password_hash(u["pw"], str(d.get("old", ""))[:200]):
            return jerr("رمز فعلی اشتباهه", 403)
        pw = str(d.get("new", ""))
        pe = policy(pw, u["username"])
        if pe: return jerr(pe)
        c = db()
        c.execute("update users set pw=? where id=?", (generate_password_hash(pw), u["id"]))
        t = rotate(c, u["id"])
        c.close()
        return jsonify(token=t)

    @app.route("/api/logout_all", methods=["POST"])
    def logout_all():
        u = me()
        if not u: return jerr("login", 401)
        c = db()
        t = rotate(c, u["id"])
        c.close()
        return jsonify(token=t)

    LINES = [(0,1,2),(3,4,5),(6,7,8),(0,3,6),(1,4,7),(2,5,8),(0,4,8),(2,4,6)]

    def xo_win(b):
        for a, x, y in LINES:
            if b[a] != "-" and b[a] == b[x] == b[y]:
                return b[a]
        return "D" if "-" not in b else ""

    def xo_bot(b):
        empt = [i for i, v in enumerate(b) if v == "-"]
        for m in ("O", "X"):
            for i in empt:
                t = list(b); t[i] = m
                if xo_win(t) == m:
                    return i
        if b[4] == "-": return 4
        return secrets.choice(empt)

    XO_WINS_PER_DAY = 10
    XO_REWARD = 3

    @app.route("/api/xo/new", methods=["POST"])
    def xo_new():
        u = me()
        if not u: return jerr("login", 401)
        ok, w = RL.hit("xn|%s" % u["id"], 40, 60)
        if not ok: return jerr("کمی صبر کن", 429)
        c = db()
        c.execute("delete from xog where ts<?", (time.time() - 2 * 86400,))
        cur = c.execute("insert into xog(uid,board,ts) values(?,?,?)", (u["id"], "-" * 9, time.time()))
        c.commit(); gid = cur.lastrowid; c.close()
        return jsonify(id=gid, board="-" * 9)

    @app.route("/api/xo/move", methods=["POST"])
    def xo_move():
        u = me()
        if not u: return jerr("login", 401)
        d = request.get_json(silent=True) or {}
        gid, i = toint(d.get("id")), toint(d.get("i"))
        ok, w = RL.hit("xm|%s" % u["id"], 120, 60)
        if not ok: return jerr("کمی صبر کن", 429)
        c = db()
        g = c.execute("select * from xog where id=? and uid=?", (gid, u["id"])).fetchone()
        if not g or g["over"]:
            c.close(); return jerr("بازی تموم شده، دوباره شروع کن")
        b = list(g["board"])
        if not (0 <= i < 9) or b[i] != "-":
            c.close(); return jerr("این خونه پره")
        b[i] = "X"
        res = xo_win(b)
        if not res:
            b[xo_bot(b)] = "O"
            res = xo_win(b)
        granted = 0
        if res == "X":
            n = c.execute("select count(*) n from xog where uid=? and rw=1 and ts>?", (u["id"], time.time() - 86400)).fetchone()["n"]
            if n < XO_WINS_PER_DAY:
                granted = XO_REWARD
                c.execute("update users set coins=coalesce(coins,0)+? where id=?", (granted, u["id"]))
        c.execute("update xog set board=?, over=?, res=?, rw=? where id=?",
                  ("".join(b), 1 if res else 0, res or None, 1 if granted else 0, gid))
        c.commit()
        coins = c.execute("select coins from users where id=?", (u["id"],)).fetchone()["coins"] or 0
        c.close()
        return jsonify(board="".join(b), over=bool(res), res=res, granted=granted, coins=coins)
