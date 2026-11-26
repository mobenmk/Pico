const I18n=(()=>{
const TXT=`
چت‌ها ||| Chats
مخاطبین ||| Contacts
بازی‌ها ||| Games
منو ||| Menu
تنظیمات ||| Settings
پیکوین ||| Picoin
مشکل از سرور ||| Server problem
ورود ||| Log in
ساخت حساب ||| Create account
نام کاربری (انگلیسی) ||| Username (English letters)
اسم نمایشی ||| Display name
رمز عبور (حداقل ۴ حرف) ||| Password (at least 4 characters)
ثبت‌نام ||| Sign up
حساب داری؟ ورود ||| Have an account? Log in
حساب نداری؟ ثبت‌نام ||| No account? Sign up
حساب نداری؟ ساخت حساب ||| No account? Create one
ادامه بدون حساب (فقط بازی‌ها) ||| Continue without account (games only)
نام کاربری باید ۳ تا ۲۰ حرف انگلیسی، عدد یا _ باشه ||| Username must be 3-20 English letters, digits or _
رمز عبور خیلی کوتاهه ||| Password is too short
این نام کاربری قبلاً گرفته شده ||| This username is already taken
نام کاربری یا رمز اشتباهه ||| Wrong username or password
اول وارد حساب شو ||| Please log in first
جستجوی کاربر، گروه و کانال ||| Search users, groups and channels
هنوز چتی نداری. بالا دنبال یه نفر بگرد ||| No chats yet. Search for someone above
پیدا نشد ||| Not found
در حال اتصال... ||| Connecting...
آنلاین ||| Online
مدتی پیش ||| A while ago
عکس ||| Photo
بازگشت ||| Back
پیام... ||| Message...
پاسخ ||| Reply
کپی ||| Copy
هدایت ||| Forward
ویرایش ||| Edit
حذف ||| Delete
ویرایش پیام ||| Edit message
پاسخ به خودت ||| Reply to yourself
تو ||| You
پیام حذف شده ||| Deleted message
ویرایش‌شده ||| edited
کپی شد ||| Copied
هدایت شد ||| Forwarded
اضافه شد ||| Added
خارج شدی ||| You left
عکس خونده نشد ||| Couldn't read the photo
در حال ارسال... ||| Sending...
هدایت به... ||| Forward to...
جستجوی کاربر ||| Search users
چیزی پیدا نشد ||| Nothing found
حذف پیام ||| Delete message
حذف برای من ||| Delete for me
حذف برای هر دو ||| Delete for both
حذف برای همه ||| Delete for everyone
انصراف ||| Cancel
فقط مدیران می‌تونن توی این کانال پیام بفرستن ||| Only admins can post in this channel
فقط مدیران می‌تونن پیام بفرستن ||| Only admins can post
عضویت ||| Join
اطلاعات کانال ||| Channel info
اطلاعات گروه ||| Group info
افزودن عضو ||| Add member
ترک کانال ||| Leave channel
ترک گروه ||| Leave group
مالک ||| Owner
مدیر ||| Admin
کانال ||| Channel
گروه ||| Group
کاربری پیدا نشد ||| No user found
ساخت گروه یا کانال ||| Create group or channel
نام ||| Name
آدرس عمومی (اختیاری) ||| Public address (optional)
توضیحات (اختیاری) ||| Description (optional)
بساز ||| Create
گروه: همه‌ی اعضا می‌تونن پیام بفرستن ||| Group: all members can post
کانال: فقط مدیران پیام می‌فرستن و بقیه می‌خونن ||| Channel: only admins post, everyone else reads
توضیح (اختیاری) ||| Caption (optional)
ارسال ||| Send
دانلود ||| Download
نام لازمه ||| A name is required
آدرس باید ۴ تا ۲۵ حرف انگلیسی، عدد یا _ باشه ||| Address must be 4-25 English letters, digits or _
این آدرس قبلاً گرفته شده ||| This address is already taken
دسترسی نداری ||| Access denied
مالک نمی‌تونه ترک کنه ||| The owner can't leave
فقط مدیر می‌تونه عضو اضافه کنه ||| Only admins can add members
کاربر پیدا نشد ||| User not found
عضو نیستی ||| You are not a member
پیام خالیه ||| Message is empty
پیام پیدا نشد ||| Message not found
نمی‌شه ویرایش کرد ||| Can't edit this message
عکس معتبر نیست ||| Invalid photo
عکس خیلی بزرگه ||| Photo is too large
اسم نباید خالی باشه ||| Name can't be empty
خطا ||| Error
آنلاین · ||| Online ·
تنظیم عکس ||| Set photo
ویرایش اطلاعات ||| Edit info
حساب‌های کاربری ||| Accounts
مدیریت حساب‌ها ||| Manage accounts
تنظیمات پیکو ||| Picko settings
درباره ||| About
حساب کاربری ||| Account
اسم، نام کاربری، خروج از حساب ||| Name, username, log out
تنظیمات گفتگو ||| Chat settings
پس‌زمینه، حالت شب، انیمیشن‌ها ||| Background, night mode, animations
حریم خصوصی و امنیت ||| Privacy and security
آخرین بازدید، دستگاه‌ها، کلیدهای عبور ||| Last seen, devices, passkeys
اعلان‌ها ||| Notifications
صداها، تماس‌ها، نشانگرها ||| Sounds, calls, badges
داده‌ها و ذخیره‌سازی ||| Data and storage
تنظیمات دانلود رسانه ||| Media download settings
پوشه‌های گفتگو ||| Chat folders
مرتب‌سازی گفتگوها در پوشه‌ها ||| Organize chats into folders
دستگاه‌ها ||| Devices
مدیریت دستگاه‌های متصل شده ||| Manage connected devices
ذخیره انرژی ||| Power saving
کاهش مصرف انرژی در شارژ کم ||| Reduce power use when battery is low
زبان ||| Language
راهنمایی ||| Help
پرسیدن سؤال ||| Ask a question
پرسش‌های متداول پیکو ||| Picko FAQ
سیاست حریم خصوصی ||| Privacy policy
حالت شب ||| Night mode
انیمیشن‌ها ||| Animations
صدای پیام‌ها ||| Message sounds
اندازه‌ی متن پیام‌ها ||| Message text size
ریاکشن دوبار ضربه ||| Double-tap reaction
تغییر ||| Change
خاموش ||| Off
پس‌زمینه‌ی چت ||| Chat background
با زدن روی نام کاربری، کپی می‌شه ||| Tap the username to copy it
خروج از حساب ||| Log out
نام کاربری ||| Username
وضعیت سرور ||| Server status
متصل ||| Connected
قطع ||| Disconnected
آدرس سرور ||| Server address
ذخیره ||| Save
برگشت به حالت خودکار ||| Reset to automatic
کاهش مصرف انرژی ||| Reduce power use
با روشن بودنش انیمیشن‌ها خاموش می‌شن تا باتری کمتر مصرف بشه. ||| Turns animations off to save battery.
نسخه‌ی آزمایشی ||| Beta version
پیام‌رسان شخصی پیکو ||| Picko personal messenger
ذخیره شد ||| Saved
ذخیره نشد، سرور رو چک کن ||| Couldn't save, check the server
دانلود خودکار ||| Auto-download
دانلود خودکار عکس‌ها ||| Auto-download photos
اگه خاموش باشه، عکس‌ها فقط با زدن روی «دانلود» باز می‌شن و داده‌ی کمتری مصرف می‌شه. ||| When off, photos only load when you tap "Download", saving data.
کیفیت عکس‌های ارسالی ||| Sent photo quality
معمولی ||| Standard
بالا ||| High
کیفیت بالا عکس رو تا ۱۹۲۰ پیکسل می‌فرسته و حجم بیشتری داره. ||| High quality sends photos up to 1920 px and uses more data.
به‌زودی ||| Coming soon
عکس پروفایل عوض شد ||| Profile photo updated
آپلود نشد، سرور رو چک کن ||| Upload failed, check the server
گروه جدید ||| New group
کانال جدید ||| New channel
گفتگوی محرمانه جدید ||| New secret chat
مرتب شده بر اساس آخرین زمان بازدید ||| Sorted by last seen
برای دیدن مخاطبین وارد حساب شو ||| Log in to see your contacts
در حال بارگذاری... ||| Loading...
هنوز مخاطبی نداری. با دکمه‌ی پایین یکی اضافه کن ||| No contacts yet. Add one with the button below
افزودن مخاطب ||| Add contact
نام کاربری یا اسم ||| Username or name
انتخاب عکس ||| Choose photo
گالری ||| Gallery
استفاده از ایموجی ||| Use an emoji
نقاشی ||| Drawing
پاک کردن ||| Clear
ساخت عکس نشد ||| Couldn't create the photo
با ربات ||| With bots
با دوستان روی همین گوشی ||| With friends on this phone
۲ نفره ||| 2 players
۳ نفره ||| 3 players
۴ نفره ||| 4 players
بازی کن ||| Play
تو در برابر ربات‌ها، بدون اینترنت و بدون سرور ||| You vs bots, no internet or server needed
همه نوبتی روی همین گوشی بازی می‌کنین ||| Take turns playing on this phone
بازی آنلاین بعد از ساخت سرور اضافه می‌شه ||| Online play will be added after the server is built
تاس رو بزن ||| Roll the dice
مهره رو انتخاب کن ||| Pick a piece
حرکتی نداره ||| No moves
بردی ||| You won
دفعه‌ی بعد ||| Better luck next time
دوباره ||| Again
نوبت ||| Turn
بایگانی ||| Archive
بایگانی‌شده ||| Archived
گفتگوهای بایگانی‌شده ||| Archived chats
گفتگو ||| chats
گفتگوی بایگانی‌شده‌ای نداری ||| No archived chats
خروج از بایگانی ||| Unarchive
صدادار ||| Unmute
صدادار کردن ||| Unmute
بی‌صدا ||| Mute
حذف گفتگو ||| Delete chat
ترک و حذف گفتگو ||| Leave and delete chat
بایگانی شد ||| Archived
از بایگانی خارج شد ||| Removed from archive
بی‌صدا شد ||| Muted
صدادار شد ||| Unmuted
حذف شد ||| Deleted
تماس ||| Call
پیام ||| Message
بیوگرافی ||| Bio
هدیه‌ی پیکوین ||| Gift Picoin
افزودن به مخاطبین ||| Add to contacts
در مخاطبین هستی ||| In your contacts
پریمیوم و پیکوین ||| Premium and Picoin
پریمیوم رو با پیکوین بخر ||| Buy Premium with Picoin
پیکوین شما ||| Your Picoin
وضعیت پریمیوم ||| Premium status
مزایای پریمیوم ||| Premium benefits
خرید پریمیوم ||| Buy Premium
پیکوین از کجا؟ ||| Where do I get Picoin?
لودو بازی کن و ببر ||| Play Ludo and win
پنل مالک ||| Owner panel
ارسال پیکوین ||| Send Picoin
نامحدود (مالک) ||| Unlimited (owner)
رایگان ||| Free
رنگ دلخواه ||| Custom color
گرادیان ||| Gradient
کد رنگ ||| Color code
پیام دریافتی ||| Received message
پیام ارسالی ||| Sent message
آیکون پاسخ‌ها ||| Reply icon
آیکون پروفایل ||| Profile icon
دریافت ||| Get
تغییر رنگ نام ویژه‌ی پریمیوم است ||| Changing name color is a Premium feature
آیکون ویژه‌ی پریمیوم است ||| Icons are a Premium feature
برای تغییر رنگ نام پریمیوم لازمه ||| Premium is required to change name color
پریمیوم لازمه ||| Premium required
پیکوین کافی نداری ||| Not enough Picoin
پریمیوم فعال شد ||| Premium activated
پیکوین ارسال شد ||| Picoin sent
ارسال شد ||| Sent
پس‌زمینه گفتگو ||| Chat background
پس‌زمینه لیست گفتگوها ||| Chat list background
انتخاب از گالری ||| Choose from gallery
تنظیم رنگ ||| Set color
غیرفعال کردن پس‌زمینه لیست گفتگوها ||| Disable chat list background
رنگی را انتخاب کنید ||| Choose a color
تغییر رنگ نام ||| Change name color
پروفایل ||| Profile
پاسخ به پیام شما ||| Reply to your message
نام شما در گروه‌ها و پاسخ‌ها با رنگ انتخاب‌شده نمایش داده می‌شود. ||| Your name in groups and replies is shown in the chosen color.
افزودن آیکون به پاسخ‌ها ||| Add icon to replies
افزودن آیکون به پروفایل ||| Add icon to profile
غیرفعال ||| Off
از این رنگ برای نام شما، پاسخ‌هایی که ارسال می‌کنید استفاده خواهد شد. ||| This color is used for your name and the replies you send.
اعمال ||| Apply
جستجوی پوسته‌ها ||| Search themes
دانه‌های برف ||| Snowflakes
آتش‌بازی ||| Fireworks
تصویر خیلی بزرگه ||| Image is too large
رنگ معتبر نیست ||| Invalid color
نام شما ||| Your name
نام خانوادگی ||| Last name
درباره ||| About
چند کلمه درباره شما. ||| A few words about you.
اطلاعات شما ||| Your info
تولد ||| Birthday
تعیین نشده ||| Not set
تاریخ تولد فقط روی همین گوشی ذخیره می‌شه. ||| Your birthday is only saved on this phone.
کانال شخصی ||| Personal channel
خودکارسازی گفتگو ||| Chat automation
جدید ||| NEW
رباتی را انتخاب کنید که از طرف شما به پیام‌ها پاسخ دهد. ||| Choose a bot to answer messages on your behalf.
خروج از حساب کاربری ||| Log out of account
اندازه متن پیام ||| Message text size
تغییر پس‌زمینه گفتگو ||| Change chat background
تغییر پس‌زمینه لیست گفتگوها ||| Change chat list background
تغییر رنگ نام ||| Change name color
افکت پس زمینه ||| Background effect
بر اساس تاریخ ||| By date
نوع حباب پیام ||| Message bubble type
شیشه‌ای ||| Glass
ساده ||| Solid
نوع تیک خوانده شدن پیام ||| Read receipt style
استاندارد ||| Standard
پوسته رنگی ||| Color theme
تغییر به حالت روز ||| Switch to day mode
تغییر به حالت شب ||| Switch to night mode
گوشه‌های پیام ||| Message corners
نمای لیست گفتگوها ||| Chat list view
دو خطی ||| Two lines
سه خطی ||| Three lines
آیکون برنامه ||| App icon
پیش‌فرض ||| Default
کلاسیک ||| Classic
اقیانوس ||| Ocean
غروب ||| Sunset
الگوی حرکتی کشیدن در لیست گفتگوها ||| Chat list swipe action
بایگانی کردن ||| Archive
بی‌صدا کردن ||| Mute
حذف کردن ||| Delete
انتخاب کنید که در هنگام کشیدن به سمت چپ در لیست گفتگوها، کدام عملیات انجام شود. (به‌زودی) ||| Choose what happens when you swipe left on a chat. (Coming soon)
حالت شب خودکار ||| Auto night mode
پیش‌فرض سیستم تاریک ||| System default (dark)
مرورگر درون‌برنامه ||| In-app browser
لینک‌های خارجی در داخل برنامه باز شوند ||| Open external links inside the app
جلوه‌های حرکتی را برای ذخیره انرژی خاموش کنید ||| Turn motion effects off to save power
استیکرها و اموجی‌ها ||| Stickers and emoji
مدیریت استیکرها، اموجی‌ها و واکنش‌ها ||| Manage stickers, emoji and reactions
رسانه‌ها و صدا ||| Media and sound
زدن برای نمایش رسانه بعدی ||| Tap for next media
در هنگام مشاهده رسانه‌ها، در نزدیکی لبه صفحه بزنید تا رسانه‌های دیگر را مشاهده کنید ||| While viewing media, tap near the screen edge to see other media
بالا بردن جهت گوش دادن ||| Raise to listen
با بالا بردن تلفن همراه به سمت گوش خود، صدا را به هندزفری انتقال دهید ||| Raise the phone to your ear to switch audio to the earpiece
بالا بردن جهت صحبت ||| Raise to speak
با بالا بردن تلفن همراه به سمت گوش خود، پیام‌های صوتی ضبط کنید ||| Raise the phone to your ear to record voice messages
مکث موزیک در هنگام ضبط ||| Pause music while recording
هنگامی که شروع به ضبط پیام ویدیویی می‌کنید، موزیک مکث شود ||| Pause music when you start recording a video message
مکث موزیک هنگام پخش رسانه ||| Pause music while playing media
میکروفن پیام‌های صوتی ||| Voice message microphone
داخلی ||| Built-in
سایر تنظیمات ||| Other settings
به اشتراک‌گذاری مستقیم ||| Direct share
نمایش گفتگوهای اخیر در منوی به اشتراک‌گذاری اندروید ||| Show recent chats in the Android share menu
ارسال با Enter ||| Send with Enter
واحدهای فاصله ||| Distance units
خودکار ||| Automatic
`;
const EN=new Map();
TXT.split('\n').forEach(l=>{const i=l.indexOf(' ||| ');if(i>0)EN.set(l.slice(0,i).trim(),l.slice(i+5).trim())});
[['قرمز','Red'],['سبز','Green'],['زرد','Yellow'],['آبی','Blue']].forEach(([f,e])=>{
 EN.set('ربات '+f,e+' bot');EN.set('بازیکن '+f,e+' player');
 EN.set('ربات '+f+' برد',e+' bot won');EN.set('بازیکن '+f+' برد',e+' player won');
});
const RX=[
 [/^([\d۰-۹]+) انتخاب شده$/,'$1 selected'],
 [/^پاسخ به (.+)$/,'Reply to $1'],
 [/^هدایت‌شده از (.+)$/,'Forwarded from $1'],
 [/^آخرین بازدید امروز (.+)$/,'Last seen today $1'],
 [/^آخرین بازدید دیروز (.+)$/,'Last seen yesterday $1'],
 [/^آخرین بازدید (.+)$/,'Last seen $1'],
 [/^حذف ([\d۰-۹]+) پیام$/,'Delete $1 messages'],
 [/^([\d۰-۹٫.]+) میلیون عضو$/,'$1 million members'],
 [/^([\d۰-۹٬,]+) عضو$/,'$1 members'],
 [/^\+([\d۰-۹]+) پیکوین$/,'+$1 Picoin'],
 [/^([\d۰-۹]+) پیکسل$/,'$1 px']
];
const DA=[
 [/حذف شده/g,'پاک شده'],[/حذف/g,'پاک کردن'],
 [/می‌تونن/g,'می‌توانند'],[/می‌تونی/g,'می‌توانی'],[/می‌تونه/g,'می‌تواند'],
 [/می‌شه/g,'می‌شود'],[/می‌شن/g,'می‌شوند'],
 [/می‌خونن/g,'می‌خوانند'],[/می‌فرستن/g,'می‌فرستند'],[/می‌فرسته/g,'می‌فرستد'],[/می‌کنین/g,'می‌کنید'],
 [/خونده/g,'خوانده'],[/اگه/g,'اگر'],
 [/(^|\s)یه(?=\s)/g,'$1یک'],
 [/(^|\s)رو(?=\s|$|[.،؟!])/g,'$1را'],
 [/نداره/g,'ندارد'],[/لازمه/g,'لازم است'],[/خالیه/g,'خالی است'],[/کوتاهه/g,'کوتاه است'],[/بزرگه/g,'بزرگ است'],[/اشتباهه/g,'اشتباه است'],[/باشه/g,'باشد'],
 [/دوربین/g,'کمره'],[/کپی/g,'کاپی'],[/پاسخ/g,'جواب'],[/خروج از/g,'بیرون شدن از'],[/اعلان‌ها/g,'اطلاعیه‌ها'],[/اسم/g,'نام']
];
const ME={'فروردین':'Farvardin','اردیبهشت':'Ordibehesht','خرداد':'Khordad','تیر':'Tir','مرداد':'Mordad','شهریور':'Shahrivar','مهر':'Mehr','آبان':'Aban','آذر':'Azar','دی':'Dey','بهمن':'Bahman','اسفند':'Esfand'};
const MD={'فروردین':'حمل','اردیبهشت':'ثور','خرداد':'جوزا','تیر':'سرطان','مرداد':'اسد','شهریور':'سنبله','مهر':'میزان','آبان':'عقرب','آذر':'قوس','دی':'جدی','بهمن':'دلو','اسفند':'حوت'};
let lang=store.get('lang','fa');
function tr(s){
 if(lang=='fa'||!s)return s;
 const m=/^(\s*)([\s\S]*?)(\s*)$/.exec(s);
 let c=m[2];if(!c)return s;
 const mon=c.match(/^(آخرین بازدید [\d۰-۹]+ )(\S+)$/);
 if(lang=='en'){
  if(mon)c=mon[1]+(ME[mon[2]]||mon[2]);
  let out=EN.get(c);
  if(out===undefined){
   out=c;
   for(const [r,t] of RX){if(r.test(c)){out=c.replace(r,t);break}}
  }
  out=out.replace(/[۰-۹]/g,d=>'۰۱۲۳۴۵۶۷۸۹'.indexOf(d)).replace(/٫/g,'.').replace(/٬/g,',');
  return m[1]+out+m[3];
 }
 if(mon)c=mon[1]+(MD[mon[2]]||mon[2]);
 for(const [r,t] of DA)c=c.replace(r,t);
 return m[1]+c+m[3];
}
const AT=['placeholder','data-ph','title'];
const orig=new WeakMap();
function skipEl(e){return e&&e.closest&&e.closest('.bt,#ci,.rp span,textarea,script,style')}
function text(n){
 const p=n.parentElement;if(!p||skipEl(p))return;
 const v=n.nodeValue,o=orig.get(n);
 const src=(o&&v===o.out)?o.src:v;
 const out=tr(src);
 orig.set(n,{src,out});
 if(out!==v)n.nodeValue=out;
}
function attrs(e){
 if(e.closest&&e.closest('.bt'))return;
 AT.forEach(a=>{
  if(!e.hasAttribute(a))return;
  const v=e.getAttribute(a),k='_i_'+a,o=e[k];
  const src=(o&&v===o.out)?o.src:v;
  const out=tr(src);
  e[k]={src,out};
  if(out!==v)e.setAttribute(a,out);
 });
}
function walk(n){
 if(n.nodeType==3){text(n);return}
 if(n.nodeType!=1)return;
 const t=n.tagName;if(t=='SCRIPT'||t=='STYLE')return;
 attrs(n);
 n.childNodes.forEach(walk);
}
const mo=new MutationObserver(ms=>{
 for(const m of ms){
  if(m.type=='childList')m.addedNodes.forEach(walk);
  else if(m.type=='characterData')text(m.target);
  else if(m.type=='attributes')attrs(m.target);
 }
});
function dirs(){
 const h=document.documentElement;
 h.lang=lang=='en'?'en':(lang=='da'?'fa-AF':'fa');
 h.dir=lang=='en'?'ltr':'rtl';
}
function set(c){
 lang=c;store.set('lang',c);dirs();
 walk(document.body);
 if(typeof MenuUI!=='undefined')MenuUI.refresh();
}
if(lang!='fa'){dirs();walk(document.body)}
mo.observe(document.documentElement,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:AT});
return{set,get:()=>lang};
})();
