import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Nav from "./Nav";
import Footer from "./Footer";

export default function Layout() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      } else {
        // Fallback if the element is not yet rendered in the DOM
        const timer = setTimeout(() => {
          const el = document.getElementById(id);
          if (el) {
            el.scrollIntoView({ behavior: "smooth" });
          }
        }, 100);
        return () => clearTimeout(timer);
      }
    } else {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }, [location]);

  return (
    <div className="relative min-h-screen">
      <div className="bg-grid pointer-events-none fixed inset-0 z-0" aria-hidden="true" />
      <div className="relative z-10">
        <Nav />
        <main className="mx-auto max-w-[920px] px-6">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}