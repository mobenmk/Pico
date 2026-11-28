#!/data/data/com.termux/files/usr/bin/bash
termux-wake-lock 2>/dev/null
pkill -f server.py; pkill -f cloudflared
cd ~/picko2/server
python server.py > ~/server.log 2>&1 &
sleep 2
cloudflared tunnel --no-autoupdate --protocol http2 --url http://127.0.0.1:5000 > ~/tunnel.log 2>&1 &
URL=""
for i in $(seq 1 45); do
  URL=$(grep -o 'https://[a-z0-9-]*\.trycloudflare\.com' ~/tunnel.log | head -1)
  [ -n "$URL" ] && break
  sleep 1
done
if [ -z "$URL" ]; then
  echo "لینک ساخته نشد:"; tail -8 ~/tunnel.log
  pkill -f server.py; pkill -f cloudflared; exit 1
fi
echo "آدرس: $URL"
cd ~/picko-link
git checkout -B main -q 2>/dev/null
echo "{\"url\":\"$URL\"}" > server.json
git add server.json; git commit -qm link
git push -q -u origin main && echo "لینک به برنامه‌ها اعلام شد" || echo "پوش به GitHub خطا داد"
echo "سرور روشنه. با Ctrl+C خاموش کن"
trap 'pkill -f server.py; pkill -f cloudflared; exit' INT TERM
wait
