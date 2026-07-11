import { Link } from "react-router-dom";

const links = [
  { href: "/#about", label: "about" },
  { href: "/#skills", label: "skills" },
  { href: "/#experience", label: "experience" },
  { href: "/#projects", label: "projects" },
  { href: "/#contact", label: "contact" },
];

export default function Nav() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <nav
      aria-label="Section navigation"
      className="sticky top-0 z-50 border-b border-line bg-bg/90 backdrop-blur-sm"
    >
      <div className="mx-auto flex h-[52px] max-w-[920px] items-center justify-between px-6 font-mono text-[13px]">
        <Link
          to="/"
          onClick={scrollToTop}
          className="flex items-center gap-2.5 text-text-dim transition-colors hover:text-amber"
        >
          <span className="h-2 w-2 rounded-full bg-teal shadow-[0_0_6px_var(--color-teal)]" aria-hidden="true" />
          <span>syed@portfolio ~ status: online</span>
        </Link>
        <ul className="hidden gap-5 sm:flex">
          {links.map((link) => (
            <li key={link.href} className="before:mr-[3px] before:text-text-faint before:content-['#']">
              <Link to={link.href} className="text-text-dim transition-colors hover:text-amber">
                {link.label}
              </Link>
            </li>
          ))}
          <li className="before:mr-[3px] before:text-text-faint before:content-['#']">
            <Link to="/blog" className="text-text-dim transition-colors hover:text-amber">
              blog
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}