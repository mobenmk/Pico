import re, time
from flask import request, jsonify
import conv

PLANS = {"d7": (60, 7 * 86400), "d30": (200, 30 * 86400), "y1": (1800, 365 * 86400)}
DAY_CAP = 150

def is_owner(u):
    return u["username"] == conv.OWNER

def prem_ok(u):
    return is_owner(u) or ((u["prem"] or 0) > time.time())

def setup(app, db, me, err, toint):
    c = db()
    cols = [r[1] for r in c.execute("pragma table_info(users)")]
    for n, t in (("coins", "integer default 0"), ("prem", "real"), ("ricon", "text"), ("picon", "text")):
        if n not in cols:
            c.execute("alter table users add column %s %s" % (n, t))
    c.execute("create table if not exists earnlog(uid integer, ts real, n integer)")
    c.commit(); c.close()

    def wal(c, uid, now):
        u = c.execute("select * from users where id=?", (uid,)).fetchone()
        return dict(coins=(u["coins"] or 0), own=is_owner(u), prem=(u["prem"] or 0), pa=prem_ok(u), now=now)

    @app.route("/api/wallet")
    def wallet():
        u = me()
        if not u: return err("login", 401)
        c = db()
        r = wal(c, u["id"], time.time())
        c.close()
        return jsonify(**r)

    @app.route("/api/earn", methods=["POST"])
    def earn():
        u = me()
        if not u: return err("login", 401)
        n = max(0, min(30, toint((request.get_json(silent=True) or {}).get("n"))))
        now = time.time()
        c = db()
        last = c.execute("select max(ts) m from earnlog where uid=?", (u["id"],)).fetchone()["m"] or 0
        day = c.execute("select coalesce(sum(n),0) s from earnlog where uid=? and ts>?", (u["id"], now - 86400)).fetchone()["s"]
        g = 0 if (n <= 0 or now - last < 5) else max(0, min(n, DAY_CAP - day))
        if g > 0:
            c.execute("insert into earnlog(uid,ts,n) values(?,?,?)", (u["id"], now, g))
            c.execute("update users set coins=coalesce(coins,0)+? where id=?", (g, u["id"]))
            c.commit()
        r = wal(c, u["id"], now)
        c.close()
        return jsonify(granted=g, **r)

    @app.route("/api/buy", methods=["POST"])
    def buy():
        u = me()
        if not u: return err("login", 401)
        p = PLANS.get(str((request.get_json(silent=True) or {}).get("plan", "")))
        if not p: return err("بسته معتبر نیست")
        cost, dur = p
        now = time.time()
        c = db()
        u = c.execute("select * from users where id=?", (u["id"],)).fetchone()
        if not is_owner(u):
            if (u["coins"] or 0) < cost:
                c.close(); return err("پیکوین کافی نداری")
            base = max(now, u["prem"] or 0)
            c.execute("update users set coins=coins-?, prem=? where id=?", (cost, base + dur, u["id"]))
            c.commit()
        r = wal(c, u["id"], now)
        c.close()
        return jsonify(**r)

    @app.route("/api/give", methods=["POST"])
    def give():
        u = me()
        if not u: return err("login", 401)
        if not is_owner(u): return err("فقط مالک می‌تونه پیکوین بده", 403)
        d = request.get_json(silent=True) or {}
        n = max(1, min(1000000, toint(d.get("n"))))
        c = db()
        if d.get("uid"):
            t = c.execute("select id from users where id=?", (toint(d.get("uid")),)).fetchone()
        else:
            t = c.execute("select id from users where username=?", (str(d.get("username", "")).strip().lower().lstrip("@"),)).fetchone()
        if not t:
            c.close(); return err("کاربر پیدا نشد", 404)
        c.execute("update users set coins=coalesce(coins,0)+? where id=?", (n, t["id"]))
        c.commit(); c.close()
        return jsonify(ok=True)

    @app.route("/api/pricon", methods=["POST"])
    def pricon():
        u = me()
        if not u: return err("login", 401)
        c = db()
        u = c.execute("select * from users where id=?", (u["id"],)).fetchone()
        if not prem_ok(u):
            c.close(); return err("پریمیوم لازمه", 403)
        d = request.get_json(silent=True) or {}
        icon = str(d.get("icon") or "").strip()
        if icon and not re.fullmatch(r"[a-z0-9_]{1,20}", icon):
            c.close(); return err("آیکون معتبر نیست")
        col = "ricon" if d.get("kind") == "r" else "picon"
        c.execute("update users set %s=? where id=?" % col, (icon, u["id"]))
        c.commit(); c.close()
        return jsonify(ok=True)

    @app.route("/api/uprofile")
    def uprofile():
        v = me()
        if not v: return err("login", 401)
        uid = toint(request.args.get("id"))
        c = db()
        t = c.execute("select * from users where id=?", (uid,)).fetchone()
        if not t:
            c.close(); return err("کاربر پیدا نشد", 404)
        pa = prem_ok(t)
        ct = bool(c.execute("select 1 from contacts where uid=? and cid=?", (v["id"], uid)).fetchone())
        c.close()
        return jsonify(now=time.time(), viewer_owner=is_owner(v),
                       user=dict(id=t["id"], name=t["name"], username=t["username"], bio=(t["bio"] or ""),
                                 last_seen=t["last_seen"], prem=pa, owner=is_owner(t),
                                 col=((t["ncol"] or "") if pa else ""), picon=((t["picon"] or "") if pa else ""), contact=ct))

    @app.route("/api/dchat", methods=["POST"])
    def dchat():
        u = me()
        if not u: return err("login", 401)
        w = toint((request.get_json(silent=True) or {}).get("uid"))
        i = u["id"]
        c = db()
        c.execute("update msgs set ha=1 where a=? and b=?", (i, w))
        c.execute("update msgs set hb=1 where a=? and b=?", (w, i))
        c.commit(); c.close()
        return jsonify(ok=True)
