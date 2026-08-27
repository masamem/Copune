import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  Baby, Check, CheckCircle2, ChevronDown, ChevronLeft, Cpu, Dumbbell, HeartPulse,
  Info, Plane, Shirt, Sofa, Sparkles, UtensilsCrossed, X, XCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useApp } from "../state/AppContext";
import type { Store } from "../lib/data";

/* ---------- scroll reveal ---------- */
export function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -24px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`rv ${inView ? "in" : ""} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

/* ---------- rating stars ---------- */
export function Stars({ value, className = "" }: { value: number; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-0.5 ${className}`} aria-label={`تقييم ${value} من 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} viewBox="0 0 20 20" className={`h-3.5 w-3.5 ${i <= Math.round(value) ? "text-gold-400" : "text-ink-200"}`} fill="currentColor">
          <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.5 7.7l5.9-.9L10 1.5z" />
        </svg>
      ))}
    </span>
  );
}

/* ---------- breadcrumbs ---------- */
export function Crumbs({ items }: { items: { label: string; to?: string }[] }) {
  return (
    <nav aria-label="مسار التنقل" className="flex flex-wrap items-center gap-1.5 text-xs text-ink-500">
      {items.map((it, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {it.to ? (
            <Link to={it.to} className="hover:text-brand-700 transition-colors">{it.label}</Link>
          ) : (
            <span className="text-ink-800 font-semibold">{it.label}</span>
          )}
          {i < items.length - 1 && <ChevronLeft className="h-3.5 w-3.5 text-ink-300" />}
        </span>
      ))}
    </nav>
  );
}

/* ---------- section heading ---------- */
export function SectionHead({ eyebrow, title, desc, action }: { eyebrow?: string; title: string; desc?: string; action?: ReactNode }) {
  return (
    <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
      <div className="max-w-2xl">
        {eyebrow && (
          <p className="mb-2 flex items-center gap-2 text-xs font-bold tracking-wide text-gold-600">
            <span className="h-px w-6 bg-gold-400 inline-block" />
            {eyebrow}
          </p>
        )}
        <h2 className="text-2xl font-extrabold text-ink-950 sm:text-3xl">{title}</h2>
        {desc && <p className="mt-2 text-sm leading-6 text-ink-500">{desc}</p>}
      </div>
      {action}
    </div>
  );
}

/* ---------- store logo tile ---------- */
export function StoreTile({ store, size = 48, className = "" }: { store: Store; size?: number; className?: string }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-xl font-display font-bold ring-1 ring-black/5 ${className}`}
      style={{ width: size, height: size, backgroundColor: store.color, color: store.fg, fontSize: size * 0.46 }}
      aria-hidden
    >
      {store.mono}
    </span>
  );
}

/* ---------- category icon ---------- */
const CAT_ICONS: Record<string, typeof Shirt> = {
  shirt: Shirt, cpu: Cpu, sparkles: Sparkles, utensils: UtensilsCrossed, plane: Plane,
  sofa: Sofa, baby: Baby, heartpulse: HeartPulse, dumbbell: Dumbbell,
};
export function CatIcon({ icon, className = "" }: { icon: string; className?: string }) {
  const C = CAT_ICONS[icon] || Sparkles;
  return <C className={className} />;
}

/* ---------- accordion ---------- */
export function Acc({ q, children, defaultOpen = false }: { q: string; children: ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="surface overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-start transition hover:bg-ink-50/60"
        aria-expanded={open}
      >
        <span className="font-display text-sm font-bold text-ink-900 sm:text-base">{q}</span>
        <ChevronDown className={`h-4 w-4 shrink-0 text-ink-400 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>
      <div className={`grid transition-all duration-300 ease-out ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
        <div className="overflow-hidden">
          <div className="border-t border-ink-100 px-5 py-4 text-sm leading-7 text-ink-600">{children}</div>
        </div>
      </div>
    </div>
  );
}

/* ---------- empty state ---------- */
export function Empty({ icon, title, desc, action }: { icon: ReactNode; title: string; desc: string; action?: ReactNode }) {
  return (
    <div className="surface flex flex-col items-center gap-3 px-6 py-14 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-ink-50 text-ink-400">{icon}</span>
      <h3 className="font-display text-lg font-bold text-ink-900">{title}</h3>
      <p className="max-w-sm text-sm leading-6 text-ink-500">{desc}</p>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

/* ---------- toasts ---------- */
export function Toasts() {
  const { toasts } = useApp();
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-20 z-[80] flex flex-col items-center gap-2 px-4 md:bottom-6">
      {toasts.map((t) => (
        <div key={t.id} className="animate-slide-up flex items-center gap-2.5 rounded-full bg-ink-950 py-2.5 pe-5 ps-3 text-sm font-semibold text-white shadow-lift">
          {t.kind === "ok" && <CheckCircle2 className="h-4.5 w-4.5 text-jade-400" />}
          {t.kind === "info" && <Info className="h-4.5 w-4.5 text-gold-300" />}
          {t.kind === "err" && <XCircle className="h-4.5 w-4.5 text-flame-400" />}
          <span>{t.msg}</span>
        </div>
      ))}
    </div>
  );
}

/* ---------- modal base ---------- */
export function Modal({ onClose, children, labelledBy }: { onClose: () => void; children: ReactNode; labelledBy?: string }) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", h);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", h);
      document.body.style.overflow = "";
    };
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center p-0 sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-labelledby={labelledBy}>
      <button className="animate-fade absolute inset-0 bg-ink-950/55 backdrop-blur-[3px]" onClick={onClose} aria-label="إغلاق" />
      <div className="animate-pop relative max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-white shadow-lift sm:rounded-2xl">
        <button onClick={onClose} className="absolute end-3.5 top-3.5 z-10 rounded-full bg-ink-50 p-2 text-ink-500 transition hover:bg-ink-100 hover:text-ink-900" aria-label="إغلاق النافذة">
          <X className="h-4 w-4" />
        </button>
        {children}
      </div>
    </div>
  );
}

/* ---------- verified pulse dot ---------- */
export function PulseDot({ className = "bg-jade-500" }: { className?: string }) {
  return (
    <span className="relative inline-flex h-2 w-2">
      <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-60 ${className}`} />
      <span className={`relative inline-flex h-2 w-2 rounded-full ${className}`} />
    </span>
  );
}

/* ---------- check icon used in lists ---------- */
export function Tick() {
  return (
    <span className="mt-0.5 inline-flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full bg-jade-100 text-jade-600">
      <Check className="h-3 w-3" strokeWidth={3} />
    </span>
  );
}
