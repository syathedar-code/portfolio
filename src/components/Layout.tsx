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
    // The outermost wrapper must stay full width (w-full)
    <div className="relative min-h-screen w-full bg-black text-white antialiased">
      {/* Background Matrix Grid spans the absolute viewport */}
      <div className="bg-grid pointer-events-none fixed inset-0 z-0" aria-hidden="true" />

      {/* CRITICAL CHANGE: This structural container is now full width ('w-full').
        This ensures both Nav and Footer background layers can stretch to the viewport edge.
      */}
      <div className="relative z-10 flex flex-col min-h-screen w-full">
        
        {/* Handles its own full-width glass background internally */}
        <Nav />

        {/* Our main contents are safely wrapped inside the 7xl containment grid lines!
        */}
        <main className="w-full max-w-7xl mx-auto px-6 md:px-8 flex-grow pt-8 pb-16">
          <Outlet />
        </main>

        {/* Handles its own full-width layout internal lines and alignment */}
        <Footer />
      </div>
    </div>
  );
}