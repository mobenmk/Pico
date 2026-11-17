import os, re, time, secrets, sqlite3
from flask import Flask, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
DB = os.path.join(os.path.dirname(os.path.abspath(__file__)), "picko.db")

def db():
    c = sqlite3.connect(DB)
    c.row_factory = sqlite3.Row
    return c

def addcol(c, t, n, typ):
    cols = [r[1] for r in c.execute("pragma table_info(%s)" % t)]
    if n not in cols:
        c.execute("alter table %s add column %s %s" % (t, n, typ))

def init():
    c = db()
    c.executescript("""
    create table if not exists users(id integer primary key autoincrement, username text unique, name text, pw text, token text, created real);
    create table if not exists msgs(id integer primary key autoincrement, a integer, b integer, text text, ts real);
    create index if not exists i_msgs_a on msgs(a);
    create index if not exists i_msgs_b on msgs(b);
    """)
    addcol(c, "users", "last_seen", "real")
    addcol(c, "msgs", "dlv", "real")
    addcol(c, "msgs", "seen", "real")
    c.commit(); c.close()
init()

@app.after_request
def cors(r):
    r.headers["Access-Control-Allow-Origin"] = "*"
    r.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    r.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    return r

def err(m, code=400):
    return jsonify(error=m), code

def toint(v):
    try: return int(v)
    except Exception: return 0

def me():
    t = request.headers.get("Authorization", "").replace("Bearer ", "").strip()
    if not t: return None
    c = db()
    u = c.execute("select * from users where token=?", (t,)).fetchone()
    if u:
        now = time.time()
        if now - (u["last_seen"] or 0) > 3:
            c.execute("update users set last_seen=? where id=?", (now, u["id"]))
            c.commit()
    c.close()
    return u

@app.route("/ping")
def ping():
    return "ok"

@app.route("/api/register", methods=["POST"])
def register():
    d = request.get_json(silent=True) or {}
    un = str(d.get("username", "")).strip().lower()
    name = str(d.get("name", "")).strip()[:30] or un
    pw = str(d.get("password", ""))
    if not re.fullmatch(r"[a-z0-9_]{3,20}", un):
        return err("نام کاربری باید ۳ تا ۲۰ حرف انگلیسی، عدد یا _ باشه")
    if len(pw) < 4:
        return err("رمز عبور خیلی کوتاهه")
    tok = secrets.token_hex(24)
    c = db()
    try:
        cur = c.execute("insert into users(username,name,pw,token,created,last_seen) values(?,?,?,?,?,?)",
                        (un, name, generate_password_hash(pw), tok, time.time(), time.time()))
        c.commit(); uid = cur.lastrowid
    except sqlite3.IntegrityError:
        c.close(); return err("این نام کاربری قبلاً گرفته شده")
    c.close()
    return jsonify(token=tok, id=uid, username=un, name=name)

@app.route("/api/login", methods=["POST"])
def login():
    d = request.get_json(silent=True) or {}
    un = str(d.get("username", "")).strip().lower()
    pw = str(d.get("password", ""))
    c = db(); u = c.execute("select * from users where username=?", (un,)).fetchone(); c.close()
    if not u or not check_password_hash(u["pw"], pw):
        return err("نام کاربری یا رمز اشتباهه", 401)
    return jsonify(token=u["token"], id=u["id"], username=u["username"], name=u["name"])

@app.route("/api/search")
def search():
    u = me()
    if not u: return err("login", 401)
    q = request.args.get("q", "").strip().lower().lstrip("@")
    if not q: return jsonify(users=[])
    c = db()
    rows = c.execute("select id,username,name from users where id!=? and (username like ? or lower(name) like ?) limit 20",
                     (u["id"], "%" + q + "%", "%" + q + "%")).fetchall()
    c.close()
    return jsonify(users=[dict(r) for r in rows])

@app.route("/api/send", methods=["POST"])
def send():
    u = me()
    if not u: return err("login", 401)
    d = request.get_json(silent=True) or {}
    to = toint(d.get("to"))
    text = str(d.get("text", "")).strip()[:4000]
    if not text: return err("پیام خالیه")
    c = db()
    if not c.execute("select 1 from users where id=?", (to,)).fetchone():
        c.close(); return err("کاربر پیدا نشد", 404)
    ts = time.time()
    cur = c.execute("insert into msgs(a,b,text,ts) values(?,?,?,?)", (u["id"], to, text, ts))
    c.commit(); mid = cur.lastrowid; c.close()
    return jsonify(message=dict(id=mid, text=text, ts=ts, mine=True))

@app.route("/api/messages")
def messages():
    u = me()
    if not u: return err("login", 401)
    i = u["id"]
    w = toint(request.args.get("with")); after = toint(request.args.get("after"))
    seen = request.args.get("seen") == "1"
    now = time.time()
    c = db()
    c.execute("update msgs set dlv=? where b=? and dlv is null", (now, i))
    if seen:
        c.execute("update msgs set seen=? where a=? and b=? and seen is null", (now, w, i))
    c.commit()
    rows = c.execute("select * from (select id,a,text,ts from msgs where id>? and ((a=? and b=?) or (a=? and b=?)) order by id desc limit 200) order by id",
                     (after, i, w, w, i)).fetchall()
    dl = c.execute("select max(id) m from msgs where a=? and b=? and dlv is not null", (i, w)).fetchone()["m"] or 0
    rd = c.execute("select max(id) m from msgs where a=? and b=? and seen is not null", (i, w)).fetchone()["m"] or 0
    p = c.execute("select last_seen from users where id=?", (w,)).fetchone()
    c.close()
    return jsonify(messages=[dict(id=r["id"], text=r["text"], ts=r["ts"], mine=(r["a"] == i)) for r in rows],
                   dlv=dl, rd=rd, peer_last=(p["last_seen"] if p else None), now=now)

@app.route("/api/chats")
def chats():
    u = me()
    if not u: return err("login", 401)
    i = u["id"]
    now = time.time()
    c = db()
    c.execute("update msgs set dlv=? where b=? and dlv is null", (now, i))
    c.commit()
    rows = c.execute("""select x.id,x.username,x.name,x.last_seen,m.text,m.ts,m.a,m.dlv,m.seen,
      (select count(*) from msgs where a=x.id and b=? and seen is null) as unread
      from users x join msgs m on m.id=(select max(id) from msgs where (a=? and b=x.id) or (a=x.id and b=?))
      where x.id!=? order by m.id desc""", (i, i, i, i)).fetchall()
    c.close()
    out = []
    for r in rows:
        st = 2 if r["seen"] else (1 if r["dlv"] else 0)
        out.append(dict(id=r["id"], username=r["username"], name=r["name"], text=r["text"], ts=r["ts"],
                        mine=(r["a"] == i), st=st, unread=r["unread"], last_seen=r["last_seen"]))
    return jsonify(chats=out, now=now)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, threaded=True)
