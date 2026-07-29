import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface NavLink {
  href: string;
  label: string;
  isHash: boolean;
}

const links: NavLink[] = [
  { href: "/#about", label: "about", isHash: true },
  { href: "/#skills", label: "skills", isHash: true },
  { href: "/#experience", label: "experience", isHash: true },
  { href: "/#projects", label: "projects", isHash: true },
  { href: "/#contact", label: "contact", isHash: true },
  { href: "/blog/", label: "blog", isHash: false },
  { href: "/newsletter/", label: "newsletter", isHash: false },
];

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setIsOpen(false);
  };

  // Handle hash link clicks - only scroll if already on homepage
  const handleHashClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (location.pathname !== "/") {
      // If not on homepage, let the browser navigate normally
      // The target page will handle the hash on mount
      return;
    }
    e.preventDefault();
    const id = href.replace("/#", "");
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsOpen(false);
  };

  return (
    <nav
      aria-label="Section navigation"
      className="sticky top-0 z-50 w-full border-b border-line bg-bg/90 backdrop-blur-sm"
    >
      <div className="w-full max-w-7xl mx-auto px-6 md:px-8 flex h-[52px] items-center justify-between font-mono text-[14px]">
        <Link
          to="/"
          onClick={scrollToTop}
          className="flex items-center gap-2.5 text-text-dim transition-colors hover:text-amber min-w-0"
        >
          <span className="h-2 w-2 rounded-full bg-teal shadow-[0_0_6px_var(--color-teal)] shrink-0" aria-hidden="true" />
          <span className="truncate">syed@portfolio ~ status: online</span>
        </Link>

        {/* Desktop Links */}
        <ul className="hidden gap-5 sm:flex shrink-0">
          {links.map((link) => (
            <li key={link.href} className="before:mr-[3px] before:text-text-faint before:content-['#']">
              {link.isHash ? (
                <a
                  href={link.href}
                  onClick={(e) => handleHashClick(e, link.href)}
                  className="text-text-dim transition-colors hover:text-amber"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  to={link.href}
                  className="text-text-dim transition-colors hover:text-amber"
                >
                  {link.label}
                </Link>
              )}
            </li>
          ))}
        </ul>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex h-8 w-8 items-center justify-center rounded border border-line text-text-dim hover:border-amber hover:text-amber sm:hidden focus:outline-none shrink-0"
          aria-expanded={isOpen}
          aria-label="Toggle navigation menu"
        >
          {isOpen ? <X size={16} /> : <Menu size={16} />}
        </button>
      </div>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden border-t border-line bg-bg-panel sm:hidden"
          >
            <ul className="flex flex-col gap-4 px-6 py-5 font-mono text-[14px]">
              {links.map((link) => (
                <li key={link.href} className="flex items-center before:mr-[6px] before:text-text-faint before:content-['#']">
                  {link.isHash ? (
                    <a
                      href={link.href}
                      onClick={(e) => handleHashClick(e, link.href)}
                      className="text-text-dim transition-colors hover:text-amber block w-full"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      to={link.href}
                      onClick={() => setIsOpen(false)}
                      className="text-text-dim transition-colors hover:text-amber block w-full"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}