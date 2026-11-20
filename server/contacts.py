import time
from flask import request, jsonify

def setup(app, db, me, err, toint):
    c = db()
    c.execute("create table if not exists contacts(uid integer, cid integer, primary key(uid,cid))")
    c.commit(); c.close()

    @app.route("/api/contacts")
    def contacts_list():
        u = me()
        if not u: return err("login", 401)
        i = u["id"]
        c = db()
        rows = c.execute("""select x.id,x.username,x.name,x.last_seen from users x
          where x.id!=? and (x.id in (select cid from contacts where uid=?)
          or x.id in (select b from msgs where a=? and b>0 union select a from msgs where b=?))
          order by x.last_seen desc""", (i, i, i, i)).fetchall()
        c.close()
        return jsonify(users=[dict(r) for r in rows], now=time.time())

    @app.route("/api/contact_add", methods=["POST"])
    def contact_add():
        u = me()
        if not u: return err("login", 401)
        d = request.get_json(silent=True) or {}
        cid = toint(d.get("uid"))
        c = db()
        if cid == u["id"] or not c.execute("select 1 from users where id=?", (cid,)).fetchone():
            c.close(); return err("کاربر پیدا نشد", 404)
        c.execute("insert or ignore into contacts(uid,cid) values(?,?)", (u["id"], cid))
        c.commit(); c.close()
        return jsonify(ok=True)

    @app.route("/api/pname", methods=["POST"])
    def pname():
        u = me()
        if not u: return err("login", 401)
        name = str((request.get_json(silent=True) or {}).get("name", "")).strip()[:30]
        if not name: return err("اسم نباید خالی باشه")
        c = db()
        c.execute("update users set name=? where id=?", (name, u["id"]))
        c.commit(); c.close()
        return jsonify(ok=True)
