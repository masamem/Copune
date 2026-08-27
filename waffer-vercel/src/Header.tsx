import { useEffect, useState } from "react";
import { Flame, Home, Menu, Search, Store as StoreIcon, Tag, User, X } from "lucide-react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useApp } from "../state/AppContext";
import { SearchBar } from "./SearchBar";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2.5" aria-label="وفّر — الرئيسية">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-950 shadow-soft">
        <svg viewBox="0 0 32 32" className="h-5.5 w-5.5" aria-hidden>
          <path d="M6 13a3 3 0 0 0 0 6v3a1.5 1.5 0 0 0 1.5 1.5h17A1.5 1.5 0 0 0 26 22v-3a3 3 0 0 1 0-6V9a1.5 1.5 0 0 0-1.5-1.5h-17A1.5 1.5 0 0 0 6 9v4z" fill="#d5a94a" />
          <path d="M18.5 11.5l-5 9" stroke="#101b41" strokeWidth="1.7" strokeLinecap="round" />
          <circle cx="14.5" cy="13.2" r="1.4" fill="#101b41" />
          <circle cx="17.5" cy="18.8" r="1.4" fill="#101b41" />
        </svg>
      </span>
      {!compact && (
        <span className="leading-none">
          <span className="block font-display text-[22px] font-black text-ink-950">
            وفّر<span className="text-gold-500">.</span>
          </span>
          <span className="mt-0.5 hidden text-[10px] font-bold tracking-wide text-ink-400 sm:block">كوبونات السعودية المجرّبة</span>
        </span>
      )}
    </Link>
  );
}

const NAV = [
  { to: "/stores", label: "المتاجر" },
  { to: "/categories", label: "التصنيفات" },
  { to: "/deals?sort=new", label: "أحدث العروض", match: "/deals" },
  { to: "/deals?sort=discount", label: "أقوى الخصومات" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { user } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 10);
    h();
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [location]);

  return (
    <header className={`sticky top-0 z-50 border-b bg-white/92 backdrop-blur-md transition-shadow ${scrolled ? "border-ink-100 shadow-soft" : "border-transparent"}`}>
      <div className="container-x flex h-16 items-center gap-4">
        <Logo />

        <div className="hidden flex-1 justify-center md:flex">
          <div className="w-full max-w-xl">
            <SearchBar />
          </div>
        </div>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="التنقل الرئيسي">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-[13px] font-bold transition ${
                  isActive || (n.match && location.pathname === n.match)
                    ? "bg-brand-50 text-brand-800"
                    : "text-ink-600 hover:bg-ink-50 hover:text-ink-950"
                }`
              }
            >
              {n.label}
            </NavLink>
          ))}
        </nav>

        <div className="ms-auto flex items-center gap-2 md:ms-0">
          {user ? (
            <Link to="/favorites" className="flex items-center gap-2 rounded-full border border-ink-100 bg-ink-50 py-1.5 pe-3.5 ps-1.5 transition hover:border-ink-200">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-950 font-display text-xs font-bold text-gold-300">
                {user.name.slice(0, 1)}
              </span>
              <span className="hidden text-xs font-bold text-ink-800 sm:block">{user.name}</span>
            </Link>
          ) : (
            <Link to="/login" className="btn-press hidden rounded-lg bg-brand-950 px-4 py-2 text-[13px] font-bold text-white hover:bg-brand-800 sm:block">
              تسجيل الدخول
            </Link>
          )}
          <button
            onClick={() => setSearchOpen((s) => !s)}
            className="btn-press rounded-lg border border-ink-100 bg-white p-2.5 text-ink-600 md:hidden"
            aria-label="بحث"
          >
            <Search className="h-4.5 w-4.5" />
          </button>
          <button
            onClick={() => setMenuOpen((m) => !m)}
            className="btn-press rounded-lg border border-ink-100 bg-white p-2.5 text-ink-600 lg:hidden"
            aria-label="القائمة"
          >
            {menuOpen ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
          </button>
        </div>
      </div>

      {searchOpen && (
        <div className="animate-fade container-x pb-3 md:hidden">
          <SearchBar autoFocus onNavigate={() => setSearchOpen(false)} />
        </div>
      )}

      {menuOpen && (
        <div className="animate-fade border-t border-ink-100 bg-white lg:hidden">
          <nav className="container-x grid gap-1 py-3" aria-label="قائمة الجوال">
            {NAV.map((n) => (
              <Link key={n.to} to={n.to} className="flex items-center justify-between rounded-lg px-3 py-3 text-sm font-bold text-ink-800 transition hover:bg-ink-50">
                {n.label}
                <span className="h-1.5 w-1.5 rounded-full bg-gold-400" />
              </Link>
            ))}
            <div className="my-1 border-t border-dashed border-ink-100" />
            {user ? (
              <Link to="/favorites" className="rounded-lg px-3 py-3 text-sm font-bold text-brand-800">حسابي — المحفوظات</Link>
            ) : (
              <button onClick={() => navigate("/login")} className="rounded-lg bg-brand-950 px-3 py-3 text-center text-sm font-bold text-white">
                تسجيل الدخول / إنشاء حساب
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

export function BottomNav() {
  const { user } = useApp();
  const items = [
    { to: "/", label: "الرئيسية", icon: Home },
    { to: "/search", label: "البحث", icon: Search },
    { to: "/stores", label: "المتاجر", icon: StoreIcon },
    { to: "/deals", label: "العروض", icon: Flame },
    { to: user ? "/favorites" : "/login", label: "حسابي", icon: user ? Tag : User },
  ];
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-ink-100 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden" aria-label="التنقل السفلي">
      <div className="grid grid-cols-5">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={label}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `relative flex flex-col items-center gap-0.5 py-2.5 text-[10px] font-bold transition ${isActive ? "text-brand-800" : "text-ink-400"}`
            }
          >
            {({ isActive }) => (
              <>
                <span className={`rounded-full px-3 py-0.5 transition ${isActive ? "bg-brand-50" : ""}`}>
                  <Icon className="h-5 w-5" />
                </span>
                {label}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
