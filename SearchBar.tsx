import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Flame, Search, Store as StoreIcon, Tag, Ticket } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { categories, deals } from "../lib/data";
import { matches } from "../lib/utils";
import { useApp } from "../state/AppContext";
import { StoreTile, CatIcon } from "./ui";

const POPULAR = ["نون", "أمازون", "نمشي", "آي هيرب", "شحن مجاني", "أول طلب"];

export function SearchBar({ big = false, autoFocus = false, onNavigate }: { big?: boolean; autoFocus?: boolean; onNavigate?: () => void }) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { allStores, allCoupons } = useApp();

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (wrap.current && !wrap.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const res = useMemo(() => {
    if (!q.trim()) return null;
    return {
      stores: allStores.filter((s) => matches(q, s.name, s.en, s.tagline)).slice(0, 4),
      coupons: allCoupons.filter((c) => {
        const st = allStores.find((s) => s.slug === c.store);
        return matches(q, c.title, c.code, c.desc, st?.name);
      }).slice(0, 4),
      deals: deals.filter((d) => {
        const st = allStores.find((s) => s.slug === d.store);
        return matches(q, d.title, d.desc, st?.name);
      }).slice(0, 3),
      cats: categories.filter((c) => matches(q, c.name, c.desc)).slice(0, 3),
    };
  }, [q, allStores, allCoupons]);

  const go = (path: string) => {
    setOpen(false);
    setQ("");
    onNavigate?.();
    navigate(path);
  };

  const submit = () => {
    if (!q.trim()) return;
    go(`/search?q=${encodeURIComponent(q.trim())}`);
  };

  const noneFound = res && res.stores.length + res.coupons.length + res.deals.length + res.cats.length === 0;

  return (
    <div ref={wrap} className="relative w-full">
      <div
        className={`flex items-center gap-2 rounded-xl border bg-white transition-all ${
          big ? "h-14 px-4 shadow-soft focus-within:shadow-lift" : "h-10 px-3"
        } ${open ? "border-brand-500 ring-2 ring-brand-500/20" : "border-ink-200 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20"}`}
      >
        <Search className={`shrink-0 text-ink-400 ${big ? "h-5 w-5" : "h-4 w-4"}`} />
        <input
          value={q}
          autoFocus={autoFocus}
          onChange={(e) => { setQ(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder={big ? "ابحث عن متجر مثل نون، نمشي، أمازون..." : "ابحث عن متجر أو كوبون..."}
          className={`w-full bg-transparent outline-none placeholder:text-ink-400 ${big ? "text-[15px]" : "text-sm"} text-ink-900`}
          aria-label="ابحث عن متجر أو كوبون"
        />
        {q && (
          <button onClick={() => setQ("")} className="text-xs font-bold text-ink-400 hover:text-ink-700">مسح</button>
        )}
        {big && (
          <button
            onClick={submit}
            className="btn-press hidden shrink-0 items-center gap-1.5 rounded-lg bg-brand-950 px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-800 sm:flex"
          >
            ابحث عن كوبون
          </button>
        )}
        {big && (
          <button onClick={submit} aria-label="بحث" className="btn-press shrink-0 rounded-lg bg-brand-950 p-2.5 text-white sm:hidden">
            <ArrowLeft className="h-4 w-4" />
          </button>
        )}
      </div>

      {open && (
        <div className="animate-pop absolute inset-x-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-ink-100 bg-white shadow-lift">
          {!res && (
            <div className="p-3">
              <p className="px-2 pb-2 text-[11px] font-bold text-ink-400">عمليات بحث شائعة</p>
              <div className="flex flex-wrap gap-1.5 px-2">
                {POPULAR.map((p) => (
                  <button key={p} onClick={() => go(`/search?q=${encodeURIComponent(p)}`)} className="chip bg-ink-50 text-ink-600 ring-1 ring-ink-100 transition hover:bg-brand-50 hover:text-brand-800">
                    {p}
                  </button>
                ))}
              </div>
              <p className="px-2 pb-2 pt-3.5 text-[11px] font-bold text-ink-400">متاجر مميزة</p>
              <div className="grid grid-cols-2 gap-1 px-1 sm:grid-cols-3">
                {allStores.filter((s) => s.featured).slice(0, 6).map((s) => (
                  <button key={s.slug} onClick={() => go(`/store/${s.slug}`)} className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-start transition hover:bg-ink-50">
                    <StoreTile store={s} size={28} className="!rounded-lg" />
                    <span className="truncate text-xs font-bold text-ink-800">{s.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {res && noneFound && (
            <div className="p-6 text-center">
              <p className="font-display text-sm font-bold text-ink-800">لا نتائج عن «{q}»</p>
              <p className="mt-1 text-xs text-ink-500">جرّب البحث باسم متجر آخر مثل نون أو نمشي</p>
            </div>
          )}

          {res && !noneFound && (
            <div className="max-h-96 overflow-y-auto py-2">
              {res.stores.length > 0 && (
                <Group label="متاجر">
                  {res.stores.map((s) => (
                    <Item key={s.slug} onClick={() => go(`/store/${s.slug}`)} icon={<StoreTile store={s} size={32} className="!rounded-lg" />} title={s.name} sub={`${allCoupons.filter((c) => c.store === s.slug).length} كوبونات`} />
                  ))}
                </Group>
              )}
              {res.coupons.length > 0 && (
                <Group label="كوبونات">
                  {res.coupons.map((c) => {
                    const st = allStores.find((s) => s.slug === c.store);
                    return <Item key={c.id} onClick={() => go(`/offer/${c.id}`)} icon={<span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-700"><Ticket className="h-4 w-4" /></span>} title={c.title} sub={`${st?.name} • ${c.label}`} />;
                  })}
                </Group>
              )}
              {res.deals.length > 0 && (
                <Group label="عروض بدون كود">
                  {res.deals.map((d) => {
                    const st = allStores.find((s) => s.slug === d.store);
                    return <Item key={d.id} onClick={() => go(`/offer/${d.id}`)} icon={<span className="flex h-8 w-8 items-center justify-center rounded-lg bg-flame-50 text-flame-600"><Flame className="h-4 w-4" /></span>} title={d.title} sub={`${st?.name} • ${d.label}`} />;
                  })}
                </Group>
              )}
              {res.cats.length > 0 && (
                <Group label="تصنيفات">
                  {res.cats.map((c) => (
                    <Item key={c.slug} onClick={() => go(`/category/${c.slug}`)} icon={<span className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ backgroundColor: c.tint, color: c.fg }}><CatIcon icon={c.icon} className="h-4 w-4" /></span>} title={c.name} sub={c.desc} />
                  ))}
                </Group>
              )}
              <button onClick={submit} className="mx-3 mt-1 flex w-[calc(100%-24px)] items-center justify-center gap-2 rounded-lg bg-ink-50 py-2.5 text-xs font-bold text-brand-800 transition hover:bg-brand-50">
                <StoreIcon className="h-3.5 w-3.5" />
                عرض كل النتائج عن «{q}»
                <Tag className="hidden" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="py-1">
      <p className="px-4 py-1 text-[11px] font-bold text-ink-400">{label}</p>
      {children}
    </div>
  );
}

function Item({ icon, title, sub, onClick }: { icon: React.ReactNode; title: string; sub: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex w-full items-center gap-3 px-4 py-2 text-start transition hover:bg-ink-50">
      {icon}
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[13px] font-bold text-ink-900">{title}</span>
        <span className="block truncate text-[11px] text-ink-500">{sub}</span>
      </span>
      <ArrowLeft className="h-3.5 w-3.5 text-ink-300" />
    </button>
  );
}
