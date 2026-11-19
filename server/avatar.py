import re, time, base64
from flask import request, jsonify, Response

def setup(app, db, me, err, toint):
    c = db()
    c.execute("create table if not exists avatars(uid integer primary key, data blob, ts real)")
    c.commit(); c.close()

    @app.route("/api/avatar", methods=["POST"])
    def avatar_set():
        u = me()
        if not u: return err("login", 401)
        d = request.get_json(silent=True) or {}
        m = re.match(r"data:image/jpeg;base64,(.+)$", str(d.get("img", "")), re.S)
        if not m: return err("عکس معتبر نیست")
        try:
            raw = base64.b64decode(m.group(1))
        except Exception:
            return err("عکس معتبر نیست")
        if len(raw) > 300000: return err("عکس خیلی بزرگه")
        c = db()
        c.execute("insert or replace into avatars(uid,data,ts) values(?,?,?)", (u["id"], raw, time.time()))
        c.commit(); c.close()
        return jsonify(ok=True)

    @app.route("/api/avatar/<int:uid>")
    def avatar_get(uid):
        c = db()
        r = c.execute("select data from avatars where uid=?", (uid,)).fetchone()
        c.close()
        if not r: return Response(status=404)
        return Response(bytes(r["data"]), mimetype="image/jpeg", headers={"Cache-Control": "public, max-age=30"})
