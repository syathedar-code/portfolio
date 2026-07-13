import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react"; // adjusting icons based on your layout
import { motion, AnimatePresence } from "motion/react";

const links = [
  { href: "/#about", label: "about" },
  { href: "/#skills", label: "skills" },
  { href: "/#experience", label: "experience" },
  { href: "/#projects", label: "projects" },
  { href: "/#contact", label: "contact" },
  { href: "/blog", label: "blog" },
  { href: "/newsletter", label: "newsletter" },
];

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setIsOpen(false);
  };

  return (
    <nav
      aria-label="Section navigation"
      className="sticky top-0 z-50 w-full border-b border-line bg-bg/90 backdrop-blur-sm"
    >
      {/* INNER ALIGNMENT LAYER: Spans beautifully to max-w-7xl matching your content */}
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
              <Link to={link.href} className="text-text-dim transition-colors hover:text-amber">
                {link.label}
              </Link>
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

      {/* Mobile Menu Panel (Requires your motion/react import lines!) */}
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
                  <Link
                    to={link.href}
                    onClick={() => setIsOpen(false)}
                    className="text-text-dim transition-colors hover:text-amber block w-full"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}