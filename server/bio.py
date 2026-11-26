import re
from flask import request, jsonify

def setup(app, db, me, err, toint):
    c = db()
    cols = [r[1] for r in c.execute("pragma table_info(users)")]
    for n in ("bio", "ncol"):
        if n not in cols:
            c.execute("alter table users add column %s text" % n)
    c.commit(); c.close()

    @app.route("/api/pbio", methods=["GET", "POST"])
    def pbio():
        u = me()
        if not u: return err("login", 401)
        c = db()
        if request.method == "POST":
            bio = str((request.get_json(silent=True) or {}).get("bio", "")).strip()[:70]
            c.execute("update users set bio=? where id=?", (bio, u["id"]))
            c.commit(); c.close()
            return jsonify(ok=True)
        r = c.execute("select bio,ncol from users where id=?", (u["id"],)).fetchone()
        c.close()
        return jsonify(bio=(r["bio"] or "") if r else "", col=(r["ncol"] or "") if r else "")

    @app.route("/api/pcol", methods=["POST"])
    def pcol():
        u = me()
        if not u: return err("login", 401)
        col = str((request.get_json(silent=True) or {}).get("col", "")).strip()
        if col and not re.fullmatch(r"#[0-9a-fA-F]{6}(,#[0-9a-fA-F]{6})?", col):
            return err("رنگ معتبر نیست")
        c = db()
        c.execute("update users set ncol=? where id=?", (col, u["id"]))
        c.commit(); c.close()
        return jsonify(ok=True)
