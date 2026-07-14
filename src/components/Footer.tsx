export default function Footer() {
  // Parse the injected ISO date string safely
  const commitDateObj = new Date(__COMMIT_DATE__);
  
  const commitDate = !isNaN(commitDateObj.getTime())
    ? commitDateObj.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
    : "Recent";

  const commitTime = !isNaN(commitDateObj.getTime())
    ? commitDateObj.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", hour12: true }).toLowerCase()
    : "";

  return (
    <footer className="w-full mt-auto">
      <div className="w-full max-w-7xl mx-auto px-6 md:px-8">
        <div className="w-full border-t border-line my-4" />

        <div className="pb-12 pt-4 font-mono text-xs md:text-sm text-text-dim space-y-4">

          {/* Git Log Output Group */}
          <div className="space-y-1">
            <p>
              <span className="text-amber font-bold">$</span> git log --oneline -1
            </p>
            <p className="pl-4 text-text">
              <span className="text-amber font-bold">{__COMMIT_HASH__}</span> {__COMMIT_MSG__}
            </p>
            <p className="pl-4 text-text-faint text-[13px]">
              Last commit: {commitDate} • {commitTime}
            </p>
          </div>

          {/* Uptime Group */}
          <div className="space-y-1">
            <p>
              <span className="text-amber font-bold">$</span> uptime
            </p>
            <p className="pl-4 text-text">Portfolio uptime: {__UPTIME__}</p>
          </div>

          {/* Copyright block */}
          <div className="text-center text-text-faint text-[11px] pt-2">
            © {new Date().getFullYear()} Built by Syed Maaz Athar
          </div>

        </div>
      </div>
    </footer>
  );
}