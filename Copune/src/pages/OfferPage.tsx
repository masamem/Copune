import { ArrowLeft, Clock, ExternalLink, Flame, Heart, ShieldCheck, ThumbsUp, Users } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { deals, type Coupon } from "../lib/data";
import { affUrl, fmt, logEvent, makeTid, usePageMeta } from "../lib/utils";
import { useApp } from "../state/AppContext";
import { CouponCard, DealCard } from "../components/cards";
import { Crumbs, Empty, PulseDot, Reveal, StoreTile, Tick } from "../components/ui";
import { SearchBar } from "../components/SearchBar";

export function OfferPage() {
  const { id = "" } = useParams();
  const { allCoupons, allStores, openCoupon, isFav, toggleFav, toast } = useApp();

  const coupon = allCoupons.find((c) => c.id === id);
  const deal = deals.find((d) => d.id === id);
  const item = coupon || deal;
  const store = item && allStores.find((s) => s.slug === item.store);

  usePageMeta(
    item && store ? `${item.title} | ${store.name} — وفّر` : "العرض غير موجود | وفّر",
    item ? `${item.title}. ${item.desc}` : undefined,
    item && store
      ? {
          "@context": "https://schema.org",
          "@type": "Offer",
          name: item.title,
          description: item.desc,
          url: store.url,
          offeredBy: { "@type": "Organization", name: store.name },
          availability: "https://schema.org/InStock",
        }
      : undefined
  );

  if (!item || !store) {
    return (
      <div className="container-x py-20">
        <Empty
          icon={<Flame className="h-7 w-7" />}
          title="العرض غير موجود"
          desc="ربما انتهى العرض أو تغير رابطه. تصفّح أحدث العروض المتاحة الآن."
          action={<Link to="/deals" className="btn-press rounded-lg bg-brand-950 px-5 py-2.5 text-sm font-bold text-white">أحدث العروض</Link>}
        />
      </div>
    );
  }

  const fav = isFav(coupon ? "coupons" : "deals", item.id);
  const similarCoupons = allCoupons.filter((c) => c.store === store.slug && c.id !== item.id).slice(0, 2);
  const similarDeals = deals.filter((d) => (d.store === store.slug || d.cat === ("cat" in item ? item.cat : "")) && d.id !== item.id).slice(0, 2);

  const goDeal = () => {
    const tid = makeTid();
    logEvent({ type: "click", store: store.slug, coupon: item.id, tid });
    toast("فتحنا العرض في نافذة جديدة", "info");
    window.open(affUrl(store.url, tid), "_blank", "noopener,noreferrer");
  };

  return (
    <div className="pb-16">
      <div className="border-b border-ink-100 bg-white">
        <div className="container-x py-6">
          <Crumbs
            items={[
              { label: "الرئيسية", to: "/" },
              { label: store.name, to: `/store/${store.slug}` },
              { label: item.title },
            ]}
          />
        </div>
      </div>

      <div className="container-x grid gap-8 pt-8 lg:grid-cols-[1.2fr_0.8fr]">
        {/* main ticket */}
        <Reveal>
          <article className="surface relative overflow-visible">
            <div className="p-6 sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <Link to={`/store/${store.slug}`} className="flex items-center gap-3">
                  <StoreTile store={store} size={52} />
                  <span>
                    <span className="block font-display text-base font-bold text-ink-950">{store.name}</span>
                    <span className="text-xs font-semibold text-ink-400" dir="ltr">{store.en}</span>
                  </span>
                </Link>
                <button
                  onClick={() => toggleFav(coupon ? "coupons" : "deals", item.id, "العرض")}
                  aria-label="حفظ"
                  className={`rounded-full p-2 transition ${fav ? "text-flame-500" : "text-ink-300 hover:text-flame-400"}`}
                >
                  <Heart className="h-5 w-5" fill={fav ? "currentColor" : "none"} />
                </button>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-2">
                {coupon && coupon.badges.map((b) => (
                  <span key={b} className={`chip ${b === "حصري" ? "bg-gold-100 text-gold-800 ring-1 ring-gold-200" : b === "مجرب" ? "bg-brand-50 text-brand-800 ring-1 ring-brand-100" : "bg-ink-50 text-ink-600 ring-1 ring-ink-100"}`}>{b}</span>
                ))}
                {coupon && coupon.exp && (
                  <span className="chip bg-flame-50 text-flame-700 ring-1 ring-flame-100"><Clock className="h-3 w-3" /> ينتهي خلال {coupon.exp} أيام</span>
                )}
                {deal && <span className="chip bg-flame-50 text-flame-700 ring-1 ring-flame-100"><Flame className="h-3 w-3" /> {deal.ends <= 3 ? "ينتهي قريباً" : `متبقٍ ${deal.ends} أيام`}</span>}
                {deal && <span className="chip bg-ink-50 text-ink-600 ring-1 ring-ink-100">بدون كود</span>}
              </div>

              <h1 className="mt-4 font-display text-2xl font-black leading-snug text-ink-950 sm:text-3xl">{item.title}</h1>
              <p className="mt-3 text-[15px] leading-8 text-ink-600">{item.desc}</p>

              {coupon ? (
                <>
                  <div className="mt-6 flex flex-col items-center gap-4 rounded-xl border-2 border-dashed border-brand-300 bg-brand-50/50 p-6 sm:flex-row sm:justify-between sm:px-8">
                    <div className="text-center sm:text-start">
                      <p className="text-[11px] font-bold text-ink-400">كود الخصم</p>
                      <p className="mt-1 select-all font-mono text-3xl font-bold tracking-[0.15em] text-brand-950" dir="ltr">{coupon.code}</p>
                    </div>
                    <div className="text-center">
                      <p className="font-display text-4xl font-black text-flame-600">{coupon.label}</p>
                      <p className="text-[11px] font-bold text-ink-400">قيمة التوفير</p>
                    </div>
                  </div>
                  <button
                    onClick={() => openCoupon(coupon as Coupon)}
                    className="btn-press mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-950 py-3.5 font-display text-base font-extrabold text-white shadow-glow hover:bg-brand-800"
                  >
                    عرض الكود ونسخه تلقائياً
                    <ArrowLeft className="h-5 w-5" />
                  </button>
                </>
              ) : (
                <button
                  onClick={goDeal}
                  className="btn-press mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gold-400 py-3.5 font-display text-base font-extrabold text-brand-950 shadow-soft hover:bg-gold-300"
                >
                  اذهب للعرض — يُطبق الخصم تلقائياً
                  <ExternalLink className="h-5 w-5" />
                </button>
              )}
              <p className="mt-3 text-center text-xs leading-6 text-ink-500">
                سنفتح {store.name} في نافذة جديدة{coupon ? " — ألصق الكود عند الدفع للحصول على الخصم" : ""}.
              </p>
            </div>
          </article>
        </Reveal>

        {/* sidebar */}
        <div className="space-y-5">
          <Reveal delay={100}>
            <div className="surface p-5">
              <h2 className="font-display text-sm font-extrabold text-ink-950">مؤشرات الثقة</h2>
              <ul className="mt-4 space-y-3 text-[13px] font-semibold text-ink-600">
                <li className="flex items-center gap-2.5">
                  <PulseDot />
                  تم التحقق من {coupon ? "الكود" : "العرض"} اليوم
                </li>
                <li className="flex items-center gap-2.5">
                  <ShieldCheck className="h-4.5 w-4.5 text-jade-600" />
                  {coupon ? `نسبة نجاح ${coupon.rate}%` : `تقييم ${deal!.rating} من 5`} — من بيانات حقيقية
                </li>
                <li className="flex items-center gap-2.5">
                  <Users className="h-4.5 w-4.5 text-brand-700" />
                  استخدمه {fmt(item.uses)} شخصاً
                </li>
                {coupon && (
                  <li className="flex items-center gap-2.5">
                    <ThumbsUp className="h-4.5 w-4.5 text-jade-600" />
                    آخر استخدام ناجح قبل {coupon.lastMin} دقيقة
                  </li>
                )}
              </ul>
            </div>
          </Reveal>

          {coupon && (
            <Reveal delay={160}>
              <div className="surface p-5">
                <h2 className="font-display text-sm font-extrabold text-ink-950">شروط الاستخدام</h2>
                <ul className="mt-3 space-y-2.5">
                  {coupon.terms.map((t) => (
                    <li key={t} className="flex items-start gap-2 text-[13px] leading-6 text-ink-600">
                      <Tick />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          )}

          <Reveal delay={220}>
            <div className="surface p-5">
              <h2 className="font-display text-sm font-extrabold text-ink-950">عن {store.name}</h2>
              <p className="mt-2 text-[13px] leading-6 text-ink-500">{store.desc}</p>
              <Link to={`/store/${store.slug}`} className="btn-press mt-4 flex items-center justify-center gap-2 rounded-lg border border-brand-800/25 py-2.5 text-sm font-bold text-brand-800 transition hover:bg-brand-950 hover:text-white">
                كل كوبونات {store.name}
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>
        </div>
      </div>

      {/* similar */}
      {(similarCoupons.length > 0 || similarDeals.length > 0) && (
        <section className="container-x pt-12">
          <h2 className="mb-6 font-display text-xl font-extrabold text-ink-950">عروض مشابهة</h2>
          <div className="grid gap-5 lg:grid-cols-2">
            {similarCoupons.map((c) => (
              <CouponCard key={c.id} c={c} />
            ))}
            {similarDeals.map((d) => (
              <DealCard key={d.id} d={d} />
            ))}
          </div>
        </section>
      )}

      <div className="container-x pt-12">
        <SearchBar big />
      </div>
    </div>
  );
}
