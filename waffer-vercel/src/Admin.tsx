import { useMemo, useState, type FormEvent } from "react";
import {
  BarChart3, Check, Eye, EyeOff, ExternalLink, LayoutDashboard, MousePointerClick,
  Pencil, Plus, RefreshCw, Star, Store as StoreIcon, ThumbsDown, ThumbsUp, Ticket,
  Trash2, TrendingUp, Users as UsersIcon, Wallet, X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { categories, type Coupon } from "../lib/data";
import { computeStats, fmt, usePageMeta } from "../lib/utils";
import { useApp } from "../state/AppContext";
import { StoreTile, Reveal } from "../components/ui";

type Tab = "overview" | "coupons" | "stores" | "votes" | "users";

export function AdminPage() {
  const [tab, setTab] = useState<Tab>("overview");
  const [tick, setTick] = useState(0);
  const stats = useMemo(() => computeStats(), [tick]);

  usePageMeta("لوحة الإدارة | وفّر", "لوحة تحكم منصة وفّر — الزيارات، نقرات الأفلييت، CTR، التحويلات والإيرادات.");

  const TABS: { id: Tab; l: string; icon: typeof LayoutDashboard }[] = [
    { id: "overview", l: "نظرة عامة", icon: LayoutDashboard },
    { id: "coupons", l: "الكوبونات", icon: Ticket },
    { id: "stores", l: "المتاجر", icon: StoreIcon },
    { id: "votes", l: "التقييمات", icon: ThumbsUp },
    { id: "users", l: "المستخدمون", icon: UsersIcon },
  ];

  return (
    <div className="min-h-screen bg-paper pb-20">
      <div className="border-b border-ink-100 bg-white">
        <div className="container-x flex flex-wrap items-center justify-between gap-4 py-5">
          <div>
            <p className="text-[11px] font-bold tracking-wide text-gold-600">Waffir Admin</p>
            <h1 className="font-display text-xl font-black text-ink-950">لوحة الإدارة</h1>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setTick((t) => t + 1)} className="btn-press flex items-center gap-2 rounded-lg border border-ink-200 px-3.5 py-2 text-xs font-bold text-ink-600 hover:bg-ink-50">
              <RefreshCw className="h-3.5 w-3.5" />
              تحديث البيانات
            </button>
            <Link to="/" className="btn-press rounded-lg bg-brand-950 px-4 py-2 text-xs font-bold text-white">عودة للموقع</Link>
          </div>
        </div>
        <div className="container-x flex gap-1 overflow-x-auto no-scrollbar pb-3">
          {TABS.map(({ id, l, icon: Icon }) => (
            <button key={id} onClick={() => setTab(id)} className={`flex shrink-0 items-center gap-2 rounded-lg px-4 py-2 text-[13px] font-bold transition ${tab === id ? "bg-brand-950 text-white" : "text-ink-500 hover:bg-ink-50"}`}>
              <Icon className="h-4 w-4" />
              {l}
            </button>
          ))}
        </div>
      </div>

      <div className="container-x pt-6">
        {tab === "overview" && <Overview stats={stats} />}
        {tab === "coupons" && <CouponsAdmin />}
        {tab === "stores" && <StoresAdmin />}
        {tab === "votes" && <VotesAdmin stats={stats} />}
        {tab === "users" && <UsersAdmin />}
      </div>
    </div>
  );
}

/* ---------------- overview ---------------- */
function Overview({ stats }: { stats: ReturnType<typeof computeStats> }) {
  const { allStores, allCoupons } = useApp();
  const kpis = [
    { l: "مرات الظهور", v: fmt(stats.impressions), icon: Eye, tint: "bg-brand-50 text-brand-800" },
    { l: "كشف الكوبونات", v: fmt(stats.reveals), icon: Ticket, tint: "bg-gold-100 text-gold-800" },
    { l: "نقرات الأفلييت", v: fmt(stats.clicks), icon: MousePointerClick, tint: "bg-jade-100 text-jade-700" },
    { l: "CTR (كشف ← نقرة)", v: `${stats.ctr}%`, icon: TrendingUp, tint: "bg-ink-100 text-ink-700" },
    { l: "التحويلات", v: fmt(stats.conversions), icon: BarChart3, tint: "bg-flame-100 text-flame-700" },
    { l: "الإيرادات المقدرة", v: `${fmt(stats.revenue)} ر.س`, icon: Wallet, tint: "bg-jade-100 text-jade-700" },
  ];

  const funnel = [
    { l: "ظهور", v: stats.impressions, c: "bg-ink-300" },
    { l: "كشف كود", v: stats.reveals, c: "bg-brand-500" },
    { l: "نقرة أفلييت", v: stats.clicks, c: "bg-gold-400" },
    { l: "تحويل", v: stats.conversions, c: "bg-jade-500" },
  ];
  const maxDay = Math.max(1, ...stats.days.map((d) => d.impressions));

  return (
    <div className="space-y-6">
      <p className="rounded-xl border border-gold-200 bg-gold-50 px-4 py-3 text-xs font-semibold leading-6 text-gold-800">
        الأرقام أدناه محسوبة لحظياً من سجل التتبع الفعلي للمنصة (Impression → Reveal → Click → Conversion) مع معرّف TID لكل نقرة — وتشمل نشاطك الحقيقي على الموقع خلال هذه الجلسة.
      </p>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        {kpis.map((k, i) => (
          <Reveal key={k.l} delay={i * 50}>
            <div className="surface p-4">
              <span className={`inline-flex h-9 w-9 items-center justify-center rounded-lg ${k.tint}`}><k.icon className="h-4.5 w-4.5" /></span>
              <p className="num mt-3 font-display text-xl font-black text-ink-950 sm:text-2xl">{k.v}</p>
              <p className="mt-0.5 text-[11px] font-bold text-ink-400">{k.l}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
        {/* funnel */}
        <div className="surface p-6">
          <h2 className="font-display text-base font-extrabold text-ink-950">قمع التحويل</h2>
          <div className="mt-5 space-y-4">
            {funnel.map((f, i) => {
              const pct = stats.impressions ? Math.round((f.v / stats.impressions) * 100) : 0;
              const conv = i > 0 && funnel[i - 1].v ? Math.round((f.v / funnel[i - 1].v) * 100) : 100;
              return (
                <div key={f.l}>
                  <div className="mb-1.5 flex items-center justify-between text-xs font-bold">
                    <span className="text-ink-700">{f.l}</span>
                    <span className="num text-ink-400">{fmt(f.v)} {i > 0 && <span className="text-jade-600">({conv}%)</span>}</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-ink-50">
                    <div className={`h-full rounded-full ${f.c} bar-grow`} style={{ width: `${Math.max(2, pct)}%`, animationDelay: `${i * 120}ms` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* daily chart */}
        <div className="surface p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-base font-extrabold text-ink-950">آخر 7 أيام</h2>
            <div className="flex items-center gap-4 text-[11px] font-bold text-ink-500">
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-ink-200" /> ظهور</span>
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-brand-600" /> كشف</span>
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-gold-400" /> نقرة</span>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-7 items-end gap-2 sm:gap-3" style={{ height: 150 }}>
            {stats.days.map((d, i) => (
              <div key={d.label + i} className="flex h-full flex-col items-center justify-end gap-1.5">
                <div className="flex h-full w-full max-w-[34px] items-end justify-center gap-1">
                  <div className="w-1/3 rounded-t bg-ink-200 bar-grow" style={{ height: `${Math.max(3, (d.impressions / maxDay) * 100)}%`, animationDelay: `${i * 60}ms` }} title={`ظهور: ${d.impressions}`} />
                  <div className="w-1/3 rounded-t bg-brand-600 bar-grow" style={{ height: `${Math.max(3, (d.reveals / maxDay) * 100)}%`, animationDelay: `${i * 60 + 60}ms` }} title={`كشف: ${d.reveals}`} />
                  <div className="w-1/3 rounded-t bg-gold-400 bar-grow" style={{ height: `${Math.max(3, (d.clicks / maxDay) * 100)}%`, animationDelay: `${i * 60 + 120}ms` }} title={`نقرة: ${d.clicks}`} />
                </div>
                <span className="whitespace-nowrap text-[10px] font-bold text-ink-400">{d.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* top stores */}
        <div className="surface overflow-hidden">
          <h2 className="border-b border-ink-100 px-6 py-4 font-display text-base font-extrabold text-ink-950">الأفضل أداءً — المتاجر</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-ink-50/60 text-[11px] font-bold text-ink-400">
                <th className="px-6 py-2.5 text-start">المتجر</th>
                <th className="px-4 py-2.5 text-start">نقرات</th>
                <th className="px-6 py-2.5 text-start">كشف</th>
              </tr>
            </thead>
            <tbody>
              {stats.topStores.map((t) => {
                const s = allStores.find((x) => x.slug === t.store);
                if (!s) return null;
                return (
                  <tr key={t.store} className="border-t border-ink-100">
                    <td className="px-6 py-3">
                      <span className="flex items-center gap-2.5 font-bold text-ink-900"><StoreTile store={s} size={30} className="!rounded-lg" /> {s.name}</span>
                    </td>
                    <td className="num px-4 py-3 font-bold text-jade-600">{fmt(t.clicks)}</td>
                    <td className="num px-6 py-3 text-ink-500">{fmt(t.reveals)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* top coupons */}
        <div className="surface overflow-hidden">
          <h2 className="border-b border-ink-100 px-6 py-4 font-display text-base font-extrabold text-ink-950">الأفضل أداءً — الكوبونات</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-ink-50/60 text-[11px] font-bold text-ink-400">
                <th className="px-6 py-2.5 text-start">الكود</th>
                <th className="px-4 py-2.5 text-start">كشف</th>
                <th className="px-6 py-2.5 text-start">تقييمات</th>
              </tr>
            </thead>
            <tbody>
              {stats.topCoupons.map((t) => {
                const c = allCoupons.find((x) => x.id === t.coupon);
                return (
                  <tr key={t.coupon} className="border-t border-ink-100">
                    <td className="px-6 py-3">
                      <span className="font-mono text-[13px] font-bold text-brand-900" dir="ltr">{c?.code || t.coupon}</span>
                      <span className="block text-[11px] text-ink-400">{c?.title.slice(0, 32)}</span>
                    </td>
                    <td className="num px-4 py-3 font-bold text-ink-900">{fmt(t.reveals)}</td>
                    <td className="px-6 py-3">
                      <span className="flex items-center gap-2 text-[11px] font-bold">
                        <span className="flex items-center gap-1 text-jade-600"><ThumbsUp className="h-3 w-3" />{t.votesUp}</span>
                        <span className="flex items-center gap-1 text-flame-500"><ThumbsDown className="h-3 w-3" />{t.votesDown}</span>
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ---------------- coupons admin ---------------- */
function CouponsAdmin() {
  const { allCoupons, allStores, disabled, toggleDisabled, toggleFeatured, addCoupon, removeCoupon, customCoupons } = useApp();
  const [formOpen, setFormOpen] = useState(false);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-sm font-bold text-ink-600">{allCoupons.length + disabled.filter((d) => !allCoupons.some((c) => c.id === d)).length} كوبون — {allCoupons.length} نشط</p>
        <button onClick={() => setFormOpen((f) => !f)} className="btn-press flex items-center gap-2 rounded-lg bg-brand-950 px-4 py-2.5 text-xs font-bold text-white hover:bg-brand-800">
          {formOpen ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {formOpen ? "إغلاق" : "إضافة كوبون"}
        </button>
      </div>

      {formOpen && <CouponForm onDone={() => setFormOpen(false)} addCoupon={addCoupon} stores={allStores} />}

      <div className="surface overflow-x-auto">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="bg-ink-50/60 text-[11px] font-bold text-ink-400">
              <th className="px-5 py-3 text-start">الكوبون</th>
              <th className="px-3 py-3 text-start">الخصم</th>
              <th className="px-3 py-3 text-start">الشارة</th>
              <th className="px-3 py-3 text-start">مميز</th>
              <th className="px-3 py-3 text-start">الحالة</th>
              <th className="px-5 py-3 text-start">إجراء</th>
            </tr>
          </thead>
          <tbody>
            {[...allCoupons, ...disabled.filter((d) => !allCoupons.some((c) => c.id === d)).map((id) => ({ id, code: id, title: "كوبون معطّل", store: "noon", label: "—", value: 0, desc: "", badges: [], rate: 0, uses: 0, lastMin: 0, exp: null, terms: [], addedD: 0 }) as Coupon)].map((c) => {
              const off = disabled.includes(c.id);
              const s = allStores.find((x) => x.slug === c.store);
              const isCustom = customCoupons.some((x) => x.id === c.id);
              return (
                <tr key={c.id} className={`border-t border-ink-100 ${off ? "opacity-50" : ""}`}>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      {s && <StoreTile store={s} size={34} className="!rounded-lg" />}
                      <div>
                        <p className="font-mono text-[13px] font-bold text-brand-900" dir="ltr">{c.code}</p>
                        <p className="max-w-[260px] truncate text-[11px] text-ink-400">{c.title}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3.5 font-display font-extrabold text-flame-600">{c.label}</td>
                  <td className="px-3 py-3.5">
                    {c.badges.includes("حصري") ? <span className="chip bg-gold-100 text-gold-800 ring-1 ring-gold-200">حصري</span> : <span className="text-[11px] text-ink-300">—</span>}
                  </td>
                  <td className="px-3 py-3.5">
                    <button onClick={() => toggleFeatured(c.id)} aria-label="تمييز الكوبون" className={`rounded-lg p-1.5 transition ${c.featured ? "bg-gold-100 text-gold-600" : "text-ink-300 hover:text-gold-500"}`}>
                      <Star className="h-4 w-4" fill={c.featured ? "currentColor" : "none"} />
                    </button>
                  </td>
                  <td className="px-3 py-3.5">
                    <button
                      onClick={() => toggleDisabled(c.id)}
                      className={`relative h-6 w-11 rounded-full transition ${off ? "bg-ink-200" : "bg-jade-500"}`}
                      aria-label={off ? "تفعيل الكوبون" : "تعطيل الكوبون"}
                    >
                      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${off ? "start-0.5" : "start-[22px]"}`} />
                    </button>
                  </td>
                  <td className="px-5 py-3.5">
                    {isCustom ? (
                      <button onClick={() => removeCoupon(c.id)} className="btn-press flex items-center gap-1.5 rounded-lg border border-flame-200 px-3 py-1.5 text-[11px] font-bold text-flame-600 hover:bg-flame-50">
                        <Trash2 className="h-3.5 w-3.5" /> حذف
                      </button>
                    ) : (
                      <span className="flex items-center gap-1.5 text-[11px] font-bold text-ink-300"><Pencil className="h-3.5 w-3.5" /> تعديل قريباً</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CouponForm({ onDone, addCoupon, stores }: { onDone: () => void; addCoupon: (c: Coupon) => void; stores: { slug: string; name: string }[] }) {
  const [exclusive, setExclusive] = useState(false);
  const [featured, setFeatured] = useState(false);
  const [app, setApp] = useState(false);
  const [first, setFirst] = useState(false);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const value = Number(fd.get("value") || 0);
    const unit = String(fd.get("unit") || "%");
    const badges = [...(exclusive ? ["حصري"] : []), "مجرب", ...(first ? ["أول طلب"] : []), ...(app ? ["التطبيق"] : [])];
    addCoupon({
      id: `c-custom-${Date.now()}`,
      store: String(fd.get("store")),
      code: String(fd.get("code") || "").trim().toUpperCase(),
      label: unit === "%" ? `${value}%` : `${value} ر.س`,
      value,
      title: String(fd.get("title")),
      desc: String(fd.get("desc") || "كوبون جديد بانتظار تقييمات المستخدمين."),
      badges,
      rate: 95,
      uses: 0,
      lastMin: 0,
      exp: Number(fd.get("exp") || 0) || null,
      terms: String(fd.get("terms") || "تُطبق الشروط العامة").split("\n").filter(Boolean),
      featured, app, first,
      addedD: 0,
    });
    onDone();
  };

  return (
    <form onSubmit={submit} className="surface animate-pop mb-5 grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3">
      <div>
        <label className="mb-1.5 block text-xs font-bold text-ink-700">المتجر *</label>
        <select name="store" className="field" required>
          {stores.map((s) => <option key={s.slug} value={s.slug}>{s.name}</option>)}
        </select>
      </div>
      <div className="sm:col-span-1 lg:col-span-2">
        <label className="mb-1.5 block text-xs font-bold text-ink-700">عنوان العرض *</label>
        <input name="title" className="field" placeholder="مثال: خصم 20% على أول طلب" required />
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-bold text-ink-700">الكود *</label>
        <input name="code" dir="ltr" className="field font-mono text-left" placeholder="WFR20" required />
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-bold text-ink-700">قيمة الخصم *</label>
        <div className="flex gap-2">
          <input name="value" type="number" min={1} className="field" placeholder="20" required />
          <select name="unit" className="field !w-24"><option value="%">%</option><option value="sar">ر.س</option></select>
        </div>
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-bold text-ink-700">ينتهي خلال (أيام)</label>
        <input name="exp" type="number" min={0} className="field" placeholder="اتركه فارغاً = بدون انتهاء" />
      </div>
      <div className="sm:col-span-2">
        <label className="mb-1.5 block text-xs font-bold text-ink-700">الوصف</label>
        <input name="desc" className="field" placeholder="وصف مختصر يظهر في البطاقة" />
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-bold text-ink-700">الشروط (سطر لكل شرط)</label>
        <textarea name="terms" rows={2} className="field resize-none" placeholder={"الحد الأدنى 200 ر.س\nمرة واحدة لكل حساب"} />
      </div>
      <div className="flex flex-wrap items-end gap-x-5 gap-y-2 pb-1">
        {[{ v: exclusive, set: setExclusive, l: "حصري" }, { v: featured, set: setFeatured, l: "مميز" }, { v: app, set: setApp, l: "للتطبيق" }, { v: first, set: setFirst, l: "أول طلب" }].map((x) => (
          <label key={x.l} className="flex cursor-pointer items-center gap-2 text-xs font-bold text-ink-700">
            <input type="checkbox" checked={x.v} onChange={(e) => x.set(e.target.checked)} className="h-4 w-4 accent-brand-800" />
            {x.l}
          </label>
        ))}
      </div>
      <div className="flex items-end gap-2 sm:col-span-2 lg:col-span-3">
        <button type="submit" className="btn-press flex items-center gap-2 rounded-lg bg-jade-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-jade-700">
          <Check className="h-4 w-4" /> نشر الكوبون
        </button>
        <button type="button" onClick={onDone} className="btn-press rounded-lg border border-ink-200 px-5 py-2.5 text-xs font-bold text-ink-600">إلغاء</button>
        <p className="ms-auto text-[11px] text-ink-400">رابط الأفلييت يُولَّد تلقائياً من بيانات المتجر مع TID لكل نقرة.</p>
      </div>
    </form>
  );
}

/* ---------------- stores admin ---------------- */
function StoresAdmin() {
  const { allStores, allCoupons, addStore } = useApp();
  const [open, setOpen] = useState(false);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") || "").trim();
    addStore({
      slug: `s-${Date.now().toString(36)}`,
      name,
      en: String(fd.get("en") || name),
      mono: (String(fd.get("en") || name).trim()[0] || "W").toUpperCase(),
      color: String(fd.get("color") || "#2544c4"),
      fg: "#ffffff",
      url: String(fd.get("url") || "https://example.com"),
      tagline: String(fd.get("tagline") || "متجر جديد على وفّر"),
      desc: String(fd.get("desc") || "متجر أُضيف حديثاً — كوبوناته قيد المراجعة."),
      rating: 4.0,
      reviews: 0,
      cats: [String(fd.get("cat") || "home")],
      updatedH: 0,
    });
    setOpen(false);
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-bold text-ink-600">{allStores.length} متجراً</p>
        <button onClick={() => setOpen((o) => !o)} className="btn-press flex items-center gap-2 rounded-lg bg-brand-950 px-4 py-2.5 text-xs font-bold text-white">
          {open ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />} إضافة متجر
        </button>
      </div>

      {open && (
        <form onSubmit={submit} className="surface animate-pop mb-5 grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3">
          <div><label className="mb-1.5 block text-xs font-bold text-ink-700">اسم المتجر *</label><input name="name" className="field" placeholder="مثال: باجه" required /></div>
          <div><label className="mb-1.5 block text-xs font-bold text-ink-700">الاسم اللاتيني</label><input name="en" dir="ltr" className="field text-left" placeholder="Baja" /></div>
          <div><label className="mb-1.5 block text-xs font-bold text-ink-700">رابط المتجر (الأساس للأفلييت) *</label><input name="url" dir="ltr" type="url" className="field text-left" placeholder="https://..." required /></div>
          <div><label className="mb-1.5 block text-xs font-bold text-ink-700">اللون الأساسي للشعار</label><input name="color" type="color" defaultValue="#2544c4" className="field h-11 !p-1.5" /></div>
          <div><label className="mb-1.5 block text-xs font-bold text-ink-700">التصنيف</label>
            <select name="cat" className="field">{categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}</select>
          </div>
          <div><label className="mb-1.5 block text-xs font-bold text-ink-700">الوصف المختصر</label><input name="tagline" className="field" placeholder="شعار قصير" /></div>
          <div className="sm:col-span-2 lg:col-span-3"><label className="mb-1.5 block text-xs font-bold text-ink-700">وصف الصفحة</label><input name="desc" className="field" placeholder="وصف يظهر في صفحة المتجر" /></div>
          <div className="lg:col-span-3"><button type="submit" className="btn-press flex items-center gap-2 rounded-lg bg-jade-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-jade-700"><Check className="h-4 w-4" /> حفظ المتجر</button></div>
        </form>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {allStores.map((s) => (
          <div key={s.slug} className="surface flex items-center gap-4 p-4">
            <StoreTile store={s} size={48} />
            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-sm font-extrabold text-ink-950">{s.name}</p>
              <p className="text-[11px] text-ink-400">{allCoupons.filter((c) => c.store === s.slug).length} كوبون نشط • {s.cats.length} تصنيف</p>
            </div>
            <a href={s.url} target="_blank" rel="noreferrer" className="rounded-lg p-2 text-ink-300 transition hover:bg-ink-50 hover:text-brand-800" aria-label="فتح المتجر">
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- votes admin ---------------- */
function VotesAdmin({ stats }: { stats: ReturnType<typeof computeStats> }) {
  const { allCoupons, allStores, reviewed, markReviewed } = useApp();
  const [onlyPending, setOnlyPending] = useState(true);
  const list = stats.votes.filter((v) => !onlyPending || !reviewed.includes(v.key));

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-bold text-ink-600">{list.length} تقييم «يعمل / لا يعمل» {onlyPending ? "بانتظار المراجعة" : ""}</p>
        <button onClick={() => setOnlyPending((p) => !p)} className="chip !px-3.5 !py-1.5 bg-white text-ink-600 ring-1 ring-ink-200">{onlyPending ? "عرض الكل" : "المعلّقة فقط"}</button>
      </div>
      {list.length === 0 ? (
        <div className="surface p-10 text-center text-sm font-bold text-ink-400">لا تقييمات جديدة — كل شيء تمت مراجعته</div>
      ) : (
        <div className="space-y-2.5">
          {list.slice(0, 25).map((v) => {
            const c = allCoupons.find((x) => x.id === v.coupon);
            const s = allStores.find((x) => x.slug === v.store);
            return (
              <div key={v.key} className="surface flex flex-wrap items-center gap-3 p-4">
                <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${v.dir === "up" ? "bg-jade-100 text-jade-600" : "bg-flame-100 text-flame-600"}`}>
                  {v.dir === "up" ? <ThumbsUp className="h-4 w-4" /> : <ThumbsDown className="h-4 w-4" />}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-bold text-ink-900">
                    مستخدم قيّم كود <span className="font-mono text-brand-900" dir="ltr">{c?.code || v.coupon}</span> بأنه {v.dir === "up" ? "«يعمل»" : "«لا يعمل»"}
                  </p>
                  <p className="text-[11px] text-ink-400">{s?.name || v.store} • {new Date(v.t).toLocaleDateString("ar-SA")}</p>
                </div>
                {reviewed.includes(v.key) ? (
                  <span className="chip bg-jade-50 text-jade-700 ring-1 ring-jade-200"><Check className="h-3 w-3" /> تمت المراجعة</span>
                ) : (
                  <button onClick={() => markReviewed(v.key)} className="btn-press rounded-lg border border-ink-200 px-3.5 py-2 text-[11px] font-bold text-ink-600 hover:bg-ink-50">
                    اعتماد
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ---------------- users admin ---------------- */
function UsersAdmin() {
  const users = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("waffir_users") || "[]") as { name: string; email: string }[];
    } catch {
      return [];
    }
  }, []);
  const signups = useMemo(() => computeStats().impressions >= 0 ? JSON.parse(localStorage.getItem("waffir_users") || "[]").length : 0, []);

  return (
    <div>
      <p className="mb-4 text-sm font-bold text-ink-600">{users.length || signups} مستخدم مسجّل (نسخة تجريبية محلية)</p>
      {users.length === 0 ? (
        <div className="surface p-10 text-center">
          <UsersIcon className="mx-auto h-8 w-8 text-ink-300" />
          <p className="mt-3 font-display text-base font-extrabold text-ink-900">لا مستخدمون مسجّلون بعد</p>
          <p className="mx-auto mt-1 max-w-sm text-sm text-ink-500">عندما ينشئ زائر حساباً من <Link to="/login" className="font-bold text-brand-700 underline underline-offset-4">صفحة التسجيل</Link> سيظهر هنا فوراً.</p>
        </div>
      ) : (
        <div className="surface overflow-x-auto">
          <table className="w-full min-w-[480px] text-sm">
            <thead>
              <tr className="bg-ink-50/60 text-[11px] font-bold text-ink-400">
                <th className="px-5 py-3 text-start">المستخدم</th>
                <th className="px-5 py-3 text-start">البريد</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.email} className="border-t border-ink-100">
                  <td className="px-5 py-3 font-bold text-ink-900">{u.name}</td>
                  <td className="px-5 py-3 font-mono text-[13px] text-ink-500" dir="ltr">{u.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        {[
          { t: "تنبيهات الكوبونات", d: "إرسال تنبيه عند نزول كود لمتجر متابَع — عبر البريد/واتساب/تيليجرام.", icon: EyeOff },
          { t: "مزامنة المفضلة", d: "مزامنة المفضلة والمتابَعات عبر الأجهزة بعد إطلاق نظام الحسابات.", icon: RefreshCw },
          { t: "سجل الاستخدام", d: "عرض آخر الكوبونات المستخدمة لكل مستخدم وتقرير توفيره الشهري.", icon: Eye },
        ].map((f) => (
          <div key={f.t} className="surface p-5">
            <f.icon className="h-5 w-5 text-gold-500" />
            <p className="mt-3 font-display text-sm font-extrabold text-ink-950">{f.t}</p>
            <p className="mt-1 text-xs leading-6 text-ink-500">{f.d} <span className="font-bold text-gold-600">(قيد التطوير)</span></p>
          </div>
        ))}
      </div>
    </div>
  );
}
