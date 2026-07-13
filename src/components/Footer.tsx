import { buildInfo } from "../generated/buildInfo";

export default function Footer() {
  // Pull fields straight from your build script output properties
  const commitHash = buildInfo?.commit || "39b115d";
  const commitMessage = buildInfo?.commitMessage || "chore: upgrade vite to v6 for cloudflare deployment compatibility";
  const commitDate = buildInfo?.commitDate || "13 Jul 2026";
  const commitTime = buildInfo?.commitTime || "7:42 pm";
  const uptime = buildInfo?.uptime || "0 days";

  return (
    <footer className="w-full mt-auto">
      {/* 7xl boundary wrapper keeps everything perfectly aligned with your grid lines */}
      <div className="w-full max-w-7xl mx-auto px-6 md:px-8">
        <div className="w-full border-t border-line my-4" />

        <div className="pb-12 pt-4 font-mono text-xs md:text-sm text-text-dim space-y-4">

          {/* Git Log Output Group */}
          <div className="space-y-1">
            <p>
              <span className="text-amber font-bold">$</span> git log --oneline -1
            </p>
            <p className="pl-4 text-text">
              <span className="text-amber font-bold">{commitHash}</span> {commitMessage}
            </p>
            {/* Renders your en-IN formatted script values side by side */}
            <p className="pl-4 text-text-faint text-[13px]">
              Last commit: {commitDate} • {commitTime}
            </p>
          </div>

          {/* Uptime Group */}
          <div className="space-y-1">
            <p>
              <span className="text-amber font-bold">$</span> uptime
            </p>
            <p className="pl-4 text-text">Portfolio uptime: {uptime}</p>
          </div>
          {/* CHANGED: Modified size to 11px and applied center justification */}
          <div className="text-center text-text-faint text-[11px] pt-2">
            © {new Date().getFullYear()} Built by Syed Maaz Athar
          </div>

        </div>
      </div>
    </footer>
  );
}