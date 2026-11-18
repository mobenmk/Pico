import re, time, sqlite3
from flask import request, jsonify

OWNER = "mobenmk"
DEMO_COUNTS = True

CQ = """select m.id,m.a,m.text,m.ts,m.reply,m.fwd,m.edited,
 (select name from users where id=m.a) sname,
 (select text from msgs where id=m.reply) rtext,
 (select a from msgs where id=m.reply) ra,
 (select gone from msgs where id=m.reply) rgone,
 (select name from users where id=(select a from msgs where id=m.reply)) rname"""

def role_of(c, cid, uid):
    r = c.execute("select role from cmem where cid=? and uid=?", (cid, uid)).fetchone()
    return r["role"] if r else None

def count_of(c, v):
    if DEMO_COUNTS and v["disp"]:
        return v["disp"]
    return c.execute("select count(*) n from cmem where cid=?", (v["id"],)).fetchone()["n"]

def last_id(c, cid):
    return c.execute("select coalesce(max(id),0) m from msgs where b=?", (-cid,)).fetchone()["m"]

def official(c):
    o = c.execute("select id from users where username=?", (OWNER,)).fetchone()
    if not o:
        return None
    r = c.execute("select id from convs where uname='picko'").fetchone()
    if r:
        return r["id"]
    now = time.time()
    cur = c.execute("insert into convs(kind,title,uname,descr,owner,verified,disp,created) values('channel','Picko','picko',?,?,1,?,?)",
                    ("کانال رسمی پیکو", o["id"], 2000000, now))
    cid = cur.lastrowid
    c.execute("insert or ignore into cmem(cid,uid,role,lr,joined) values(?,?,'owner',0,?)", (cid, o["id"], now))
    c.execute("insert into msgs(a,b,text,ts) values(?,?,?,?)", (o["id"], -cid, "به پیکو خوش اومدی", now))
    return cid

def ensure(c, uid):
    cid = official(c)
    if cid and not c.execute("select 1 from cauto where uid=?", (uid,)).fetchone():
        c.execute("insert into cauto(uid) values(?)", (uid,))
        c.execute("insert or ignore into cmem(cid,uid,role,lr,joined) values(?,?,'member',?,?)", (cid, uid, last_id(c, cid), time.time()))
    c.commit()

def rxl_map(c, ids, i):
    out = {}
    ids = list(set(ids))
    if not ids:
        return {}
    q = ",".join("?" * len(ids))
    for r in c.execute("select mid,uid,emoji from reacts where mid in (%s)" % q, ids).fetchall():
        d = out.setdefault(r["mid"], {})
        e = d.setdefault(r["emoji"], [0, False])
        e[0] += 1
        if r["uid"] == i:
            e[1] = True
    return {k: [dict(e=em, n=v[0], m=v[1]) for em, v in d.items()] for k, d in out.items()}

def mjc(r, i, rx):
    rt = None
    if r["reply"] is not None:
        rt = dict(id=r["reply"], text=(None if r["rgone"] else r["rtext"]), mine=(r["ra"] == i), sn=r["rname"])
    return dict(id=r["id"], text=r["text"], ts=r["ts"], mine=(r["a"] == i), uid=r["a"], sn=r["sname"],
                fwd=r["fwd"], edited=bool(r["edited"]), reply=rt, rxl=rx)

def setup(app, db, me, err, toint):
    c = db()
    c.executescript("""
    create table if not exists convs(id integer primary key autoincrement, kind text, title text, uname text unique, descr text, owner integer, verified integer default 0, disp integer, created real);
    create table if not exists cmem(cid integer, uid integer, role text, lr integer default 0, joined real, primary key(cid,uid));
    create table if not exists cauto(uid integer primary key);
    """)
    c.commit(); c.close()

    @app.route("/api/convs")
    def convs():
        u = me()
        if not u: return err("login", 401)
        i = u["id"]
        c = db()
        ensure(c, i)
        rows = c.execute("select v.*, m.role as myrole, m.lr as mylr from convs v join cmem m on m.cid=v.id and m.uid=?", (i,)).fetchall()
        out = []
        for v in rows:
            last = c.execute("select m.text,m.ts,x.name from msgs m join users x on x.id=m.a where m.b=? and m.gone is null order by m.id desc limit 1", (-v["id"],)).fetchone()
            un = c.execute("select count(*) n from msgs where b=? and id>? and a!=? and gone is null", (-v["id"], v["mylr"] or 0, i)).fetchone()["n"]
            out.append(dict(id=v["id"], kind=v["kind"], title=v["title"], uname=v["uname"], verified=bool(v["verified"]), role=v["myrole"],
                            members=count_of(c, v), text=(last["text"] if last else ""),
                            sn=(last["name"] if (last and v["kind"] == "group") else None),
                            ts=(last["ts"] if last else v["created"]), unread=un))
        c.close()
        return jsonify(convs=out)

    @app.route("/api/csearch")
    def csearch():
        u = me()
        if not u: return err("login", 401)
        q = request.args.get("q", "").strip().lower().lstrip("@")
        if not q: return jsonify(convs=[])
        c = db()
        official(c); c.commit()
        rows = c.execute("select * from convs where uname is not null and (uname like ? or lower(title) like ?) limit 20", ("%" + q + "%", "%" + q + "%")).fetchall()
        out = [dict(id=v["id"], kind=v["kind"], title=v["title"], uname=v["uname"], verified=bool(v["verified"]),
                    role=(role_of(c, v["id"], u["id"]) or ""), members=count_of(c, v)) for v in rows]
        c.close()
        return jsonify(convs=out)

    @app.route("/api/cnew", methods=["POST"])
    def cnew():
        u = me()
        if not u: return err("login", 401)
        d = request.get_json(silent=True) or {}
        kind = d.get("kind") if d.get("kind") in ("group", "channel") else None
        title = str(d.get("title", "")).strip()[:40]
        uname = str(d.get("uname", "")).strip().lower().lstrip("@") or None
        descr = str(d.get("descr", "")).strip()[:300] or None
        if not kind or not title: return err("نام لازمه")
        if uname and (not re.fullmatch(r"[a-z0-9_]{4,25}", uname) or uname in ("picko", "admin", "support")):
            return err("آدرس باید ۴ تا ۲۵ حرف انگلیسی، عدد یا _ باشه")
        now = time.time()
        c = db()
        try:
            cur = c.execute("insert into convs(kind,title,uname,descr,owner,created) values(?,?,?,?,?,?)", (kind, title, uname, descr, u["id"], now))
        except sqlite3.IntegrityError:
            c.close(); return err("این آدرس قبلاً گرفته شده")
        cid = cur.lastrowid
        c.execute("insert into cmem(cid,uid,role,lr,joined) values(?,?,'owner',0,?)", (cid, u["id"], now))
        c.commit(); c.close()
        return jsonify(conv=dict(id=cid, kind=kind, title=title, uname=uname, verified=False, role="owner", members=1))

    @app.route("/api/cinfo")
    def cinfo():
        u = me()
        if not u: return err("login", 401)
        cid = toint(request.args.get("id"))
        c = db()
        v = c.execute("select * from convs where id=?", (cid,)).fetchone()
        if not v:
            c.close(); return err("پیدا نشد", 404)
        r = role_of(c, cid, u["id"])
        if not r and not v["uname"]:
            c.close(); return err("دسترسی نداری", 403)
        rows = c.execute("select x.id,x.name,cm.role from cmem cm join users x on x.id=cm.uid where cm.cid=? order by case cm.role when 'owner' then 0 when 'admin' then 1 else 2 end, x.name limit 100", (cid,)).fetchall()
        if v["kind"] == "channel" and r not in ("owner", "admin"):
            rows = [m for m in rows if m["role"] in ("owner", "admin")]
        conv = dict(id=v["id"], kind=v["kind"], title=v["title"], uname=v["uname"], descr=v["descr"], verified=bool(v["verified"]), members=count_of(c, v))
        c.close()
        return jsonify(conv=conv, role=r or "", members=[dict(m) for m in rows])

    @app.route("/api/cjoin", methods=["POST"])
    def cjoin():
        u = me()
        if not u: return err("login", 401)
        d = request.get_json(silent=True) or {}
        cid = toint(d.get("id"))
        c = db()
        v = c.execute("select * from convs where id=?", (cid,)).fetchone()
        if not v or not v["uname"]:
            c.close(); return err("پیدا نشد", 404)
        c.execute("insert or ignore into cmem(cid,uid,role,lr,joined) values(?,?,'member',?,?)", (cid, u["id"], last_id(c, cid), time.time()))
        c.commit(); c.close()
        return jsonify(ok=True)

    @app.route("/api/cleave", methods=["POST"])
    def cleave():
        u = me()
        if not u: return err("login", 401)
        d = request.get_json(silent=True) or {}
        cid = toint(d.get("id"))
        c = db()
        if role_of(c, cid, u["id"]) == "owner":
            c.close(); return err("مالک نمی‌تونه ترک کنه")
        c.execute("delete from cmem where cid=? and uid=?", (cid, u["id"]))
        c.commit(); c.close()
        return jsonify(ok=True)

    @app.route("/api/cadd", methods=["POST"])
    def cadd():
        u = me()
        if not u: return err("login", 401)
        d = request.get_json(silent=True) or {}
        cid = toint(d.get("id")); uid = toint(d.get("uid"))
        c = db()
        if role_of(c, cid, u["id"]) not in ("owner", "admin"):
            c.close(); return err("فقط مدیر می‌تونه عضو اضافه کنه", 403)
        if not c.execute("select 1 from users where id=?", (uid,)).fetchone():
            c.close(); return err("کاربر پیدا نشد", 404)
        c.execute("insert or ignore into cmem(cid,uid,role,lr,joined) values(?,?,'member',?,?)", (cid, uid, last_id(c, cid), time.time()))
        c.commit(); c.close()
        return jsonify(ok=True)

    @app.route("/api/cmessages")
    def cmessages():
        u = me()
        if not u: return err("login", 401)
        i = u["id"]
        cid = toint(request.args.get("cid")); after = toint(request.args.get("after"))
        try: since = float(request.args.get("since", "0"))
        except Exception: since = 0.0
        seen = request.args.get("seen") == "1"
        now = time.time()
        c = db()
        v = c.execute("select * from convs where id=?", (cid,)).fetchone()
        if not v:
            c.close(); return err("پیدا نشد", 404)
        r = role_of(c, cid, i)
        if not r and not v["uname"]:
            c.close(); return err("دسترسی نداری", 403)
        if r and seen:
            c.execute("update cmem set lr=? where cid=? and uid=?", (last_id(c, cid), cid, i))
            c.commit()
        rows = c.execute(CQ + " from (select * from msgs where id>? and b=? and gone is null order by id desc limit 200) m order by m.id", (after, -cid)).fetchall()
        ch = c.execute("select id,text,gone,edited from msgs where b=? and mt is not null and mt>?", (-cid, since)).fetchall()
        rx = rxl_map(c, [m["id"] for m in rows] + [m["id"] for m in ch], i)
        n = count_of(c, v)
        c.close()
        return jsonify(messages=[mjc(m, i, rx.get(m["id"])) for m in rows],
                       changes=[dict(id=m["id"], text=m["text"], gone=bool(m["gone"]), edited=bool(m["edited"]), rxl=rx.get(m["id"], [])) for m in ch],
                       now=now, role=r or "", members=n)

    @app.route("/api/csend", methods=["POST"])
    def csend():
        u = me()
        if not u: return err("login", 401)
        d = request.get_json(silent=True) or {}
        cid = toint(d.get("cid"))
        text = str(d.get("text", "")).strip()[:4000]
        fwd = str(d.get("fwd", "")).strip()[:30] or None
        rep = toint(d.get("reply")) or None
        if not text: return err("پیام خالیه")
        c = db()
        v = c.execute("select * from convs where id=?", (cid,)).fetchone()
        r = role_of(c, cid, u["id"]) if v else None
        if not v or not r:
            c.close(); return err("عضو نیستی", 403)
        if v["kind"] == "channel" and r not in ("owner", "admin"):
            c.close(); return err("فقط مدیران می‌تونن پیام بفرستن", 403)
        if rep and not c.execute("select 1 from msgs where id=? and b=?", (rep, -cid)).fetchone():
            rep = None
        cur = c.execute("insert into msgs(a,b,text,ts,reply,fwd) values(?,?,?,?,?,?)", (u["id"], -cid, text, time.time(), rep, fwd))
        mid = cur.lastrowid
        c.execute("update cmem set lr=? where cid=? and uid=?", (mid, cid, u["id"]))
        c.commit()
        row = c.execute(CQ + " from msgs m where m.id=?", (mid,)).fetchone()
        c.close()
        return jsonify(message=mjc(row, u["id"], None))

    @app.route("/api/creact", methods=["POST"])
    def creact():
        u = me()
        if not u: return err("login", 401)
        d = request.get_json(silent=True) or {}
        mid = toint(d.get("id")); e = str(d.get("emoji") or "").strip()
        i = u["id"]
        c = db()
        r = c.execute("select b from msgs where id=? and gone is null", (mid,)).fetchone()
        if not r or r["b"] >= 0:
            c.close(); return err("پیام پیدا نشد", 404)
        if not role_of(c, -r["b"], i):
            c.close(); return err("عضو نیستی", 403)
        if e and re.fullmatch(r"[a-z0-9_]{1,20}", e):
            c.execute("insert or replace into reacts(mid,uid,emoji) values(?,?,?)", (mid, i, e))
        else:
            c.execute("delete from reacts where mid=? and uid=?", (mid, i))
        c.execute("update msgs set mt=? where id=?", (time.time(), mid))
        c.commit()
        rx = rxl_map(c, [mid], i).get(mid, [])
        c.close()
        return jsonify(rxl=rx)

    @app.route("/api/cdelete", methods=["POST"])
    def cdelete():
        u = me()
        if not u: return err("login", 401)
        d = request.get_json(silent=True) or {}
        ids = [toint(x) for x in (d.get("ids") or [])][:200]
        i = u["id"]; now = time.time()
        c = db()
        for mid in ids:
            r = c.execute("select a,b from msgs where id=?", (mid,)).fetchone()
            if not r or r["b"] >= 0: continue
            rl = role_of(c, -r["b"], i)
            if rl and (r["a"] == i or rl in ("owner", "admin")):
                c.execute("update msgs set gone=1, mt=? where id=?", (now, mid))
        c.commit(); c.close()
        return jsonify(ok=True)
