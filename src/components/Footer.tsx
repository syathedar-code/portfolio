export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="py-8 pb-12 text-center font-mono text-xs text-text-faint">
      built by Syed Maaz Athar — last updated {year}
    </footer>
  );
}
