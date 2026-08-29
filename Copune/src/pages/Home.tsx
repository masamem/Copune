import { ArrowLeft, Copy, ShieldCheck, Sparkles, ThumbsUp } from "lucide-react";
import { Link } from "react-router-dom";
import { categories, deals, storeCoupons } from "../lib/data";
import { usePageMeta } from "../lib/utils";
import { useApp } from "../state/AppContext";
import { CategoryCard, CouponCard, DealCard, StoreCard } from "../components/cards";
import { Reveal, SectionHead, StoreTile } from "../components/ui";
import { SearchBar } from "../components/SearchBar";

function MiniTicket({ id, r, delay }: { id: string; r: number; delay: number }) {
  const { allCoupons, allStores, openCoupon } = useApp();
  const c = allCoupons.find((x) => x.id === id);
  const s = c && allStores.find((x) => x.slug === c.store);
  if (!c || !s) return null;
  return (
    <div
      className="animate-floaty absolute rounded-xl border border-ink-100 bg-white p-3.5 shadow-lift"
      style={{ ["--r" as never]: `${r}deg`, animationDelay: `${delay}s`, transform: `rotate(${r}deg)` }}
    >
      <div className="flex items-center gap-3">
        <StoreTile store={s} size={38} className="!rounded-lg" />
        <div>
          <p className="text-[10px] font-bold text-ink-400">{s.name}</p>
          <p className="font-display text-lg font-black leading-tight text-flame-600">{c.label}</p>
        </div>
      </div>
      <div className="mt-2.5 flex items-center justify-between gap-2 rounded-lg border border-dashed border-ink-200 bg-ink-50/60 py-1.5 pe-2 ps-2.5">
        <span className="font-mono text-xs font-bold tracking-widest text-ink-400 blur-[3px]" dir="ltr">{c.code}</span>
        <button onClick={() => openCoupon(c)} className="btn-press rounded-md bg-brand-950 px-2.5 py-1 text-[10px] font-bold text-white hover:bg-brand-800">
          عرض الكود
        </button>
      </div>
    </div>
  );
}

export function HomePage() {
  const { allCoupons, allStores } = useApp();

  usePageMeta(
    "وفّر | كوبونات وأكواد خصم السعودية — نون، نمشي، أمازون",
    "اكتشف أكواد خصم مجربة وعروض محدثة يومياً لأشهر المتاجر في السعودية: نون، نمشي، أمازون، آي هيرب، جرير والمزيد. انسخ الكود ووفّر فوراً.",
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "وفّر",
      url: "https://waffir.sa",
      potentialAction: { "@type": "SearchAction", target: "https://waffir.sa/search?q={search_term_string}", "query-input": "required name=search_term_string" },
    }
  );

  const featured = allCoupons.filter((c) => c.featured).slice(0, 6);
  const rest = allCoupons.filter((c) => !c.featured).slice(0, 2);
  const avgRate = Math.round(allCoupons.reduce((s, c) => s + c.rate, 0) / (allCoupons.length || 1));
  const heroCoupons = [allCoupons.find((c) => c.id === "c-namshi-30")!, allCoupons.find((c) => c.id === "c-iherb-10")!, allCoupons.find((c) => c.id === "c-noon-25")!].filter(Boolean);

  return (
    <>
      {/* ============ HERO ============ */}
      <section className="hairline-grid relative overflow-hidden border-b border-ink-100 bg-white">
        <div className="pointer-events-none absolute -top-32 start-1/2 h-96 w-[42rem] -translate-x-1/2 rounded-full bg-brand-100/60 blur-3xl" />
        <div className="container-x relative grid items-center gap-10 py-12 lg:grid-cols-[1.15fr_0.85fr] lg:py-20">
          <div>
            <Reveal>
              <p className="chip bg-jade-50 text-jade-700 ring-1 ring-jade-200">
                <ShieldCheck className="h-3.5 w-3.5" />
                أكواد مجرّبة يدوياً — تحديث يومي
              </p>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="mt-5 font-display text-[34px] font-black leading-[1.25] text-ink-950 sm:text-5xl sm:leading-[1.2] lg:text-[54px]">
                وفّر أكثر مع أفضل{" "}
                <span className="relative inline-block">
                  كوبونات
                  <svg className="absolute -bottom-1 start-0 w-full" viewBox="0 0 200 12" fill="none" aria-hidden>
                    <path d="M3 9c40-6 120-8 194-4" stroke="#d5a94a" strokeWidth="5" strokeLinecap="round" />
                  </svg>
                </span>{" "}
                وعروض السعودية
              </h1>
            </Reveal>
            <Reveal delay={160}>
              <p className="mt-5 max-w-xl text-[15px] leading-8 text-ink-500">
                اكتشف أكواد خصم مجربة وعروضاً محدثة لأشهر المتاجر. انسخ الكود بنقرة واحدة، وسنفتح لك المتجر جاهزاً للتسوق.
              </p>
            </Reveal>
            <Reveal delay={240}>
              <div className="mt-7 max-w-xl">
                <SearchBar big />
              </div>
            </Reveal>
            <Reveal delay={320}>
              <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
                <span className="font-bold text-ink-400">شائع الآن:</span>
                {["نون", "نمشي", "أمازون", "آي هيرب", "كريم"].map((s) => (
                  <Link key={s} to={`/search?q=${encodeURIComponent(s)}`} className="chip bg-white text-ink-600 ring-1 ring-ink-200 transition hover:bg-brand-50 hover:text-brand-800 hover:ring-brand-200">
                    {s}
                  </Link>
                ))}
              </div>
            </Reveal>
            <Reveal delay={400}>
              <div className="mt-8 flex flex-wrap gap-x-7 gap-y-3 text-[13px] font-bold text-ink-600">
                <span className="flex items-center gap-2"><Copy className="h-4 w-4 text-brand-700" /> نسخ تلقائي للكود</span>
                <span className="flex items-center gap-2"><ThumbsUp className="h-4 w-4 text-brand-700" /> تقييمات مستخدمين حقيقية</span>
                <span className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-brand-700" /> مجاني بالكامل</span>
              </div>
            </Reveal>
          </div>

          {/* floating tickets */}
          <div className="relative hidden h-[420px] lg:block" aria-hidden={false}>
            <div className="absolute start-4 top-2"><MiniTicket id={heroCoupons[0]?.id || "c-namshi-30"} r={-4} delay={0} /></div>
            <div className="absolute end-0 top-40"><MiniTicket id={heroCoupons[1]?.id || "c-iherb-10"} r={3} delay={1.4} /></div>
            <div className="absolute start-16 bottom-4"><MiniTicket id={heroCoupons[2]?.id || "c-noon-25"} r={-2} delay={2.6} /></div>
            <div className="animate-floaty absolute end-10 top-6 flex items-center gap-2 rounded-full bg-ink-950 px-3.5 py-2 text-[11px] font-bold text-white shadow-lift" style={{ animationDelay: "0.8s" }}>
              <span className="relative flex h-2 w-2"><span className="absolute h-full w-full animate-ping rounded-full bg-jade-400 opacity-70" /><span className="relative h-2 w-2 rounded-full bg-jade-400" /></span>
              تم التحقق قبل دقائق
            </div>
            <div className="animate-floaty absolute bottom-24 end-2 flex items-center gap-2 rounded-full border border-ink-100 bg-white px-3.5 py-2 text-[11px] font-bold text-ink-700 shadow-lift" style={{ animationDelay: "2s" }}>
              <ThumbsUp className="h-3.5 w-3.5 text-jade-500" />
              نجح مع {avgRate}% من المستخدمين
            </div>
          </div>
        </div>

        {/* live ticker */}
        <div dir="ltr" className="relative border-t border-ink-100 bg-paper/80 py-2.5">
          <div className="marquee-track flex gap-8" style={{ direction: "ltr" }}>
            {[0, 1].map((dup) => (
              <div key={dup} className="flex shrink-0 items-center gap-8" aria-hidden={dup === 1}>
                {allCoupons.slice(0, 9).map((c) => {
                  const s = allStores.find((x) => x.slug === c.store);
                  return (
                    <Link key={dup + c.id} to={`/offer/${c.id}`} dir="rtl" className="flex items-center gap-2 whitespace-nowrap text-xs font-semibold text-ink-500 transition hover:text-brand-800">
                      <span className="h-1.5 w-1.5 rounded-full bg-gold-400" />
                      {s?.name}: <strong className="text-flame-600">{c.label}</strong> بكود <span dir="ltr" className="font-mono font-bold">{c.code}</span>
                    </Link>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ STATS ============ */}
      <section className="border-b border-ink-100 bg-white">
        <div className="container-x grid grid-cols-2 md:grid-cols-4">
          {[
            { n: `${allCoupons.length}`, t: "كوبون نشط ومجرّب" },
            { n: `${allStores.length}`, t: "متجر موثوق" },
            { n: `${avgRate}%`, t: "متوسط نجاح الأكواد" },
            { n: "يومياً", t: "تحديث وفحص للأكواد" },
          ].map((s, i) => (
            <div key={s.t} className={`px-4 py-6 text-center ${i % 2 === 1 ? "border-s border-ink-100" : ""} ${i >= 1 ? "md:border-s md:border-ink-100" : ""} ${i >= 2 ? "border-t border-ink-100 md:border-t-0" : ""}`}>
              <p className="num font-display text-2xl font-black text-brand-950 sm:text-3xl">{s.n}</p>
              <p className="mt-1 text-xs font-bold text-ink-400">{s.t}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ============ POPULAR STORES ============ */}
      <section className="container-x py-14 sm:py-16">
        <SectionHead
          eyebrow="متاجر موثوقة"
          title="أشهر المتاجر"
          desc="اضغط على أي متجر لعرض جميع الكوبونات والعروض المتاحة له."
          action={
            <Link to="/stores" className="btn-press flex items-center gap-1.5 rounded-lg border border-ink-200 px-4 py-2.5 text-[13px] font-bold text-ink-700 transition hover:border-brand-800 hover:bg-brand-950 hover:text-white">
              جميع المتاجر
              <ArrowLeft className="h-4 w-4" />
            </Link>
          }
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {allStores.filter((s) => s.featured || s.reviews > 2000).slice(0, 8).map((s, i) => (
            <StoreCard key={s.slug} slug={s.slug} delay={i * 60} />
          ))}
        </div>
      </section>

      {/* ============ BEST COUPONS ============ */}
      <section className="border-y border-ink-100 bg-white py-14 sm:py-16">
        <div className="container-x">
          <SectionHead
            eyebrow="محدّث اليوم"
            title="أفضل كوبونات اليوم"
            desc="الأكواد الأعلى نجاحاً بناءً على تقييمات المستخدمين الفعلية — اضغط «عرض الكود» وسننسخه لك فوراً."
          />
          <div className="grid gap-5 lg:grid-cols-2">
            {[...featured, ...rest].slice(0, 6).map((c, i) => (
              <CouponCard key={c.id} c={c} delay={i * 70} notchBg="bg-white" />
            ))}
          </div>
        </div>
      </section>

      {/* ============ DEALS ============ */}
      <section className="container-x py-14 sm:py-16">
        <SectionHead
          eyebrow="بدون كود"
          title="عروض لا تحتاج كود"
          desc="خصومات مباشرة تُطبَّق تلقائياً في المتجر — فقط اضغط «اذهب للعرض»."
          action={
            <Link to="/deals" className="btn-press flex items-center gap-1.5 rounded-lg border border-ink-200 px-4 py-2.5 text-[13px] font-bold text-ink-700 transition hover:border-brand-800 hover:bg-brand-950 hover:text-white">
              كل العروض
              <ArrowLeft className="h-4 w-4" />
            </Link>
          }
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {deals.slice(0, 4).map((d, i) => (
            <DealCard key={d.id} d={d} delay={i * 70} />
          ))}
        </div>
      </section>

      {/* ============ CATEGORIES ============ */}
      <section className="border-y border-ink-100 bg-white py-14 sm:py-16">
        <div className="container-x">
          <SectionHead eyebrow="تسوّق حسب الاهتمام" title="التصنيفات" desc="تصفّح العروض والكوبونات حسب ما تبحث عنه." />
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((c, i) => {
              const count =
                deals.filter((d) => d.cat === c.slug).length +
                allCoupons.filter((cp) => allStores.find((s) => s.slug === cp.store)?.cats.includes(c.slug)).length;
              return <CategoryCard key={c.slug} cat={c} count={count} delay={i * 50} />;
            })}
          </div>
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section className="container-x py-14 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <div className="lg:sticky lg:top-28">
              <p className="mb-2 flex items-center gap-2 text-xs font-bold tracking-wide text-gold-600">
                <span className="h-px w-6 bg-gold-400 inline-block" />
                رحلة التوفير
              </p>
              <h2 className="font-display text-2xl font-black leading-snug text-ink-950 sm:text-4xl sm:leading-snug">
                من البحث إلى التوفير
                <br />
                في أقل من <span className="text-brand-700">10 ثوانٍ</span>
              </h2>
              <p className="mt-4 max-w-md text-sm leading-7 text-ink-500">
                صمّمنا وفّر ليختصر الطريق: لا حسابات إجبارية، لا خطوات كثيرة، لا إعلانات مزعجة. ابحث، اكشف الكود، تسوّق بخصم.
              </p>
              <Link to="/faq" className="btn-press mt-6 inline-flex items-center gap-2 rounded-lg bg-brand-950 px-5 py-3 text-sm font-bold text-white hover:bg-brand-800">
                الأسئلة الشائعة
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>
          <div className="space-y-4">
            {[
              { n: "01", t: "ابحث عن متجرك", d: "اكتب اسم المتجر مثل نون أو نمشي، أو تصفّح التصنيفات والمتاجر الأشهر." },
              { n: "02", t: "اضغط «عرض الكود»", d: "يظهر لك الكود داخل نافذة أنيقة مع شروط الاستخدام كاملة." },
              { n: "03", t: "نُسخ الكود تلقائياً", d: "ننسخ الكود إلى حافظتك فوراً، ونفتح المتجر في نافذة جديدة بنفس النقرة." },
              { n: "04", t: "ألصقه عند الدفع", d: "الصق الكود في خانة الخصم بالسلة، وقيّم الكود ليساعد غيرك." },
            ].map((s, i) => (
              <Reveal key={s.n} delay={i * 90}>
                <div className="surface group flex gap-5 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-gold-200 hover:shadow-lift sm:items-center">
                  <span className="font-display text-3xl font-black text-ink-100 transition group-hover:text-gold-400 sm:text-4xl">{s.n}</span>
                  <span className="hidden h-12 w-px border-s-2 border-dashed border-ink-100 sm:block" />
                  <span>
                    <span className="block font-display text-base font-extrabold text-ink-950">{s.t}</span>
                    <span className="mt-1 block text-[13px] leading-6 text-ink-500">{s.d}</span>
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ LATEST COUPONS ============ */}
      <section className="border-t border-ink-100 bg-white py-14 sm:py-16">
        <div className="container-x">
          <SectionHead
            eyebrow="جديدنا"
            title="أحدث الكوبونات المضافة"
            desc="آخر الأكواد التي أضافها وتحقق منها فريق وفّر."
          />
          <div className="grid gap-5 lg:grid-cols-2">
            {[...allCoupons].sort((a, b) => a.addedD - b.addedD).slice(0, 4).map((c, i) => (
              <CouponCard key={c.id} c={c} delay={i * 70} notchBg="bg-white" />
            ))}
          </div>
          <p className="mt-8 text-center text-xs text-ink-400">
            مثال على كوبون موثوق: {storeCoupons("noon").length} كوبونات نون نشطة اليوم —{" "}
            <Link to="/store/noon" className="font-bold text-brand-700 underline-offset-4 hover:underline">كوبونات نون السعودية</Link>
          </p>
        </div>
      </section>
    </>
  );
}
