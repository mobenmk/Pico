#!/data/data/com.termux/files/usr/bin/bash
read -p "Gmail: " U
read -s -p "App Password: " P; echo
python - "$U" "$P" << 'PY'
import sys,json,os
p=os.path.expanduser('~/picko2/server/mail.conf')
json.dump({"user":sys.argv[1].strip(),"app_password":sys.argv[2].replace(' ','')},open(p,'w'))
os.chmod(p,0o600);print("ذخیره شد")
PY
