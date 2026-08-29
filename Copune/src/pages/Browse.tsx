import { useMemo, useState } from "react";
import { ArrowLeft, Flame, Search, SearchX, Store as StoreIcon, Tag, Ticket } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { categories, catBy, deals } from "../lib/data";
import { matches, usePageMeta } from "../lib/utils";
import { useApp } from "../state/AppContext";
import { CategoryCard, CouponCard, DealCard, StoreCard } from "../components/cards";
import { CatIcon, Empty, Reveal, SectionHead } from "../components/ui";

/* ================= ALL STORES ================= */
export function StoresPage() {
  const { allStores, allCoupons } = useApp();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const [letter, setLetter] = useState("الكل");

  usePageMeta("جميع المتاجر — كوبونات السعودية | وفّر", "تصفح جميع المتاجر المتاحة في وفّر: نون، أمازون، نمشي، آي هيرب، جرير والمزيد، مع كوبونات وأكواد خصم محدثة لكل متجر.");

  const letters = useMemo(() => {
    const set = new Set(allStores.map((s) => s.name.slice(0, 1)));
    return ["الكل", ...[...set].sort((a, b) => a.localeCompare(b, "ar"))];
  }, [allStores]);

  const filtered = allStores.filter((s) => {
    if (cat !== "all" && !s.cats.includes(cat)) return false;
    if (letter !== "الكل" && s.name.slice(0, 1) !== letter) return false;
    if (q && !matches(q, s.name, s.en, s.tagline)) return false;
    return true;
  });

  return (
    <div className="container-x py-10">
      <SectionHead
        eyebrow="الدليل الكامل"
        title="جميع المتاجر"
        desc={`${allStores.length} متجراً موثوقاً — اختر متجرك ووفّر فوراً.`}
      />

      <div className="surface mb-6 space-y-4 p-4 sm:p-5">
        <div className="flex items-center gap-2 rounded-lg border border-ink-200 bg-white px-3.5 transition focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20">
          <Search className="h-4 w-4 shrink-0 text-ink-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="ابحث عن متجر..."
            className="h-10 w-full bg-transparent text-sm outline-none placeholder:text-ink-400"
          />
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <button onClick={() => setCat("all")} className={`chip !px-3 !py-1 !text-xs transition ${cat === "all" ? "bg-brand-950 text-white" : "bg-ink-50 text-ink-600 ring-1 ring-ink-100 hover:bg-ink-100"}`}>الكل</button>
          {categories.map((c) => (
            <button key={c.slug} onClick={() => setCat(cat === c.slug ? "all" : c.slug)} className={`chip !px-3 !py-1 !text-xs transition ${cat === c.slug ? "bg-brand-950 text-white" : "bg-ink-50 text-ink-600 ring-1 ring-ink-100 hover:bg-ink-100"}`}>
              {c.name}
            </button>
          ))}
        </div>
        <div className="no-scrollbar flex items-center gap-1 overflow-x-auto border-t border-dashed border-ink-100 pt-3.5">
          {letters.map((l) => (
            <button
              key={l}
              onClick={() => setLetter(l)}
              className={`shrink-0 rounded-lg px-3 py-1.5 font-display text-sm font-bold transition ${letter === l ? "bg-gold-400 text-brand-950" : "text-ink-500 hover:bg-ink-50"}`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <Empty icon={<StoreIcon className="h-7 w-7" />} title="لا متاجر مطابقة" desc="جرّب تغيير البحث أو الفلاتر." />
      ) : (
        <>
          <p className="mb-4 text-xs font-bold text-ink-400">{filtered.length} متجر</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {filtered.map((s, i) => (
              <StoreCard key={s.slug} slug={s.slug} delay={i * 40} />
            ))}
          </div>
        </>
      )}

      <p className="mt-10 text-center text-xs text-ink-400">
        الأكثر بحثاً: {["noon", "amazon", "namshi"].map((s, i) => (
          <span key={s}>
            {i > 0 && " • "}
            <Link to={`/store/${s}`} className="font-bold text-brand-700 hover:underline">{allStores.find((x) => x.slug === s)?.name}</Link>
          </span>
        ))}{" "}
        — {allCoupons.length} كوبون نشط
      </p>
    </div>
  );
}

/* ================= CATEGORIES ================= */
export function CategoriesPage() {
  const { allStores, allCoupons } = useApp();
  usePageMeta("التصنيفات — تسوّق حسب الاهتمام | وفّر", "تصفح كوبونات وعروض السعودية حسب التصنيف: أزياء، إلكترونيات، عطور وجمال، مطاعم، سفر، منزل، أطفال، صحة ورياضة.");

  const countFor = (slug: string) =>
    deals.filter((d) => d.cat === slug).length +
    allCoupons.filter((c) => allStores.find((s) => s.slug === c.store)?.cats.includes(slug)).length;

  return (
    <div className="container-x py-10">
      <SectionHead eyebrow="تسوّق بذكاء" title="التصنيفات" desc="كل تصنيف يجمع لك المتاجر والكوبونات والعروض المرتبطة به." />
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((c, i) => (
          <Reveal key={c.slug} delay={i * 50}>
            <Link to={`/category/${c.slug}`} className="surface group block p-5 transition-all duration-300 hover:-translate-y-1 hover:border-ink-200 hover:shadow-lift">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110" style={{ backgroundColor: c.tint, color: c.fg }}>
                <CatIcon icon={c.icon} className="h-6 w-6" />
              </span>
              <h2 className="mt-4 font-display text-lg font-extrabold text-ink-950">{c.name}</h2>
              <p className="mt-1 text-[13px] text-ink-500">{c.desc}</p>
              <p className="mt-3 flex items-center gap-1.5 text-xs font-bold text-brand-800">
                {countFor(c.slug)} عرض وكوبون
                <ArrowLeft className="h-3.5 w-3.5 transition group-hover:-translate-x-1" />
              </p>
            </Link>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

/* ================= CATEGORY PAGE ================= */
export function CategoryPage() {
  const { slug = "" } = useParamsSafe();
  const { allStores, allCoupons } = useApp();
  const cat = catBy(slug);

  usePageMeta(
    cat ? `عروض وكوبونات ${cat.name} في السعودية | وفّر` : "التصنيف غير موجود | وفّر",
    cat ? `أفضل أكواد الخصم والعروض في تصنيف ${cat.name} — ${cat.desc}.` : undefined
  );

  if (!cat) {
    return (
      <div className="container-x py-20">
        <Empty icon={<Tag className="h-7 w-7" />} title="التصنيف غير موجود" desc="تصفح جميع التصنيفات المتاحة." action={<Link to="/categories" className="btn-press rounded-lg bg-brand-950 px-5 py-2.5 text-sm font-bold text-white">التصنيفات</Link>} />
      </div>
    );
  }

  const catStores = allStores.filter((s) => s.cats.includes(cat.slug));
  const catCoupons = allCoupons.filter((c) => catStores.some((s) => s.slug === c.store));
  const catDeals = deals.filter((d) => d.cat === cat.slug);

  return (
    <div className="pb-16">
      <div className="border-b border-ink-100 bg-white">
        <div className="container-x flex items-center gap-5 py-9">
          <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl shadow-soft" style={{ backgroundColor: cat.tint, color: cat.fg }}>
            <CatIcon icon={cat.icon} className="h-7 w-7" />
          </span>
          <div>
            <h1 className="font-display text-2xl font-black text-ink-950 sm:text-3xl">عروض وكوبونات {cat.name}</h1>
            <p className="mt-1 text-sm text-ink-500">{cat.desc} — {catCoupons.length} كوبون و{catDeals.length} عرض مباشر.</p>
          </div>
        </div>
      </div>

      {catStores.length > 0 && (
        <section className="container-x pt-10">
          <SectionHead title={`متاجر ${cat.name}`} />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {catStores.map((s, i) => (
              <StoreCard key={s.slug} slug={s.slug} delay={i * 50} />
            ))}
          </div>
        </section>
      )}

      {catCoupons.length > 0 && (
        <section className="container-x pt-12">
          <SectionHead title={`كوبونات ${cat.name}`} />
          <div className="grid gap-5 lg:grid-cols-2">
            {catCoupons.map((c, i) => (
              <CouponCard key={c.id} c={c} delay={i * 50} />
            ))}
          </div>
        </section>
      )}

      {catDeals.length > 0 && (
        <section className="container-x pt-12">
          <SectionHead title={`عروض ${cat.name} بدون كود`} />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {catDeals.map((d, i) => (
              <DealCard key={d.id} d={d} delay={i * 50} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

/* small helper so we can import useParams from one place */
import { useParams } from "react-router-dom";
function useParamsSafe() {
  return useParams();
}

/* ================= DEALS PAGE ================= */
export function DealsPage() {
  const { allStores, allCoupons } = useApp();
  const [params, setParams] = useSearchParams();
  const cat = params.get("cat") || "all";
  const store = params.get("store") || "all";
  const min = Number(params.get("min") || 0);
  const sort = params.get("sort") || "new";
  const type = params.get("type") || "all";

  usePageMeta("أحدث العروض وأقوى الخصومات في السعودية | وفّر", "صفحة واحدة تجمع أحدث كوبونات وأكواد الخصم والعروض المباشرة في السعودية، مع فلاتر حسب التصنيف والمتجر ونسبة الخصم.");

  const set = (k: string, v: string) => {
    const p = new URLSearchParams(params);
    if (v === "all" || v === "0" || v === "") p.delete(k);
    else p.set(k, v);
    setParams(p, { replace: true });
  };

  const items = useMemo(() => {
    type Uni = { kind: "coupon" | "deal"; id: string; store: string; value: number; rating: number; addedD: number };
    const list: Uni[] = [
      ...(type !== "deal" ? allCoupons.map((c) => ({ kind: "coupon" as const, id: c.id, store: c.store, value: c.value, rating: c.rate, addedD: c.addedD })) : []),
      ...(type !== "coupon" ? deals.map((d) => ({ kind: "deal" as const, id: d.id, store: d.store, value: d.value, rating: d.rating * 20, addedD: d.addedD })) : []),
    ];
    const st = allStores.find((s) => s.slug === store);
    return list
      .filter((i) => (cat === "all" ? true : st ? i.store === st.slug : allStores.find((s) => s.slug === i.store)?.cats.includes(cat)))
      .filter((i) => store === "all" || i.store === store)
      .filter((i) => i.value >= min)
      .sort((a, b) => (sort === "discount" ? b.value - a.value : sort === "rating" ? b.rating - a.rating : a.addedD - b.addedD));
  }, [allCoupons, allStores, cat, store, min, sort, type]);

  const chips = [
    { k: "min", v: "0", label: "كل الخصومات" },
    { k: "min", v: "10", label: "10% فأكثر" },
    { k: "min", v: "25", label: "25% فأكثر" },
    { k: "min", v: "50", label: "50% فأكثر" },
  ];

  return (
    <div className="container-x py-10">
      <SectionHead
        eyebrow={sort === "discount" ? "أقوى التوفيرات" : "محدّث باستمرار"}
        title={sort === "discount" ? "أقوى الخصومات" : "أحدث العروض"}
        desc="فلتر النتائج حسب التصنيف أو المتجر أو نسبة الخصم — كل ما تحتاجه في مكان واحد."
      />

      <div className="surface mb-6 space-y-3.5 p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-2">
          {[{ v: "all", l: "الكل" }, { v: "coupon", l: "أكواد خصم" }, { v: "deal", l: "عروض مباشرة" }].map((t) => (
            <button key={t.v} onClick={() => set("type", t.v)} className={`chip !px-3.5 !py-1.5 !text-xs transition ${type === t.v ? "bg-brand-950 text-white" : "bg-ink-50 text-ink-600 ring-1 ring-ink-100 hover:bg-ink-100"}`}>
              {t.l}
            </button>
          ))}
          <span className="mx-1 hidden h-5 w-px bg-ink-100 sm:block" />
          {chips.map((c) => (
            <button key={c.label} onClick={() => set("min", c.v)} className={`chip !px-3.5 !py-1.5 !text-xs transition ${(c.v === "0" ? min === 0 : min === Number(c.v)) ? "bg-gold-400 text-brand-950" : "bg-ink-50 text-ink-600 ring-1 ring-ink-100 hover:bg-ink-100"}`}>
              {c.label}
            </button>
          ))}
        </div>
        <div className="grid gap-2.5 border-t border-dashed border-ink-100 pt-3.5 sm:grid-cols-3">
          <select value={cat} onChange={(e) => set("cat", e.target.value)} className="field !py-2 text-sm" aria-label="التصنيف">
            <option value="all">كل التصنيفات</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>{c.name}</option>
            ))}
          </select>
          <select value={store} onChange={(e) => set("store", e.target.value)} className="field !py-2 text-sm" aria-label="المتجر">
            <option value="all">كل المتاجر</option>
            {allStores.map((s) => (
              <option key={s.slug} value={s.slug}>{s.name}</option>
            ))}
          </select>
          <select value={sort} onChange={(e) => set("sort", e.target.value)} className="field !py-2 text-sm" aria-label="الترتيب">
            <option value="new">الأحدث</option>
            <option value="discount">الأعلى خصماً</option>
            <option value="rating">الأعلى تقييماً</option>
          </select>
        </div>
      </div>

      <p className="mb-4 text-xs font-bold text-ink-400">{items.length} نتيجة</p>

      {items.length === 0 ? (
        <Empty icon={<Flame className="h-7 w-7" />} title="لا نتائج بهذه الفلاتر" desc="وسّع نطاق البحث أو غيّر نسبة الخصم المطلوبة." action={<button onClick={() => setParams({}, { replace: true })} className="btn-press rounded-lg bg-brand-950 px-5 py-2.5 text-sm font-bold text-white">إعادة تعيين الفلاتر</button>} />
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {items.map((i, idx) => {
            if (i.kind === "coupon") {
              const c = allCoupons.find((x) => x.id === i.id)!;
              return <CouponCard key={i.id} c={c} delay={Math.min(idx, 6) * 50} />;
            }
            const d = deals.find((x) => x.id === i.id)!;
            return <DealCard key={i.id} d={d} delay={Math.min(idx, 6) * 50} />;
          })}
        </div>
      )}
    </div>
  );
}

/* ================= SEARCH RESULTS ================= */
export function SearchPage() {
  const [params, setParams] = useSearchParams();
  const q = params.get("q") || "";
  const { allStores, allCoupons } = useApp();

  usePageMeta(q ? `نتائج البحث عن «${q}» | وفّر` : "البحث | وفّر", q ? `نتائج البحث عن ${q}: متاجر وكوبونات وعروض في السعودية.` : "ابحث عن أي متجر أو كوبون أو عرض في السعودية.");

  const res = useMemo(() => {
    if (!q.trim()) return null;
    return {
      stores: allStores.filter((s) => matches(q, s.name, s.en, s.tagline, s.desc)),
      coupons: allCoupons.filter((c) => {
        const st = allStores.find((s) => s.slug === c.store);
        return matches(q, c.title, c.code, c.desc, st?.name);
      }),
      deals: deals.filter((d) => {
        const st = allStores.find((s) => s.slug === d.store);
        return matches(q, d.title, d.desc, st?.name);
      }),
      cats: categories.filter((c) => matches(q, c.name, c.desc)),
    };
  }, [q, allStores, allCoupons]);

  const total = res ? res.stores.length + res.coupons.length + res.deals.length + res.cats.length : 0;

  return (
    <div className="container-x py-10">
      <SectionHead eyebrow="البحث الذكي" title={q ? `نتائج البحث عن «${q}»` : "ابحث في وفّر"} desc={q ? `${total} نتيجة عبر المتاجر والكوبونات والعروض والتصنيفات.` : "اكتب اسم متجر أو كوبون أو تصنيف للبدء."} />

      <div className="mb-8 max-w-2xl">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            const v = String(fd.get("q") || "").trim();
            setParams(v ? { q: v } : {}, { replace: true });
          }}
        >
          <div className="flex items-center gap-2 rounded-xl border border-ink-200 bg-white px-4 shadow-soft focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20">
            <Search className="h-5 w-5 shrink-0 text-ink-400" />
            <input name="q" defaultValue={q} placeholder="ابحث عن متجر أو كوبون..." className="h-14 w-full bg-transparent text-[15px] outline-none placeholder:text-ink-400" />
            <button type="submit" className="btn-press shrink-0 rounded-lg bg-brand-950 px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-800">بحث</button>
          </div>
        </form>
      </div>

      {!res && (
        <div>
          <p className="mb-3 text-xs font-bold text-ink-400">عمليات بحث شائعة</p>
          <div className="flex flex-wrap gap-2">
            {["نون", "أمازون", "نمشي", "آي هيرب", "كريم", "شحن مجاني", "أول طلب", "الإلكترونيات"].map((p) => (
              <Link key={p} to={`/search?q=${encodeURIComponent(p)}`} className="chip !px-4 !py-2 !text-[13px] bg-white text-ink-700 ring-1 ring-ink-200 transition hover:bg-brand-50 hover:text-brand-800">{p}</Link>
            ))}
          </div>
        </div>
      )}

      {res && total === 0 && (
        <Empty icon={<SearchX className="h-7 w-7" />} title={`لا نتائج عن «${q}»`} desc="جرّب كلمة أخرى مثل «نون» أو «خصم أول طلب» أو تصفح المتاجر مباشرة." action={<Link to="/stores" className="btn-press rounded-lg bg-brand-950 px-5 py-2.5 text-sm font-bold text-white">جميع المتاجر</Link>} />
      )}

      {res && res.stores.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-extrabold text-ink-950"><StoreIcon className="h-5 w-5 text-brand-700" /> متاجر ({res.stores.length})</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {res.stores.map((s, i) => <StoreCard key={s.slug} slug={s.slug} delay={i * 40} />)}
          </div>
        </section>
      )}

      {res && res.coupons.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-extrabold text-ink-950"><Ticket className="h-5 w-5 text-brand-700" /> كوبونات ({res.coupons.length})</h2>
          <div className="grid gap-5 lg:grid-cols-2">
            {res.coupons.map((c, i) => <CouponCard key={c.id} c={c} delay={i * 40} />)}
          </div>
        </section>
      )}

      {res && res.deals.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-extrabold text-ink-950"><Flame className="h-5 w-5 text-flame-500" /> عروض بدون كود ({res.deals.length})</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {res.deals.map((d, i) => <DealCard key={d.id} d={d} delay={i * 40} />)}
          </div>
        </section>
      )}

      {res && res.cats.length > 0 && (
        <section>
          <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-extrabold text-ink-950"><Tag className="h-5 w-5 text-gold-600" /> تصنيفات ({res.cats.length})</h2>
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3">
            {res.cats.map((c, i) => <CategoryCard key={c.slug} cat={c} count={deals.filter((d) => d.cat === c.slug).length} delay={i * 40} />)}
          </div>
        </section>
      )}
    </div>
  );
}
