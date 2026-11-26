import re, time
from flask import request, jsonify
import conv

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
        r = c.execute("select bio,ncol,ricon,picon from users where id=?", (u["id"],)).fetchone()
        c.close()
        if not r: return jsonify(bio="", col="", ricon="", picon="")
        return jsonify(bio=r["bio"] or "", col=r["ncol"] or "", ricon=r["ricon"] or "", picon=r["picon"] or "")

    @app.route("/api/pcol", methods=["POST"])
    def pcol():
        u = me()
        if not u: return err("login", 401)
        col = str((request.get_json(silent=True) or {}).get("col", "")).strip()
        if col and not re.fullmatch(r"#[0-9a-fA-F]{6}(,#[0-9a-fA-F]{6})?", col):
            return err("رنگ معتبر نیست")
        if col and not (u["username"] == conv.OWNER or (u["prem"] or 0) > time.time()):
            return err("برای تغییر رنگ نام پریمیوم لازمه", 403)
        c = db()
        c.execute("update users set ncol=? where id=?", (col, u["id"]))
        c.commit(); c.close()
        return jsonify(ok=True)
