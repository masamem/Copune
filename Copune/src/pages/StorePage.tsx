import { Heart, RefreshCw, Store as StoreIcon, Ticket } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { deals, faqs } from "../lib/data";
import { fmt, usePageMeta } from "../lib/utils";
import { useApp } from "../state/AppContext";
import { CouponCard, DealCard, StoreCard } from "../components/cards";
import { Acc, Crumbs, Empty, Reveal, SectionHead, Stars, StoreTile, Tick } from "../components/ui";

export function StorePage() {
  const { slug = "" } = useParams();
  const { allStores, allCoupons, isFav, toggleFav } = useApp();
  const store = allStores.find((s) => s.slug === slug);

  const cps = allCoupons.filter((c) => c.store === slug);
  const dls = deals.filter((d) => d.store === slug);
  const featured = cps.find((c) => c.featured) || [...cps].sort((a, b) => b.rate - a.rate)[0];
  const rest = cps.filter((c) => c.id !== featured?.id);

  usePageMeta(
    store ? `كوبونات ${store.name} السعودية — أكواد خصم ${store.name} اليوم` : "المتجر غير موجود | وفّر",
    store ? `أفضل ${cps.length} كوبونات وأكواد خصم ${store.name} محدثة اليوم — أكواد مجربة بنسب نجاح حقيقية، عروض بدون كود، وكوبونات أول طلب والتطبيق والبطاقات البنكية.` : undefined,
    store
      ? {
          "@context": "https://schema.org",
          "@type": "Store",
          name: store.name,
          alternateName: store.en,
          url: store.url,
          description: store.desc,
          aggregateRating: { "@type": "AggregateRating", ratingValue: store.rating, reviewCount: store.reviews },
          makesOffer: cps.map((c) => ({
            "@type": "Offer",
            name: c.title,
            description: c.desc,
            availability: "https://schema.org/InStock",
          })),
        }
      : undefined
  );

  if (!store) {
    return (
      <div className="container-x py-20">
        <Empty
          icon={<StoreIcon className="h-7 w-7" />}
          title="المتجر غير موجود"
          desc="ربما تغير رابط المتجر. تصفّح جميع المتاجر المتاحة في وفّر."
          action={<Link to="/stores" className="btn-press rounded-lg bg-brand-950 px-5 py-2.5 text-sm font-bold text-white">جميع المتاجر</Link>}
        />
      </div>
    );
  }

  const fav = isFav("stores", store.slug);
  const related = allStores.filter((s) => s.slug !== store.slug && s.cats.some((c) => store.cats.includes(c))).slice(0, 3);
  const firstOrder = cps.find((c) => c.first);
  const appCoupon = cps.find((c) => c.app);
  const bankCoupon = cps.find((c) => c.bank);
  const shipCoupon = cps.find((c) => c.ship);

  return (
    <div className="pb-16">
      {/* header */}
      <div className="border-b border-ink-100 bg-white">
        <div className="container-x py-8">
          <Crumbs items={[{ label: "الرئيسية", to: "/" }, { label: "المتاجر", to: "/stores" }, { label: store.name }]} />
          <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-5">
              <StoreTile store={store} size={84} className="!rounded-2xl shadow-soft" />
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="font-display text-2xl font-black text-ink-950 sm:text-3xl">كوبونات {store.name} السعودية</h1>
                  <span className="chip bg-jade-50 text-jade-700 ring-1 ring-jade-200">
                    <RefreshCw className="h-3 w-3" />
                    آخر تحديث قبل {store.updatedH} ساعات
                  </span>
                </div>
                <p className="mt-1 text-sm font-semibold text-gold-600">{store.tagline}</p>
                <p className="mt-2 max-w-2xl text-sm leading-7 text-ink-500">{store.desc}</p>
                <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-bold text-ink-500">
                  <span className="flex items-center gap-1.5">
                    <Stars value={store.rating} />
                    <span className="text-ink-800">{store.rating}</span> ({fmt(store.reviews)} تقييم)
                  </span>
                  <span className="flex items-center gap-1.5"><Ticket className="h-4 w-4 text-brand-700" /> {cps.length} كوبون نشط</span>
                  <span>{dls.length} عرض بدون كود</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => toggleFav("stores", store.slug, store.name)}
              className={`btn-press flex shrink-0 items-center justify-center gap-2 self-start rounded-xl px-6 py-3 text-sm font-bold transition ${
                fav ? "bg-flame-50 text-flame-600 ring-1 ring-flame-200" : "bg-brand-950 text-white hover:bg-brand-800"
              }`}
            >
              <Heart className="h-4.5 w-4.5" fill={fav ? "currentColor" : "none"} />
              {fav ? "تتابع هذا المتجر" : "متابعة المتجر"}
            </button>
          </div>
        </div>
      </div>

      {/* best coupon */}
      {featured && (
        <section className="container-x pt-10">
          <SectionHead
            eyebrow="الأعلى نجاحاً"
            title={
  store.slug === "amazon"
    ? "أفضل عروض أمازون السعودية اليوم"
    : `أفضل كود خصم ${store.name} اليوم`
}
          />
          <Reveal>
            <div className="rounded-2xl bg-gradient-to-l from-gold-100 via-gold-50 to-transparent p-1.5 ring-1 ring-gold-200">
              <CouponCard c={featured} notchBg="bg-gold-50" />
            </div>
          </Reveal>
        </section>
      )}

      {/* all coupons */}
      {rest.length > 0 && (
        <section className="container-x pt-12">
          <SectionHead title={`جميع كوبونات ${store.name}`} desc={`${rest.length} أكواد إضافية متاحة الآن.`} />
          <div className="grid gap-5 lg:grid-cols-2">
            {rest.map((c, i) => (
              <CouponCard key={c.id} c={c} delay={i * 60} />
            ))}
          </div>
        </section>
      )}

      {cps.length === 0 && (
        <section className="container-x pt-12">
          <Empty
            icon={<Ticket className="h-7 w-7" />}
            title={`لا كوبونات نشطة لـ${store.name} حالياً`}
            desc="تابع المتجر وسنرسل لك تنبيهاً فور توفر أول كود خصم."
            action={
              <button onClick={() => toggleFav("stores", store.slug, store.name)} className="btn-press rounded-lg bg-brand-950 px-5 py-2.5 text-sm font-bold text-white">
                {fav ? "أنت تتابع المتجر" : "متابعة المتجر"}
              </button>
            }
          />
        </section>
      )}

      {/* deals */}
      {dls.length > 0 && (
        <section className="container-x pt-12">
          <SectionHead title={`عروض ${store.name} بدون كود`} desc="خصومات مباشرة تُطبق تلقائياً عند الشراء." />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {dls.map((d, i) => (
              <DealCard key={d.id} d={d} delay={i * 60} />
            ))}
          </div>
        </section>
      )}

      {/* SEO sections */}
      <section className="container-x pt-14">
        <SectionHead title={`كل ما تحتاج معرفته عن خصومات ${store.name}`} desc="أدلة محدثة تساعدك على تحقيق أكبر توفير ممكن." />
        <div className="grid gap-3 lg:grid-cols-2">
          <Acc q={`كود خصم ${store.name} لأول طلب`} defaultOpen>
            {firstOrder ? (
              <>
                أقوى خيار للمتعاملين الجدد مع {store.name} هو كود <strong className="font-mono" dir="ltr">{firstOrder.code}</strong> الذي يمنحك {firstOrder.label}.{" "}
                {firstOrder.terms[0]}. يمكنك كشفه من الكوبونات أعلاه بنقرة واحدة.
              </>
            ) : (
              <>عندما تتوفر أكواد خاصة بالطلب الأول من {store.name} ستجدها في أعلى هذه الصفحة موسومة بشارة «أول طلب». تابع المتجر ليصلك تنبيه فوري عند إضافتها.</>
            )}
          </Acc>
          <Acc q={`عروض ${store.name} الحالية`}>
            <ul className="space-y-2">
              {[...cps.slice(0, 2).map((c) => ({ t: c.title, to: `/offer/${c.id}` })), ...dls.slice(0, 2).map((d) => ({ t: d.title, to: `/offer/${d.id}` }))].map((o) => (
                <li key={o.to + o.t} className="flex items-start gap-2">
                  <Tick />
                  <Link to={o.to} className="font-semibold text-brand-800 underline-offset-4 hover:underline">{o.t}</Link>
                </li>
              ))}
            </ul>
          </Acc>
          <Acc q={`كوبونات تطبيق ${store.name}`}>
            {appCoupon ? (
              <>كود <strong className="font-mono" dir="ltr">{appCoupon.code}</strong> يعمل حصرياً داخل تطبيق {store.name} ويمنحك {appCoupon.label}. حمّل التطبيق وألصق الكود في سلة الدفع. {appCoupon.terms[0]}.</>
            ) : (
              <>يدعم {store.name} الشراء من التطبيق والموقع معاً، وجميع الأكواد المعروضة أعلاه تعمل على القناتين ما لم يُذكر خلاف ذلك في الشروط.</>
            )}
          </Acc>
          <Acc q="عروض البطاقات البنكية">
            {bankCoupon ? (
              <>يتوفر حالياً كود <strong className="font-mono" dir="ltr">{bankCoupon.code}</strong> — خصم إضافي عند الدفع ببطاقات مدى والبطاقات الائتمانية المشاركة. {bankCoupon.terms[0]}.</>
            ) : (
              <>يعلن {store.name} بشكل دوري عن خصومات إضافية مع البنوك السعودية (الراجحي، الأهلي، الإنماء وغيرها). تابع المتجر وسنضيف هذه العروض فور تأكدنا منها.</>
            )}
          </Acc>
          <Acc q="الشحن المجاني والتوصيل">
            {shipCoupon ? (
              <>استخدم كود <strong className="font-mono" dir="ltr">{shipCoupon.code}</strong> للحصول على شحن مجاني بدون حد أدنى. {shipCoupon.terms[0]}.</>
            ) : (
              <>يوفر {store.name} عادة شحنًا مجانياً للطلبات التي تتجاوز حداً معيناً أو لعملاء برامج الولاء. راجع صفحة الدفع في المتجر للتفاصيل الدقيقة.</>
            )}
          </Acc>
          <Acc q={`كيفية استخدام كود خصم ${store.name}`}>
            <ol className="list-inside space-y-2">
              {[
                `اضغط زر «عرض الكود» على الكوبون المطلوب من صفحة ${store.name}`,
                "سيُنسخ الكود تلقائياً ويُفتح المتجر في نافذة جديدة",
                `أضف منتجاتك إلى سلة ${store.name}`,
                "في صفحة الدفع ابحث عن خانة «كود الخصم / Coupon Code»",
                "الصق الكود واضغط تطبيق، وستظهر قيمة الخصم فوراً",
              ].map((s, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-50 font-display text-[10px] font-black text-brand-800">{i + 1}</span>
                  <span>{s}</span>
                </li>
              ))}
            </ol>
          </Acc>
        </div>
      </section>

      {/* FAQ */}
      <section className="container-x pt-14">
        <SectionHead title="أسئلة شائعة" />
        <div className="grid gap-3 lg:grid-cols-2">
          {faqs.slice(0, 4).map((f) => (
            <Acc key={f.q} q={f.q}>{f.a}</Acc>
          ))}
        </div>
      </section>

      {/* related */}
      {related.length > 0 && (
        <section className="container-x pt-14">
          <SectionHead title="متاجر مشابهة قد تعجبك" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {related.map((s, i) => (
              <StoreCard key={s.slug} slug={s.slug} delay={i * 60} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
