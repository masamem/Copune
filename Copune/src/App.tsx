import { useEffect } from "react";
import { HashRouter, Route, Routes, useLocation } from "react-router-dom";
import { AppProvider } from "./state/AppContext";
import { BottomNav, Header } from "./components/Header";
import { Footer, Newsletter } from "./components/Footer";
import { Toasts } from "./components/ui";
import { CouponModal } from "./components/CouponModal";
import { HomePage } from "./pages/Home";
import { StorePage } from "./pages/StorePage";
import { OfferPage } from "./pages/OfferPage";
import { CategoriesPage, CategoryPage, DealsPage, SearchPage, StoresPage } from "./pages/Browse";
import {
  AboutPage, AuthPage, ContactPage, DisclosurePage, FAQPage, FavoritesPage,
  NotFoundPage, PrivacyPage, TermsPage,
} from "./pages/Static";
import { AdminPage } from "./pages/Admin";

function ScrollToTop() {
  const { pathname, search } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname, search]);
  return null;
}

function Shell() {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith("/admin");
  const showNewsletter =
    pathname === "/" ||
    pathname.startsWith("/store/") ||
    pathname.startsWith("/deals") ||
    pathname.startsWith("/categories") ||
    pathname.startsWith("/category/");

  return (
    <div className="flex min-h-screen flex-col">
      {!isAdmin && <Header />}
      <main className={`flex-1 ${!isAdmin ? "pb-16 md:pb-0" : ""}`}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/stores" element={<StoresPage />} />
          <Route path="/store/:slug" element={<StorePage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/category/:slug" element={<CategoryPage />} />
          <Route path="/deals" element={<DealsPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/offer/:id" element={<OfferPage />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/disclosure" element={<DisclosurePage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      {!isAdmin && (
        <>
          <div className="mt-auto">
            {showNewsletter && <div className="pt-4"><Newsletter /></div>}
            <Footer />
          </div>
          <BottomNav />
        </>
      )}
      <CouponModal />
      <Toasts />
    </div>
  );
}

export default function App() {
  return (
    <HashRouter>
      <AppProvider>
        <ScrollToTop />
        <Shell />
      </AppProvider>
    </HashRouter>
  );
}
