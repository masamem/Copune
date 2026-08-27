import { useState, type FormEvent, type ReactNode } from "react";
import { Bell, CheckCircle2, Clock, Flame, Heart, LogOut, Mail, MapPin, SearchX, ShieldCheck, Store as StoreIcon, Ticket, User as UserIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { deals, faqs } from "../lib/data";
import { fmt, usePageMeta } from "../lib/utils";
import { useApp } from "../state/AppContext";
import { CouponCard, DealCard, StoreCard } from "../components/cards";
import { Acc, Crumbs, Empty, Reveal, SectionHead, Tick } from "../components/ui";

/* ================= AUTH ================= */
export function AuthPage() {
  const [tab, setTab] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");
  const { login } = useApp();
  const navigate = useNavigate();

  usePageMeta("تسجيل الدخول | وفّر", "أنشئ حسابك في وفّر لمتابعة متاجرك المفضلة واستقبال تنبيهات الكوبونات الجديدة.");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return setErr("أدخل بريداً إلكترونياً صحيحاً");
    if (pass.length < 6) return setErr("كلمة المرور 6 أحرف على الأقل");
    if (tab === "register" && name.trim().length < 2) return setErr("أدخل اسمك الكامل");
    setErr("");
    login(tab === "register" ? name.trim() : email.split("@")[0], email, tab === "register");
    navigate("/favorites");
  };

  return (
    <div className="container-x grid items-center gap-10 py-12 lg:grid-cols-2 lg:py-16">
      <Reveal>
        <div className="mx-auto w-full max-w-md">
          <h1 className="font-display text-2xl font-black text-ink-950 sm:text-3xl">{tab === "login" ? "مرحباً بعودتك" : "أنشئ حسابك مجاناً"}</h1>
          <p className="mt-2 text-sm leading-7 text-ink-500">
            {tab === "login" ? "سجّل دخولك للوصول إلى متاجرك المتابَعة وعروضك المحفوظة." : "حساب واحد يكفي لمتابعة كل توفيرك."}
          </p>

          <div className="mt-6 grid grid-cols-2 rounded-xl bg-ink-100/70 p-1">
            {([{ id: "login", l: "تسجيل الدخول" }, { id: "register", l: "حساب جديد" }] as const).map((t) => (
              <button key={t.id} onClick={() => { setTab(t.id); setErr(""); }} className={`rounded-lg py-2.5 text-sm font-bold transition ${tab === t.id ? "bg-white text-brand-900 shadow-soft" : "text-ink-500"}`}>
                {t.l}
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="surface mt-4 space-y-4 p-5">
            {tab === "register" && (
              <div>
                <label className="mb-1.5 block text-xs font-bold text-ink-700">الاسم الكامل</label>
                <input value={name} onChange={(e) => setName(e.target.value)} className="field" placeholder="مثال: سارة العتيبي" />
              </div>
            )}
            <div>
              <label className="mb-1.5 block text-xs font-bold text-ink-700">البريد الإلكتروني</label>
              <input type="email" dir="ltr" value={email} onChange={(e) => setEmail(e.target.value)} className="field text-left" placeholder="you@email.com" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold text-ink-700">كلمة المرور</label>
              <input type="password" dir="ltr" value={pass} onChange={(e) => setPass(e.target.value)} className="field text-left" placeholder="••••••••" />
            </div>
            {err && <p className="rounded-lg bg-flame-50 px-3 py-2 text-xs font-bold text-flame-700">{err}</p>}
            <button type="submit" className="btn-press w-full rounded-lg bg-brand-950 py-3 text-sm font-bold text-white hover:bg-brand-800">
              {tab === "login" ? "دخول" : "إنشاء الحساب"}
            </button>
            <p className="text-center text-[11px] leading-5 text-ink-400">
              نسخة تجريبية تعمل محلياً على جهازك — نظام الحسابات الكامل يُطلق قريباً.
            </p>
          </form>
        </div>
      </Reveal>

      <Reveal delay={120}>
        <div className="dot-grid relative hidden overflow-hidden rounded-2xl bg-brand-950 p-10 lg:block">
          <div className="pointer-events-none absolute -end-20 -top-20 h-64 w-64 rounded-full bg-brand-700/40 blur-3xl" />
          <h2 className="relative font-display text-2xl font-black leading-snug text-white">حسابك = توفير أذكى</h2>
          <ul className="relative mt-6 space-y-4">
            {[
              { i: <StoreIcon className="h-5 w-5" />, t: "تابع متاجرك المفضلة", d: "ونعرض كوبوناتها أولاً بأول في صفحتك." },
              { i: <Bell className="h-5 w-5" />, t: "تنبيه فوري عند نزول كوبون جديد", d: "عبر البريد أو واتساب أو تيليجرام." },
              { i: <Heart className="h-5 w-5" />, t: "احفظ العروض للرجوع إليها", d: "قائمة محفوظة جاهزة وقت الشراء." },
              { i: <Clock className="h-5 w-5" />, t: "سجل آخر الكوبونات التي استخدمتها", d: "لتعرف أي كود وفّر لك أكثر." },
            ].map((b) => (
              <li key={b.t} className="flex gap-3.5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-gold-300 ring-1 ring-white/10">{b.i}</span>
                <span>
                  <span className="block font-display text-sm font-bold text-white">{b.t}</span>
                  <span className="mt-0.5 block text-xs leading-6 text-brand-200">{b.d}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </div>
  );
}

/* ================= FAVORITES ================= */
export function FavoritesPage() {
  const { user, logout, favs, recent, allCoupons } = useApp();
  const [tab, setTab] = useState<"stores" | "saved" | "recent">("stores");

  usePageMeta("مفضلتي | وفّر", "متاجرك المتابَعة وعروضك المحفوظة وآخر الكوبونات التي استخدمتها.");

  const savedCoupons = allCoupons.filter((c) => favs.coupons.includes(c.id));
  const savedDealsIds = favs.deals;
  const recentCoupons = recent.map((r) => ({ r, c: allCoupons.find((c) => c.id === r.id) })).filter((x) => x.c);

  return (
    <div className="container-x py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-black text-ink-950 sm:text-3xl">مفضلتي</h1>
          <p className="mt-1 text-sm text-ink-500">{user ? `أهلاً ${user.name} — كل توفيرك في مكان واحد.` : "سجّل الدخول لمزامنة مفضلتك."}</p>
        </div>
        {user && (
          <button onClick={logout} className="btn-press flex items-center gap-2 rounded-lg border border-ink-200 px-4 py-2.5 text-[13px] font-bold text-ink-600 transition hover:border-flame-300 hover:bg-flame-50 hover:text-flame-700">
            <LogOut className="h-4 w-4" />
            تسجيل الخروج
          </button>
        )}
      </div>

      {!user && (
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gold-200 bg-gold-50 p-4">
          <p className="text-[13px] font-semibold text-gold-800">المفضلة محفوظة على هذا الجهاز حالياً — أنشئ حساباً لمزامنتها واستقبال التنبيهات.</p>
          <Link to="/login" className="btn-press rounded-lg bg-brand-950 px-4 py-2 text-xs font-bold text-white">إنشاء حساب</Link>
        </div>
      )}

      <div className="mt-6 flex gap-2">
        {([{ id: "stores", l: `المتاجر المتابَعة (${favs.stores.length})` }, { id: "saved", l: `العروض المحفوظة (${savedCoupons.length + savedDealsIds.length})` }, { id: "recent", l: `آخر ما استخدمت (${recent.length})` }] as const).map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`chip !px-4 !py-2 !text-xs transition ${tab === t.id ? "bg-brand-950 text-white" : "bg-white text-ink-600 ring-1 ring-ink-200 hover:bg-ink-50"}`}>
            {t.l}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {tab === "stores" && (
          favs.stores.length === 0 ? (
            <Empty icon={<StoreIcon className="h-7 w-7" />} title="لا تتابع أي متجر بعد" desc="اضغط أيقونة القلب على أي متجر ليصلك جديد كوبوناته هنا." action={<Link to="/stores" className="btn-press rounded-lg bg-brand-950 px-5 py-2.5 text-sm font-bold text-white">تصفح المتاجر</Link>} />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {favs.stores.map((s, i) => <StoreCard key={s} slug={s} delay={i * 50} />)}
            </div>
          )
        )}

        {tab === "saved" && (
          savedCoupons.length === 0 && savedDealsIds.length === 0 ? (
            <Empty icon={<Heart className="h-7 w-7" />} title="لا عروض محفوظة" desc="احفظ أي كوبون أو عرض بالضغط على القلب وسنجده لك هنا." action={<Link to="/deals" className="btn-press rounded-lg bg-brand-950 px-5 py-2.5 text-sm font-bold text-white">تصفح العروض</Link>} />
          ) : (
            <div className="grid gap-5 lg:grid-cols-2">
              {savedCoupons.map((c, i) => <CouponCard key={c.id} c={c} delay={i * 50} />)}
              {savedDealsIds.map((id) => <SavedDeal key={id} id={id} />)}
            </div>
          )
        )}

        {tab === "recent" && (
          recentCoupons.length === 0 ? (
            <Empty icon={<Clock className="h-7 w-7" />} title="لم تستخدم أي كوبون بعد" desc="عند كشف أي كود سيظهر هنا مع وقت استخدامه." action={<Link to="/" className="btn-press rounded-lg bg-brand-950 px-5 py-2.5 text-sm font-bold text-white">اكتشف كوبونات اليوم</Link>} />
          ) : (
            <div className="space-y-3">
              {recentCoupons.map(({ r, c }) => (
                <div key={r.id} className="grid items-stretch gap-3 lg:grid-cols-[1fr_auto]">
                  <CouponCard c={c!} />
                  <p className="flex items-center gap-2 self-center text-xs font-bold text-ink-400 lg:px-2">
                    <Clock className="h-4 w-4" />
                    {new Date(r.at).toLocaleString("ar-SA", { hour: "2-digit", minute: "2-digit", day: "numeric", month: "short" })}
                  </p>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}

function SavedDeal({ id }: { id: string }) {
  const d = deals.find((x) => x.id === id);
  if (!d) return null;
  return <DealCard d={d} />;
}

/* ================= ABOUT ================= */
export function AboutPage() {
  const { allCoupons, allStores } = useApp();
  usePageMeta("عن وفّر | منصة كوبونات السعودية", "تعرف على قصة وفّر — منصة سعودية تجمع أكواد الخصم المجرّبة والعروض المحدثة لتوفير حقيقي.");
  return (
    <div className="container-x py-12">
      <Crumbs items={[{ label: "الرئيسية", to: "/" }, { label: "عن وفّر" }]} />
      <div className="mt-8 max-w-3xl">
        <h1 className="font-display text-3xl font-black leading-snug text-ink-950 sm:text-4xl">
          نؤمن أن التوفير <span className="text-brand-700">حق للجميع</span> — وأن الكوبون الجيد يستحق التحقق
        </h1>
        <p className="mt-5 text-[15px] leading-8 text-ink-600">
          وُلد «وفّر» من إحباط بسيط: البحث عن كود خصم يعمل فعلاً يستغرق وقتاً أطول من التسوق نفسه. عشرات المواقع المليئة بالأكواد المنتهية والبنرات المزعجة. فقررنا بناء النقيض — منصة سعودية نظيفة وسريعة، كل كود فيها مجرّب، وكل رقم فيها حقيقي.
        </p>
      </div>

      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {[
          { t: "أكواد مجرّبة يدوياً", d: "فريقنا يختبر كل كود قبل نشره ويعيد فحصه دورياً، وتقييمات المستخدمين تحدّث نسبة النجاح لحظياً." },
          { t: "سرعة قبل كل شيء", d: "من البحث إلى الكود المنسوخ في أقل من 10 ثوانٍ — بدون حسابات إجبارية أو خطوات زائدة." },
          { t: "شفافية كاملة", d: "نعرض نسب النجاح الحقيقية وعدد مرات الاستخدام، ونفصح بوضوح عن عمولات الأفلييت." },
        ].map((v, i) => (
          <Reveal key={v.t} delay={i * 80}>
            <div className="surface h-full border-s-4 border-s-gold-400 p-6">
              <h2 className="font-display text-lg font-extrabold text-ink-950">{v.t}</h2>
              <p className="mt-2 text-sm leading-7 text-ink-500">{v.d}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="mt-12 grid gap-5 rounded-2xl bg-brand-950 p-8 sm:grid-cols-3 sm:p-10">
        {[
          { n: `${allCoupons.length}+`, t: "كوبون نشط اليوم" },
          { n: `${allStores.length}`, t: "متجر موثوق" },
          { n: "4", t: "دول خليجية على خارطة الطريق" },
        ].map((s) => (
          <div key={s.t} className="text-center sm:text-start">
            <p className="num font-display text-4xl font-black text-gold-400">{s.n}</p>
            <p className="mt-1 text-sm font-bold text-brand-200">{s.t}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 max-w-3xl">
        <h2 className="font-display text-2xl font-black text-ink-950">خارطة الطريق</h2>
        <div className="mt-6 space-y-0">
          {[
            { t: "الآن", d: "إطلاق كامل للسوق السعودي مع التحقق اليومي من الأكواد." },
            { t: "قريباً", d: "تطبيق جوال وتنبيهات فورية عبر واتساب وتيليجرام." },
            { t: "لاحقاً", d: "التوسع للإمارات والكويت وقطر والبحرين وعُمان." },
          ].map((s, i) => (
            <div key={s.t} className="relative flex gap-5 pb-8 last:pb-0">
              {i < 2 && <span className="absolute start-[7px] top-5 h-full w-0.5 border-s-2 border-dashed border-ink-200" />}
              <span className="relative z-10 mt-1 h-4 w-4 shrink-0 rounded-full border-4 border-gold-400 bg-white" />
              <span>
                <span className="block font-display text-base font-extrabold text-ink-950">{s.t}</span>
                <span className="mt-0.5 block text-sm leading-7 text-ink-500">{s.d}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ================= FAQ ================= */
export function FAQPage() {
  usePageMeta("الأسئلة الشائعة | وفّر", "إجابات عن أهم الأسئلة حول استخدام كوبونات وأكواد الخصم في وفّر.");
  return (
    <div className="container-x max-w-4xl py-12">
      <Crumbs items={[{ label: "الرئيسية", to: "/" }, { label: "الأسئلة الشائعة" }]} />
      <SectionHead eyebrow="نجيبك بصراحة" title="الأسئلة الشائعة" desc="كل ما تحتاج معرفته عن الكوبونات والتحقق والعمولات." />
      <div className="space-y-3">
        {faqs.map((f, i) => (
          <Reveal key={f.q} delay={i * 40}>
            <Acc q={f.q} defaultOpen={i === 0}>{f.a}</Acc>
          </Reveal>
        ))}
      </div>
      <div className="mt-10 rounded-xl border border-brand-100 bg-brand-50/60 p-6 text-center">
        <p className="font-display text-lg font-extrabold text-ink-950">لم تجد إجابتك؟</p>
        <p className="mt-1 text-sm text-ink-500">فريقنا يرد خلال يوم عمل واحد.</p>
        <Link to="/contact" className="btn-press mt-4 inline-block rounded-lg bg-brand-950 px-6 py-2.5 text-sm font-bold text-white hover:bg-brand-800">تواصل معنا</Link>
      </div>
    </div>
  );
}

/* ================= CONTACT ================= */
export function ContactPage() {
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState("");
  usePageMeta("تواصل معنا | وفّر", "راسل فريق وفّر — استفسار، اقتراح متجر جديد، أو الإبلاغ عن كود لا يعمل.");

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    if (String(fd.get("name") || "").trim().length < 2) return setErr("أدخل اسمك");
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(String(fd.get("email") || ""))) return setErr("أدخل بريداً صحيحاً");
    if (String(fd.get("msg") || "").trim().length < 10) return setErr("اكتب رسالة أطول قليلاً");
    setErr("");
    setSent(true);
  };

  return (
    <div className="container-x max-w-5xl py-12">
      <Crumbs items={[{ label: "الرئيسية", to: "/" }, { label: "تواصل معنا" }]} />
      <SectionHead eyebrow="نسعد بسماعك" title="تواصل معنا" desc="اقتراح متجر جديد؟ كود لا يعمل؟ راسلنا وسنرد سريعاً." />
      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="space-y-4">
          {[
            { i: <Mail className="h-5 w-5" />, t: "البريد", v: "support@waffir.sa", ltr: true },
            { i: <MapPin className="h-5 w-5" />, t: "المقر", v: "الرياض، المملكة العربية السعودية" },
            { i: <ShieldCheck className="h-5 w-5" />, t: "الإبلاغ عن كود", v: "استخدم زر «لا يعمل» داخل أي كوبون — أسرع طريقة" },
          ].map((c) => (
            <div key={c.t} className="surface flex items-start gap-4 p-5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-800">{c.i}</span>
              <span>
                <span className="block font-display text-sm font-extrabold text-ink-950">{c.t}</span>
                <span className={`mt-0.5 block text-[13px] text-ink-500 ${c.ltr ? "text-left font-mono" : ""}`} dir={c.ltr ? "ltr" : undefined}>{c.v}</span>
              </span>
            </div>
          ))}
        </div>

        {sent ? (
          <div className="surface animate-pop flex flex-col items-center justify-center p-10 text-center">
            <CheckCircle2 className="h-12 w-12 text-jade-500" />
            <h2 className="mt-4 font-display text-xl font-extrabold text-ink-950">وصلتنا رسالتك</h2>
            <p className="mt-2 max-w-sm text-sm leading-7 text-ink-500">شكراً لتواصلك — سيرد عليك الفريق خلال يوم عمل واحد على بريدك.</p>
          </div>
        ) : (
          <form onSubmit={submit} className="surface space-y-4 p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-bold text-ink-700">الاسم</label>
                <input name="name" className="field" placeholder="اسمك الكامل" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold text-ink-700">البريد الإلكتروني</label>
                <input name="email" type="email" dir="ltr" className="field text-left" placeholder="you@email.com" />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold text-ink-700">الموضوع</label>
              <select name="subject" className="field">
                <option>استفسار عام</option>
                <option>اقتراح إضافة متجر</option>
                <option>الإبلاغ عن كود لا يعمل</option>
                <option>شراكة تجارية</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold text-ink-700">الرسالة</label>
              <textarea name="msg" rows={5} className="field resize-none" placeholder="اكتب رسالتك هنا..." />
            </div>
            {err && <p className="rounded-lg bg-flame-50 px-3 py-2 text-xs font-bold text-flame-700">{err}</p>}
            <button type="submit" className="btn-press w-full rounded-lg bg-brand-950 py-3 text-sm font-bold text-white hover:bg-brand-800">إرسال الرسالة</button>
          </form>
        )}
      </div>
    </div>
  );
}

/* ================= LEGAL SHELL ================= */
function Legal({ title, updated, children }: { title: string; updated: string; children: ReactNode }) {
  return (
    <div className="container-x max-w-3xl py-12">
      <Crumbs items={[{ label: "الرئيسية", to: "/" }, { label: title }]} />
      <h1 className="mt-6 font-display text-3xl font-black text-ink-950">{title}</h1>
      <p className="mt-2 text-xs font-bold text-ink-400">آخر تحديث: {updated}</p>
      <div className="prose-custom mt-8 space-y-8">{children}</div>
    </div>
  );
}

function Sec({ h, children }: { h: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="font-display text-lg font-extrabold text-ink-950">{h}</h2>
      <div className="mt-3 space-y-3 text-sm leading-8 text-ink-600">{children}</div>
    </section>
  );
}

export function PrivacyPage() {
  usePageMeta("سياسة الخصوصية | وفّر", "كيف يجمع موقع وفّر بياناتك ويستخدمها ويحميها.");
  return (
    <Legal title="سياسة الخصوصية" updated="يناير 2025">
      <Sec h="البيانات التي نجمعها">
        <p>نجمع الحد الأدنى اللازم لتشغيل الخدمة: بيانات الحساب (الاسم والبريد) عند التسجيل، وقائمة مفضلتك ومتاجرك المتابَعة، وسجل الكوبونات التي استخدمتها على جهازك.</p>
      </Sec>
      <Sec h="بيانات الاستخدام والتتبع">
        <p>عند كشف كوبون أو النقر على رابط متجر، نُسجّل حدثاً تقنياً (يشمل معرّف نقرة فريد TID) لقياس أداء الأكواد ونسب نجاحها ومطابقة التحويلات مع مصادر الزيارات. هذه البيانات إحصائية ولا تكشف هويتك للمتاجر.</p>
      </Sec>
      <Sec h="الكوكيز">
        <p>نستخدم تخزيناً محلياً لحفظ تفضيلاتك ومفضلتك، وكوكيز تحليلية مجهولة الهوية لفهم طريقة استخدام الموقع وتحسينه.</p>
      </Sec>
      <Sec h="مشاركة البيانات">
        <p>لا نبيع بياناتك لأي طرف ثالث. قد نشارك المتاجر بيانات إحصائية مجمعة (مثل عدد النقرات على عروضها) دون أي معلومات شخصية.</p>
      </Sec>
      <Sec h="حقوقك">
        <p>يمكنك طلب نسخة من بياناتك أو حذفها نهائياً في أي وقت عبر <Link to="/contact" className="font-bold text-brand-800 underline underline-offset-4">صفحة التواصل</Link>.</p>
      </Sec>
    </Legal>
  );
}

export function TermsPage() {
  usePageMeta("الشروط والأحكام | وفّر", "شروط استخدام منصة وفّر لكوبونات وأكواد الخصم.");
  return (
    <Legal title="الشروط والأحكام" updated="يناير 2025">
      <Sec h="طبيعة الخدمة">
        <p>«وفّر» منصة عرض وتجميع لكوبونات وأكواد الخصم والعروض المقدمة من متاجر طرف ثالث. نحن لسنا بائعاً لأي منتج، وتتم عمليات الشراء مباشرة بينك وبين المتجر وفق شروطه.</p>
      </Sec>
      <Sec h="الأكواد والعروض">
        <p>نبذل عناية معقولة للتحقق من صلاحية الأكواد ونعرض نسب نجاح مبنية على بيانات حقيقية، إلا أن صلاحية أي كود تخضع في النهاية لسياسات المتجر المصدر وقد تتغير دون إشعار مسبق.</p>
      </Sec>
      <Sec h="روابط الأفلييت">
        <p>بعض الروابط روابط شراكة تسويقية قد تدرّ على المنصة عمولة من المتجر دون أي تكلفة إضافية عليك، وفق ما هو مفصّل في <Link to="/disclosure" className="font-bold text-brand-800 underline underline-offset-4">سياسة الإفصاح</Link>.</p>
      </Sec>
      <Sec h="الاستخدام المقبول">
        <p>تتعهد بعدم استخدام المنصة لأغراض مخالفة للأنظمة السعودية، وعدم محاولة العبث بأنظمة التتبع أو انتحال هوية المنصة.</p>
      </Sec>
      <Sec h="حدود المسؤولية">
        <p>لا تتحمل المنصة مسؤولية أي فروق أسعار أو رفض متجر تطبيق كود معين، وتبقى مسؤولية إتمام الصفقة بينك وبين المتجر.</p>
      </Sec>
      <Sec h="تعديل الشروط">
        <p>قد نحدّث هذه الشروط من وقت لآخر، ويعد استمرارك في استخدام الموقع قبولاً بالنسخة المحدثة.</p>
      </Sec>
    </Legal>
  );
}

export function DisclosurePage() {
  usePageMeta("الإفصاح عن التسويق بالعمولة (الأفلييت) | وفّر", "شرح شفاف لكيفية عمل روابط الأفلييت في وفّر ولماذا لا تدفع أي تكلفة إضافية.");
  return (
    <Legal title="سياسة الإفصاح عن الأفلييت" updated="يناير 2025">
      <Sec h="بكل شفافية: نعم، قد نحصل على عمولة">
        <p>عندما تنقر على زر «الذهاب إلى المتجر» أو «اذهب للعرض»، يُفتح المتجر عبر رابط شراكة خاص بمنصة وفّر. إذا أتممت عملية شراء، قد يدفع لنا المتجر عمولة صغيرة — <strong>من جيبه هو، وليس من جيبك</strong>. سعر المنتج عليك لا يتغير إطلاقاً.</p>
      </Sec>
      <Sec h="كيف يعمل الرابط تقنياً">
        <p>يُضاف إلى الرابط معرّف نقرة فريد (TID) ووسوم مصدر الحملة. هذا يسمح بمطابقة التحويل مع الكوبون الذي استخدمته، لنعرف أي الأكواد توفّر فعلاً — وهي نفس البيانات التي تُبنى عليها نسب النجاح المعروضة في الموقع.</p>
      </Sec>
      <Sec h="هل يؤثر ذلك على ترتيب الأكواد؟">
        <p>لا. ترتيب الكوبونات في صفحات المتاجر يعتمد على نسبة نجاح الكود وقيمته للمستخدم، وليس على حجم العمولة. نعرض أكواداً بدون أي عمولة لنا متى كانت الأفضل لك.</p>
      </Sec>
      <Sec h="لماذا نفصح عن ذلك؟">
        <p>لأن ثقتك هي أصلنا الوحيد، ولأن الأنظمة السعودية ومعايير الإعلانات العادلة توجب الإفصاح عن العلاقات التسويقية. هذه العمولات هي ما يتيح لنا التحقق من الأكواد يومياً وإبقاء الخدمة مجانية بالكامل.</p>
      </Sec>
      <Sec h="أسئلة؟">
        <p>فريقنا جاهز للإجابة عبر <Link to="/contact" className="font-bold text-brand-800 underline underline-offset-4">صفحة التواصل</Link>.</p>
      </Sec>
    </Legal>
  );
}

/* ================= 404 ================= */
export function NotFoundPage() {
  usePageMeta("الصفحة غير موجودة | وفّر");
  return (
    <div className="container-x py-24 text-center">
      <p className="font-display text-7xl font-black text-ink-100">404</p>
      <h1 className="mt-3 font-display text-2xl font-black text-ink-950">ضللنا الطريق لهذه الصفحة</h1>
      <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-ink-500">لكن الكوبونات لم تضع — ارجع للرئيسية أو ابحث عن متجرك مباشرة.</p>
      <div className="mt-6 flex items-center justify-center gap-3">
        <Link to="/" className="btn-press rounded-lg bg-brand-950 px-6 py-2.5 text-sm font-bold text-white">الرئيسية</Link>
        <Link to="/deals" className="btn-press flex items-center gap-2 rounded-lg border border-ink-200 px-5 py-2.5 text-sm font-bold text-ink-700"><Flame className="h-4 w-4 text-flame-500" /> أحدث العروض</Link>
      </div>
    </div>
  );
}

/* re-exports for icons used above to satisfy bundlers */
export { SearchX, Ticket, UserIcon, fmt };
