import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { coupons as baseCoupons, stores as baseStores, type Coupon, type Store } from "../lib/data";
import { affUrl, copyText, logEvent, makeTid, seedEvents } from "../lib/utils";

type FavKind = "stores" | "coupons" | "deals";
type Toast = { id: number; msg: string; kind: "ok" | "info" | "err" };
type User = { name: string; email: string };
type FavMap = Record<FavKind, string[]>;

function useLS<T>(key: string, init: T) {
  const [v, setV] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : init;
    } catch {
      return init;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(v));
    } catch {
      /* noop */
    }
  }, [key, v]);
  return [v, setV] as const;
}

type Ctx = {
  user: User | null;
  login: (name: string, email: string, isNew?: boolean) => void;
  logout: () => void;
  favs: FavMap;
  isFav: (k: FavKind, id: string) => boolean;
  toggleFav: (k: FavKind, id: string, label?: string) => void;
  votes: Record<string, "up" | "down">;
  vote: (couponId: string, dir: "up" | "down", storeSlug?: string) => void;
  recent: { id: string; at: number }[];
  allCoupons: Coupon[];
  allStores: Store[];
  disabled: string[];
  toggleDisabled: (id: string) => void;
  customCoupons: Coupon[];
  addCoupon: (c: Coupon) => void;
  removeCoupon: (id: string) => void;
  customStores: Store[];
  addStore: (s: Store) => void;
  reviewed: string[];
  markReviewed: (key: string) => void;
  featuredIds: string[];
  toggleFeatured: (id: string) => void;
  toasts: Toast[];
  toast: (msg: string, kind?: Toast["kind"]) => void;
  active: Coupon | null;
  openCoupon: (c: Coupon) => void;
  closeModal: () => void;
};

const AppCtx = createContext<Ctx | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useLS<User | null>("waffir_user", null);
  const [favs, setFavs] = useLS<FavMap>("waffir_favs", { stores: [], coupons: [], deals: [] });
  const [votes, setVotes] = useLS<Record<string, "up" | "down">>("waffir_votes", {});
  const [recent, setRecent] = useLS<{ id: string; at: number }[]>("waffir_recent", []);
  const [disabled, setDisabled] = useLS<string[]>("waffir_disabled", []);
  const [customCoupons, setCustomCoupons] = useLS<Coupon[]>("waffir_custom_coupons", []);
  const [customStores, setCustomStores] = useLS<Store[]>("waffir_custom_stores", []);
  const [reviewed, setReviewed] = useLS<string[]>("waffir_reviewed", []);
  const [featuredExtra, setFeaturedExtra] = useLS<string[]>("waffir_featured", []);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [active, setActive] = useState<Coupon | null>(null);

  useEffect(() => {
    seedEvents();
  }, []);

  const toast = useCallback((msg: string, kind: Toast["kind"] = "ok") => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t.slice(-2), { id, msg, kind }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);

  const login = useCallback(
    (name: string, email: string, isNew = false) => {
      setUser({ name, email });
      if (isNew) {
        try {
          const users = JSON.parse(localStorage.getItem("waffir_users") || "[]") as User[];
          if (!users.some((u) => u.email === email)) {
            users.push({ name, email });
            localStorage.setItem("waffir_users", JSON.stringify(users));
          }
        } catch { /* noop */ }
        logEvent({ type: "signup" });
        toast(`أهلاً بك في وفّر، ${name}`);
      } else {
        toast(`مرحباً بعودتك، ${name}`);
      }
    },
    [setUser, toast]
  );

  const logout = useCallback(() => {
    setUser(null);
    toast("تم تسجيل الخروج", "info");
  }, [setUser, toast]);

  const isFav = useCallback((k: FavKind, id: string) => favs[k].includes(id), [favs]);

  const toggleFav = useCallback(
    (k: FavKind, id: string, label?: string) => {
      setFavs((f) => {
        const has = f[k].includes(id);
        toast(
          has ? `أُزيل ${label || "العنصر"} من المحفوظات` : `حُفظ ${label || "العنصر"} في المفضلة`,
          has ? "info" : "ok"
        );
        return { ...f, [k]: has ? f[k].filter((x) => x !== id) : [...f[k], id] };
      });
    },
    [setFavs, toast]
  );

  const vote = useCallback(
    (couponId: string, dir: "up" | "down", storeSlug?: string) => {
      setVotes((v) => ({ ...v, [couponId]: dir }));
      logEvent({ type: dir === "up" ? "vote_up" : "vote_down", coupon: couponId, store: storeSlug });
      toast(dir === "up" ? "شكراً! سيساعد تقييمك بقية المتسوقين" : "شكراً! سنعيد فحص الكود خلال ساعات", dir === "up" ? "ok" : "info");
    },
    [setVotes, toast]
  );

  const pushRecent = useCallback(
    (id: string) => {
      setRecent((r) => [{ id, at: Date.now() }, ...r.filter((x) => x.id !== id)].slice(0, 12));
    },
    [setRecent]
  );

const openCoupon = useCallback(
  async (c: Coupon) => {
    const store = allStoresRef.current.find((s) => s.slug === c.store);
    const tid = makeTid();

    logEvent({
      type: "reveal",
      store: c.store,
      coupon: c.id,
      tid,
    });

    pushRecent(c.id);

    if (c.code) {
      const ok = await copyText(c.code);

      toast(
        ok ? "تم نسخ الكود بنجاح" : "يمكنك نسخ الكود من النافذة",
        ok ? "ok" : "info"
      );
    } else {
      toast("العرض متاح الآن", "info");
    }

    setActive(c);

    if (store) {
      const destinationUrl =
        c.affiliate_url ||
        store.affiliate_url ||
        store.url;

      const finalUrl =
        c.affiliate_url || store.affiliate_url
          ? destinationUrl
          : affUrl(destinationUrl, tid);

      window.open(finalUrl, "_blank", "noopener,noreferrer");
    }
  },
  [pushRecent, toast]
);
  
  /* keep a ref of stores to avoid circular deps */
  const allStores = useMemo(() => [...baseStores, ...customStores], [customStores]);
  const allStoresRef = useMemo(() => ({ current: allStores }), [allStores]);

  const allCoupons = useMemo(
    () => [...customCoupons, ...baseCoupons].filter((c) => !disabled.includes(c.id)),
    [customCoupons, disabled]
  );

  const allCouponsWithFeatured = useMemo(
    () => allCoupons.map((c) => ({ ...c, featured: c.featured || featuredExtra.includes(c.id) })),
    [allCoupons, featuredExtra]
  );

  const toggleDisabled = useCallback(
    (id: string) => {
      setDisabled((d) => (d.includes(id) ? d.filter((x) => x !== id) : [...d, id]));
    },
    [setDisabled]
  );

  const addCoupon = useCallback(
    (c: Coupon) => {
      setCustomCoupons((cs) => [c, ...cs]);
      toast("تمت إضافة الكوبون ونشره في الموقع");
    },
    [setCustomCoupons, toast]
  );

  const removeCoupon = useCallback(
    (id: string) => {
      setCustomCoupons((cs) => cs.filter((c) => c.id !== id));
      setDisabled((d) => d.filter((x) => x !== id));
      toast("تم حذف الكوبون", "info");
    },
    [setCustomCoupons, setDisabled, toast]
  );

  const addStore = useCallback(
    (s: Store) => {
      setCustomStores((cs) => [s, ...cs]);
      toast("تمت إضافة المتجر بنجاح");
    },
    [setCustomStores, toast]
  );

  const markReviewed = useCallback(
    (key: string) => setReviewed((r) => (r.includes(key) ? r : [...r, key])),
    [setReviewed]
  );

  const toggleFeatured = useCallback(
    (id: string) => setFeaturedExtra((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id])),
    [setFeaturedExtra]
  );

  const closeModal = useCallback(() => setActive(null), []);

  const value: Ctx = {
    user, login, logout, favs, isFav, toggleFav, votes, vote, recent,
    allCoupons: allCouponsWithFeatured, allStores, disabled, toggleDisabled,
    customCoupons, addCoupon, removeCoupon, customStores, addStore,
    reviewed, markReviewed, featuredIds: featuredExtra, toggleFeatured,
    toasts, toast, active, openCoupon, closeModal,
  };

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function useApp() {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
