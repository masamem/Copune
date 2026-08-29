import { useEffect } from "react";

export const fmt = (n: number) => n.toLocaleString("en-US");

export function norm(s: string) {
  return s
    .toLowerCase()
    .replace(/[أإآ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/[\u064B-\u0652]/g, "")
    .trim();
}

export const matches = (q: string, ...fields: (string | undefined)[]) => {
  const n = norm(q);
  if (!n) return false;
  return fields.some((f) => f && norm(f).includes(n));
};

export async function copyText(t: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(t);
    return true;
  } catch {
    try {
      const ta = document.createElement("textarea");
      ta.value = t;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      ta.remove();
      return ok;
    } catch {
      return false;
    }
  }
}

export function usePageMeta(title: string, desc?: string, jsonld?: object | object[]) {
  const jsonStr = jsonld ? JSON.stringify(jsonld) : "";
  useEffect(() => {
    document.title = title;
    if (desc) {
      let m = document.querySelector('meta[name="description"]');
      if (!m) {
        m = document.createElement("meta");
        m.setAttribute("name", "description");
        document.head.appendChild(m);
      }
      m.setAttribute("content", desc);
    }
    const id = "waffir-jsonld";
    document.getElementById(id)?.remove();
    if (jsonStr) {
      const s = document.createElement("script");
      s.type = "application/ld+json";
      s.id = id;
      s.textContent = jsonStr;
      document.head.appendChild(s);
    }
    return () => {
      document.getElementById(id)?.remove();
    };
  }, [title, desc, jsonStr]);
}

/* ---------------- Tracking: Impression → Reveal → Click → Conversion ---------------- */

export type EvType = "impression" | "reveal" | "click" | "conversion" | "vote_up" | "vote_down" | "subscribe" | "signup";
export type Ev = { t: number; type: EvType; store?: string; coupon?: string; tid?: string; rev?: number };

const EV_KEY = "waffir_events_v1";

export function getEvents(): Ev[] {
  try {
    return JSON.parse(localStorage.getItem(EV_KEY) || "[]") as Ev[];
  } catch {
    return [];
  }
}

export function logEvent(e: Omit<Ev, "t">) {
  try {
    const list = getEvents();
    list.push({ ...e, t: Date.now() });
    localStorage.setItem(EV_KEY, JSON.stringify(list));
  } catch {
    /* storage unavailable */
  }
}

export function makeTid() {
  return "wfr_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

export function affUrl(baseUrl: string, tid: string) {
  const sep = baseUrl.includes("?") ? "&" : "?";
  return `${baseUrl}${sep}utm_source=waffir&utm_medium=affiliate&utm_campaign=coupons&tid=${tid}`;
}

/* dedupe impressions per session */
const seenImpressions = new Set<string>();
export function trackImpressions(items: { id: string; store: string }[]) {
  items.forEach(({ id, store }) => {
    if (seenImpressions.has(id)) return;
    seenImpressions.add(id);
    logEvent({ type: "impression", store, coupon: id });
  });
}

export function seedEvents() {
  try {
    if (localStorage.getItem("waffir_seeded_v1")) return;
    let seed = 20250114;
    const rand = () => {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      return seed / 4294967296;
    };
    const pick = <T,>(arr: T[]): T => arr[Math.floor(rand() * arr.length)];
    const storePool: string[] = [
      ...Array(30).fill("noon"), ...Array(20).fill("amazon"), ...Array(14).fill("namshi"),
      ...Array(9).fill("shein"), ...Array(9).fill("iherb"), ...Array(6).fill("careem"),
      ...Array(5).fill("hungerstation"), ...Array(4).fill("jarir"), ...Array(3).fill("nike"),
    ];
    const couponPool: Record<string, string[]> = {
      noon: ["c-noon-25", "c-noon-70", "c-noon-ship", "c-noon-bank"],
      amazon: ["c-amazon-15", "c-amazon-100"],
      namshi: ["c-namshi-30", "c-namshi-app"],
      shein: ["c-shein-20"], iherb: ["c-iherb-10", "c-iherb-60"], careem: ["c-careem-20"],
      hungerstation: ["c-hs-15"], jarir: ["c-jarir-15"], nike: ["c-nike-25"],
    };
    const evs: Ev[] = [];
    const now = Date.now();
    const DAY = 86400000;
    for (let d = 6; d >= 0; d--) {
      const dayBase = now - d * DAY;
      const weight = 0.75 + ((6 - d) / 6) * 0.5; // growing traffic
      const imps = Math.round((52 + rand() * 26) * weight);
      for (let i = 0; i < imps; i++) {
        const store = pick(storePool);
        const coupon = pick(couponPool[store] || ["c-noon-25"]);
        const t = dayBase - Math.floor(rand() * DAY * 0.9);
        const tid = "wfr_demo" + Math.floor(rand() * 1e8).toString(36);
        evs.push({ t, type: "impression", store, coupon, tid });
        if (rand() < 0.42) {
          evs.push({ t: t + 4000, type: "reveal", store, coupon, tid });
          if (rand() < 0.74) {
            evs.push({ t: t + 9000, type: "click", store, coupon, tid });
            if (rand() < 0.1) {
              evs.push({ t: t + 3600000, type: "conversion", store, coupon, tid, rev: Math.round(6 + rand() * 34) });
            }
          }
        }
        if (rand() < 0.045) {
          evs.push({ t: t + 60000, type: rand() < 0.82 ? "vote_up" : "vote_down", store, coupon, tid });
        }
      }
    }
    localStorage.setItem(EV_KEY, JSON.stringify(evs));
    localStorage.setItem("waffir_seeded_v1", "1");
  } catch {
    /* noop */
  }
}

export type Stats = {
  impressions: number;
  reveals: number;
  clicks: number;
  conversions: number;
  revenue: number;
  ctr: number; // clicks / reveals
  days: { label: string; impressions: number; reveals: number; clicks: number }[];
  topStores: { store: string; clicks: number; reveals: number }[];
  topCoupons: { coupon: string; reveals: number; votesUp: number; votesDown: number }[];
  votes: { key: string; coupon: string; store: string; dir: "up" | "down"; t: number }[];
};

const DAY_NAMES = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];

export function computeStats(): Stats {
  const evs = getEvents();
  const c = (t: EvType) => evs.filter((e) => e.type === t).length;
  const impressions = c("impression");
  const reveals = c("reveal");
  const clicks = c("click");
  const conversions = c("conversion");
  const revenue = evs.reduce((s, e) => s + (e.rev || 0), 0);

  const days: Stats["days"] = [];
  for (let d = 6; d >= 0; d--) {
    const date = new Date(Date.now() - d * 86400000);
    const sameDay = (t: number) => {
      const x = new Date(t);
      return x.getDate() === date.getDate() && x.getMonth() === date.getMonth() && x.getFullYear() === date.getFullYear();
    };
    days.push({
      label: d === 0 ? "اليوم" : DAY_NAMES[date.getDay()],
      impressions: evs.filter((e) => e.type === "impression" && sameDay(e.t)).length,
      reveals: evs.filter((e) => e.type === "reveal" && sameDay(e.t)).length,
      clicks: evs.filter((e) => e.type === "click" && sameDay(e.t)).length,
    });
  }

  const byStore = new Map<string, { clicks: number; reveals: number }>();
  const byCoupon = new Map<string, { reveals: number; votesUp: number; votesDown: number }>();
  evs.forEach((e) => {
    if (e.store) {
      const s = byStore.get(e.store) || { clicks: 0, reveals: 0 };
      if (e.type === "click") s.clicks++;
      if (e.type === "reveal") s.reveals++;
      byStore.set(e.store, s);
    }
    if (e.coupon) {
      const k = byCoupon.get(e.coupon) || { reveals: 0, votesUp: 0, votesDown: 0 };
      if (e.type === "reveal") k.reveals++;
      if (e.type === "vote_up") k.votesUp++;
      if (e.type === "vote_down") k.votesDown++;
      byCoupon.set(e.coupon, k);
    }
  });

  const votes = evs
    .filter((e) => e.type === "vote_up" || e.type === "vote_down")
    .map((e) => ({ key: e.t + "-" + (e.coupon || ""), coupon: e.coupon || "", store: e.store || "", dir: (e.type === "vote_up" ? "up" : "down") as "up" | "down", t: e.t }))
    .sort((a, b) => b.t - a.t);

  return {
    impressions, reveals, clicks, conversions, revenue,
    ctr: reveals ? Math.round((clicks / reveals) * 100) : 0,
    days,
    topStores: [...byStore.entries()].map(([store, v]) => ({ store, ...v })).sort((a, b) => b.clicks - a.clicks).slice(0, 6),
    topCoupons: [...byCoupon.entries()].map(([coupon, v]) => ({ coupon, ...v })).sort((a, b) => b.reveals - a.reveals).slice(0, 6),
    votes,
  };
}
