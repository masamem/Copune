import { useEffect } from "react";
import { ArrowLeft, ChevronLeft, Clock, ExternalLink, Flame, Heart, ThumbsDown, ThumbsUp } from "lucide-react";
import { Link } from "react-router-dom";
import { catBy, type Coupon, type Deal, type Category } from "../lib/data";
import { affUrl, fmt, logEvent, makeTid, trackImpressions } from "../lib/utils";
import { useApp } from "../state/AppContext";
import { CatIcon, PulseDot, Reveal, StoreTile } from "./ui";

const badgeStyle = (b: string) => {
  if (b === "حصري") return "bg-gold-100 text-gold-800 ring-1 ring-gold-200";
  if (b === "مجرب") return "bg-brand-50 text-brand-800 ring-1 ring-brand-100";
  return "bg-ink-50 text-ink-600 ring-1 ring-ink-100";
};

function timeAgo(min: number) {
  if (min < 2) return "قبل لحظات";
  if (min < 60) return `قبل ${min} دقيقة`;
  if (min < 60 * 24) return `قبل ${Math.floor(min / 60)} ساعة`;
  return `قبل ${Math.floor(min / 1440)} يوم`;
}

/* ================= Store card ================= */
export function StoreCard({ slug, delay = 0 }: { slug: string; delay?: number }) {
  const { allStores, allCoupons, isFav, toggleFav } = useApp();
  const store = allStores.find((s) => s.slug === slug);
  if (!store) return null;
  const cps = allCoupons.filter((c) => c.store === slug);
  const maxOff = Math.max(0, ...cps.map((c) => c.value));
  const fav = isFav("stores", slug);
  return (
    <Reveal delay={delay}>
      <Link
        to={`/store/${slug}`}
        className="surface group relative block p-4 transition-all duration-300 hover:-translate-y-1 hover:border-ink-200 hover:shadow-lift"
      >
        <button
          onClick={(e) => { e.preventDefault(); toggleFav("stores", slug, store.name); }}
          aria-label={fav ? "إلغاء متابعة المتجر" : "متابعة المتجر"}
          className={`absolute start-3 top-3 rounded-full p-1.5 transition ${fav ? "text-flame-500" : "text-ink-300 hover:text-flame-400"}`}
        >
          <Heart className="h-4 w-4" fill={fav ? "currentColor" : "none"} />
        </button>
        <div className="flex items-center gap-3.5">
          <StoreTile store={store} size={54} />
          <div className="min-w-0">
            <h3 className="truncate font-display text-base font-bold text-ink-950">{store.name}</h3>
            <p className="text-[11px] font-medium tracking-wide text-ink-400" dir="ltr">{store.en}</p>
          </div>
        </div>
        <div className="mt-4 flex items-end justify-between gap-2">
          <div>
            {maxOff > 0 ? (
              <p className="font-display text-sm font-extrabold text-flame-600">حتى {maxOff}% خصم</p>
            ) : (
              <p className="font-display text-sm font-extrabold text-brand-800">عروض مباشرة</p>
            )}
            <p className="mt-0.5 text-xs text-ink-500">
              {cps.length > 0 ? `${cps.length} كوبونات متاحة` : "عروض بدون كود"}
            </p>
          </div>
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink-50 text-ink-400 transition group-hover:bg-brand-950 group-hover:text-white">
            <ChevronLeft className="h-4 w-4" />
          </span>
        </div>
      </Link>
    </Reveal>
  );
}

/* ================= Coupon card ================= */
export function CouponCard({ c, delay = 0, notchBg = "bg-paper" }: { c: Coupon; delay?: number; notchBg?: string }) {
  const { allStores, openCoupon, isFav, toggleFav, votes, vote } = useApp();
  const store = allStores.find((s) => s.slug === c.store);

  useEffect(() => {
    trackImpressions([{ id: c.id, store: c.store }]);
  }, [c.id, c.store]);

  if (!store) return null;
  const fav = isFav("coupons", c.id);
  const myVote = votes[c.id];
  const isDirectOffer = !c.code;

  return (
    <Reveal delay={delay}>
      <article className="surface group relative overflow-visible transition-all duration-300 hover:-translate-y-1 hover:border-ink-200 hover:shadow-lift md:flex">
        {/* main content */}
        <div className="flex-1 p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <StoreTile store={store} size={44} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <Link to={`/store/${store.slug}`} className="truncate text-xs font-bold text-ink-500 hover:text-brand-700">
                  {store.name}
                </Link>
                <span className="flex items-center gap-1.5 text-[11px] font-semibold text-jade-600">
                  <PulseDot />
                  تم التحقق اليوم
                </span>
              </div>
              <Link to={`/offer/${c.id}`}>
                <h3 className="mt-1 font-display text-base font-bold leading-6 text-ink-950 transition group-hover:text-brand-800 sm:text-lg">
                  {c.title}
                </h3>
              </Link>
            </div>
            <button
              onClick={() => toggleFav("coupons", c.id, "الكوبون")}
              aria-label="حفظ الكوبون"
              className={`rounded-full p-1.5 transition ${fav ? "text-flame-500" : "text-ink-300 hover:text-flame-400"}`}
            >
              <Heart className="h-4.5 w-4.5" fill={fav ? "currentColor" : "none"} />
            </button>
          </div>

          <p className="mt-2 line-clamp-2 text-[13px] leading-6 text-ink-500">{c.desc}</p>

          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            {c.badges.map((b) => (
              <span key={b} className={`chip ${badgeStyle(b)}`}>{b}</span>
            ))}
            {c.exp && (
              <span className="chip bg-flame-50 text-flame-700 ring-1 ring-flame-100">
                <Clock className="h-3 w-3" />
                ينتهي خلال {c.exp} أيام
              </span>
            )}
          </div>

          <div className="mt-3.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] font-semibold text-ink-500">
  {isDirectOffer ? (
    <>
      <span className="text-jade-600">عرض مباشر من {store.en}</span>
      <span>بدون كود خصم</span>
      <span>السعر والعرض قد يتغيران</span>
    </>
  ) : (
    <>
      <span className="text-jade-600">نجح مع {c.rate}% من المستخدمين</span>
      <span>استخدمه {fmt(c.uses)} شخصاً</span>
      <span>آخر استخدام {timeAgo(c.lastMin)}</span>
    </>
  )}
</div>

          {!isDirectOffer && (
  <div className="mt-3 flex items-center gap-2 border-t border-dashed border-ink-100 pt-3">
    <span className="text-[11px] font-bold text-ink-400">جرّبته؟</span>

    <button
      onClick={() => vote(c.id, "up", c.store)}
      className={`btn-press flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold transition ${
        myVote === "up"
          ? "bg-jade-500 text-white"
          : "bg-jade-50 text-jade-700 ring-1 ring-jade-200 hover:bg-jade-100"
      }`}
    >
      <ThumbsUp className="h-3 w-3" />
      يعمل
    </button>

    <button
      onClick={() => vote(c.id, "down", c.store)}
      className={`btn-press flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold transition ${
        myVote === "down"
          ? "bg-flame-500 text-white"
          : "bg-flame-50 text-flame-700 ring-1 ring-flame-100 hover:bg-flame-100"
      }`}
    >
      <ThumbsDown className="h-3 w-3" />
      لا يعمل
    </button>

    {myVote && (
      <span className="text-[10px] font-bold text-jade-600">
        شكراً لتقييمك
      </span>
    )}
  </div>
)}

        {/* action zone — desktop */}
        <div className="relative hidden w-52 shrink-0 flex-col items-center justify-center gap-3 border-s-2 border-dashed border-ink-200 p-5 md:flex">
          <span className={`absolute -start-[13px] -top-[13px] h-6 w-6 rounded-full border border-ink-100 ${notchBg}`} />
          <span className={`absolute -bottom-[13px] -start-[13px] h-6 w-6 rounded-full border border-ink-100 ${notchBg}`} />
          <p className="text-center font-display text-3xl font-black leading-none text-flame-600">
  {isDirectOffer ? "عرض" : c.label}

  <span className="mt-1 block text-[11px] font-bold text-ink-400">
    {isDirectOffer ? "عرض مباشر" : "القيمة الموفرة"}
  </span>
</p>
          <button
  onClick={() => openCoupon(c)}
  className="btn-press w-full rounded-lg bg-brand-950 px-4 py-2.5 text-sm font-bold text-white shadow-glow hover:bg-brand-800"
>
  {isDirectOffer ? (
    <span className="flex items-center justify-center gap-2">
      مشاهدة العرض
      <ExternalLink className="h-4 w-4" />
    </span>
  ) : (
    "عرض الكود"
  )}
</button>
          <p className="text-[10px] font-semibold tracking-[0.25em] text-ink-300" dir="ltr">
            {"• • • • • •"}
          </p>
          {myVote && (
            <p className="text-[10px] font-bold text-jade-600">شكراً لتقييمك</p>
          )}
        </div>

        {/* action zone — mobile */}
<div className="relative border-t-2 border-dashed border-ink-200 md:hidden">
  <div className="flex items-center justify-between gap-3 px-4 py-3.5">
    <p className="font-display text-2xl font-black text-flame-600">
      {isDirectOffer ? "عرض" : c.label}
    </p>

    <button
  onClick={() => openCoupon(c)}
  className="btn-press w-full rounded-lg bg-brand-950 px-4 py-2.5 text-sm font-bold text-white shadow-glow hover:bg-brand-800"
>
  {isDirectOffer ? (
    <span className="flex items-center justify-center gap-2">
      مشاهدة العرض
      <ExternalLink className="h-4 w-4" />
    </span>
  ) : (
    "عرض الكود"
  )}
</button>
  </div>
</div>
      </article>
    </Reveal>
  );
}

/* ================= Deal card (no code) ================= */
export function DealCard({ d, delay = 0 }: { d: Deal; delay?: number }) {
  const { allStores, isFav, toggleFav, toast } = useApp();
  const store = allStores.find((s) => s.slug === d.store);
  const cat = catBy(d.cat);

  useEffect(() => {
    trackImpressions([{ id: d.id, store: d.store }]);
  }, [d.id, d.store]);

  if (!store) return null;
  const fav = isFav("deals", d.id);

  const go = () => {
    const tid = makeTid();
    logEvent({ type: "click", store: d.store, coupon: d.id, tid });
    toast("فتحنا العرض في نافذة جديدة", "info");
    window.open(affUrl(store.url, tid), "_blank", "noopener,noreferrer");
  };

  return (
    <Reveal delay={delay}>
      <article className="surface group flex h-full flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-ink-200 hover:shadow-lift">
        <div className="relative flex h-28 items-center justify-center overflow-hidden" style={{ backgroundColor: cat?.tint || "#e4eaf4" }}>
          <CatIcon icon={cat?.icon || "sparkles"} className="absolute -bottom-5 -start-4 h-28 w-28 opacity-15" />
          <div className="relative text-center" style={{ color: cat?.fg || "#2a3f6c" }}>
            <p className="font-display text-3xl font-black leading-none">{d.label}</p>
            <p className="mt-1 text-[11px] font-bold">خصم مباشر بدون كود</p>
          </div>
          <span className="chip absolute start-3 top-3 bg-white/90 text-ink-700 ring-1 ring-ink-100 backdrop-blur">{store.name}</span>
          <button
            onClick={() => toggleFav("deals", d.id, "العرض")}
            aria-label="حفظ العرض"
            className={`absolute end-3 top-3 rounded-full bg-white/90 p-1.5 shadow-soft backdrop-blur transition ${fav ? "text-flame-500" : "text-ink-400 hover:text-flame-400"}`}
          >
            <Heart className="h-4 w-4" fill={fav ? "currentColor" : "none"} />
          </button>
        </div>
        <div className="flex flex-1 flex-col p-4">
          <Link to={`/offer/${d.id}`}>
            <h3 className="font-display text-[15px] font-bold leading-6 text-ink-950 transition group-hover:text-brand-800">{d.title}</h3>
          </Link>
          <p className="mt-1 line-clamp-2 text-[13px] leading-6 text-ink-500">{d.desc}</p>
          <div className="mt-3 flex items-center gap-2 text-[11px] font-semibold text-ink-500">
            <span className="chip bg-flame-50 text-flame-700 ring-1 ring-flame-100">
              <Flame className="h-3 w-3" />
              {d.ends <= 3 ? "ينتهي قريباً" : `متبقٍ ${d.ends} أيام`}
            </span>
            <span>استفاد منه {fmt(d.uses)}</span>
          </div>
          <button
            onClick={go}
            className="btn-press mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-brand-800/25 py-2.5 text-sm font-bold text-brand-800 transition hover:border-brand-950 hover:bg-brand-950 hover:text-white"
          >
            اذهب للعرض
            <ExternalLink className="h-4 w-4" />
          </button>
        </div>
      </article>
    </Reveal>
  );
}

/* ================= Category card ================= */
export function CategoryCard({ cat, count, delay = 0 }: { cat: Category; count: number; delay?: number }) {
  return (
    <Reveal delay={delay}>
      <Link
        to={`/category/${cat.slug}`}
        className="surface group flex items-center gap-3.5 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-ink-200 hover:shadow-lift"
      >
        <span
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
          style={{ backgroundColor: cat.tint, color: cat.fg }}
        >
          <CatIcon icon={cat.icon} className="h-5.5 w-5.5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-display text-[15px] font-bold text-ink-950">{cat.name}</span>
          <span className="mt-0.5 block text-xs text-ink-500">{count} عرض وكوبون</span>
        </span>
        <ChevronLeft className="h-4 w-4 shrink-0 text-ink-300 transition group-hover:-translate-x-1 group-hover:text-brand-700" />
      </Link>
    </Reveal>
  );
}
