from flask import request, jsonify

def setup(app, db, me, err, toint):
    c = db()
    cols = [r[1] for r in c.execute("pragma table_info(users)")]
    if "bio" not in cols:
        c.execute("alter table users add column bio text")
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
        r = c.execute("select bio from users where id=?", (u["id"],)).fetchone()
        c.close()
        return jsonify(bio=(r["bio"] or "") if r else "")
