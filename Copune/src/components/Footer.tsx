import { useState, type FormEvent } from "react";
import { Bell, CheckCircle2, Info, Mail, MessageCircle, Send } from "lucide-react";
import { Link } from "react-router-dom";
import { categories, stores } from "../lib/data";
import { logEvent } from "../lib/utils";
import { useApp } from "../state/AppContext";
import { Reveal } from "./ui";
import { Logo } from "./Header";

const CHANNELS = [
  { id: "email", label: "البريد الإلكتروني", icon: Mail },
  { id: "whatsapp", label: "واتساب", icon: MessageCircle },
  { id: "telegram", label: "تيليجرام", icon: Send },
  { id: "push", label: "إشعارات المتصفح", icon: Bell },
];

export function Newsletter() {
  const [channel, setChannel] = useState("email");
  const [value, setValue] = useState("");
  const [done, setDone] = useState(false);
  const [err, setErr] = useState("");
  const { toast } = useApp();

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (channel === "email" && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value)) {
      setErr("أدخل بريداً إلكترونياً صحيحاً");
      return;
    }
    if (channel !== "email" && value.trim().length < 5) {
      setErr("أدخل رقم جوال صحيحاً");
      return;
    }
    setErr("");
    setDone(true);
    logEvent({ type: "subscribe" });
    toast("تم الاشتراك! ستصلك أقوى العروض أولاً بأول");
  };

  return (
    <section className="container-x pb-16">
      <Reveal>
        <div className="dot-grid relative overflow-hidden rounded-2xl bg-brand-950 px-6 py-10 sm:px-10 lg:px-14">
          <div className="pointer-events-none absolute -start-20 -top-24 h-64 w-64 rounded-full bg-brand-700/40 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -end-16 h-64 w-64 rounded-full bg-gold-500/15 blur-3xl" />
          <div className="relative grid items-center gap-8 lg:grid-cols-2">
            <div>
              <p className="flex items-center gap-2 text-xs font-bold text-gold-300">
                <Bell className="h-4 w-4" />
                تنبيهات التوفير
              </p>
              <h2 className="mt-3 font-display text-2xl font-black leading-snug text-white sm:text-3xl">
                لا تفوت أقوى الخصومات
              </h2>
              <p className="mt-2 max-w-md text-sm leading-7 text-brand-200">
                احصل على أفضل الكوبونات والعروض مباشرة — نرسل لك الأكواد المجرّبة فور توفرها، وبدون أي إزعاج.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {CHANNELS.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setChannel(id)}
                    className={`chip !px-3.5 !py-1.5 !text-xs transition ${
                      channel === id ? "bg-gold-400 text-brand-950" : "bg-white/10 text-brand-100 ring-1 ring-white/15 hover:bg-white/15"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="lg:justify-self-end lg:w-full lg:max-w-md">
              {done ? (
                <div className="animate-pop rounded-xl bg-white/10 p-6 text-center ring-1 ring-white/15">
                  <CheckCircle2 className="mx-auto h-10 w-10 text-jade-400" />
                  <p className="mt-3 font-display text-lg font-bold text-white">تم الاشتراك بنجاح</p>
                  <p className="mt-1 text-sm text-brand-200">ستصلك أقوى الكوبونات عبر {CHANNELS.find((c) => c.id === channel)?.label} قريباً.</p>
                </div>
              ) : (
                <form onSubmit={submit} className="rounded-xl bg-white p-2 shadow-lift" noValidate>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <input
                      type={channel === "email" ? "email" : "tel"}
                      dir={channel === "email" ? "ltr" : "rtl"}
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      placeholder={channel === "email" ? "بريدك الإلكتروني" : "رقم جوالك (05xxxxxxxx)"}
                      className="field !border-0 !ring-0 focus:!ring-0"
                      aria-label="وسيلة التواصل"
                    />
                    <button type="submit" className="btn-press shrink-0 rounded-lg bg-brand-950 px-6 py-3 text-sm font-bold text-white hover:bg-brand-800">
                      اشترك في العروض
                    </button>
                  </div>
                  {err && <p className="px-2 pb-1 pt-1.5 text-xs font-bold text-flame-600">{err}</p>}
                </form>
              )}
              <p className="mt-3 text-center text-[11px] leading-5 text-brand-300">
                بدون رسائل مزعجة — يمكنك الإلغاء في أي وقت.
              </p>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-ink-100 bg-white">
      {/* affiliate disclosure */}
      <div className="container-x pt-8">
        <div className="flex items-start gap-3 rounded-xl border border-gold-200 bg-gold-50 p-4">
          <Info className="mt-0.5 h-4.5 w-4.5 shrink-0 text-gold-700" />
          <p className="text-xs leading-6 text-gold-800">
            <strong className="font-bold">شفافية كاملة:</strong> قد تحصل منصة «وفّر» على عمولة صغيرة من بعض المتاجر عند الشراء عبر الروابط الموجودة في الموقع، وذلك دون أي تكلفة إضافية عليك إطلاقاً. هذه العمولة هي ما يتيح لنا الاستمرار في تقديم الخدمة مجاناً والتحقق من الأكواد يومياً.{" "}
            <Link to="/disclosure" className="font-bold underline underline-offset-4 hover:text-gold-900">اقرأ سياسة الإفصاح عن الأفلييت</Link>
          </p>
        </div>
      </div>

      <div className="container-x grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Logo />
          <p className="mt-4 max-w-sm text-sm leading-7 text-ink-500">
            منصة سعودية تجمع أفضل كوبونات وأكواد الخصم والعروض في مكان واحد — أكواد مجرّبة يدوياً، تُحدّث يومياً، وتُنسخ بنقرة واحدة.
          </p>
          <div className="mt-5 flex items-center gap-2 text-xs font-bold text-ink-500">
            <span className="chip bg-jade-50 text-jade-700 ring-1 ring-jade-200">تحقق يومي من الأكواد</span>
            <span className="chip bg-brand-50 text-brand-800 ring-1 ring-brand-100">مجاني 100%</span>
          </div>
        </div>

        <FooterCol title="المنصة" links={[
          { to: "/about", label: "عن وفّر" },
          { to: "/faq", label: "الأسئلة الشائعة" },
          { to: "/contact", label: "تواصل معنا" },
          { to: "/deals", label: "أحدث الكوبونات" },
          { to: "/admin", label: "لوحة الإدارة" },
        ]} />

        <FooterCol title="أشهر المتاجر" links={stores.slice(0, 6).map((s) => ({ to: `/store/${s.slug}`, label: `كوبونات ${s.name}` }))} />

        <FooterCol title="التصنيفات" links={categories.slice(0, 6).map((c) => ({ to: `/category/${c.slug}`, label: c.name }))} />
      </div>

      <div className="container-x flex flex-col gap-4 border-t border-ink-100 py-6 text-xs text-ink-500 sm:flex-row sm:items-center sm:justify-between">
        <p>© 2025 وفّر — جميع الحقوق محفوظة. صُنع بعناية في الرياض.</p>
        <nav className="flex flex-wrap gap-x-5 gap-y-2" aria-label="روابط قانونية">
          <Link to="/privacy" className="font-semibold hover:text-brand-800">سياسة الخصوصية</Link>
          <Link to="/terms" className="font-semibold hover:text-brand-800">الشروط والأحكام</Link>
          <Link to="/disclosure" className="font-semibold hover:text-brand-800">الإفصاح عن الأفلييت</Link>
        </nav>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { to: string; label: string }[] }) {
  return (
    <div>
      <h3 className="font-display text-sm font-extrabold text-ink-950">{title}</h3>
      <ul className="mt-4 space-y-2.5">
        {links.map((l) => (
          <li key={l.to + l.label}>
            <Link to={l.to} className="text-[13px] text-ink-500 transition hover:text-brand-800">{l.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
