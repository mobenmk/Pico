import re, time, base64, secrets
from flask import request, jsonify, Response

def setup(app, db, me, err, toint):
    c = db()
    c.execute("create table if not exists photos(id text primary key, uid integer, data blob, w integer, h integer, ts real)")
    c.commit(); c.close()

    @app.route("/api/photo", methods=["POST"])
    def photo_up():
        u = me()
        if not u: return err("login", 401)
        d = request.get_json(silent=True) or {}
        m = re.match(r"data:image/jpeg;base64,(.+)$", str(d.get("img", "")), re.S)
        if not m: return err("عکس معتبر نیست")
        try:
            raw = base64.b64decode(m.group(1))
        except Exception:
            return err("عکس معتبر نیست")
        if raw[:2] != b"\xff\xd8": return err("عکس معتبر نیست")
        if len(raw) > 1500000: return err("عکس خیلی بزرگه")
        w = max(1, min(4000, toint(d.get("w")) or 1))
        h = max(1, min(4000, toint(d.get("h")) or 1))
        pid = secrets.token_hex(12)
        c = db()
        c.execute("insert into photos(id,uid,data,w,h,ts) values(?,?,?,?,?,?)", (pid, u["id"], raw, w, h, time.time()))
        c.commit(); c.close()
        return jsonify(id=pid, w=w, h=h)

    @app.route("/api/photo/<pid>")
    def photo_get(pid):
        if not re.fullmatch(r"[a-f0-9]{24}", pid):
            return Response(status=404)
        c = db()
        r = c.execute("select data from photos where id=?", (pid,)).fetchone()
        c.close()
        if not r: return Response(status=404)
        return Response(bytes(r["data"]), mimetype="image/jpeg", headers={"Cache-Control": "public, max-age=31536000, immutable"})
