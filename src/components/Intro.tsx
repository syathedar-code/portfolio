import { useState, useEffect, useCallback } from "react";
import { motion, useReducedMotion } from "motion/react";

interface LogEntry {
  text: string;
  colorClass: string;
  isCompleted?: boolean;
}

interface IntroProps {
  onComplete: () => void;
}

export default function Intro({ onComplete }: IntroProps) {
  const shouldReduceMotion = useReducedMotion();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [typedName, setTypedName] = useState("");
  const [showStatus, setShowStatus] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);

  // Skip helper
  const handleSkip = useCallback(() => {
    setIsFinishing(true);
    setTimeout(onComplete, 300);
  }, [onComplete]);

  useEffect(() => {
    // If user prefers reduced motion, skip the long sequence and complete immediately or fast-track it.
    if (shouldReduceMotion) {
      onComplete();
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleSkip();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    let isMounted = true;
    const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    const addLog = (text: string, colorClass = "text-text-dim") => {
      if (!isMounted) return;
      setLogs((prev) => [...prev, { text, colorClass }]);
    };

    const runSequence = async () => {
      // Step 1: BIOS Header
      addLog("SYED_BIOS (R) v2.4.6-AppSec", "text-amber font-bold");
      await sleep(100);
      addLog("CPU: AMD EPYC SECURITY ENCLAVE v6", "text-text-faint");
      await sleep(80);
      addLog("RAM: 65,536 MB OK [VERIFYING SHA-256...]", "text-text-faint");
      await sleep(120);
      addLog("--------------------------------------------------", "text-text-faint");
      await sleep(200);

      // Step 2: System checks
      addLog("[ OK ] Initializing Secure Kernel v6.12.5-sys...", "text-teal");
      await sleep(150);
      addLog("[ OK ] Engaging SafeLine WAF network guards...", "text-teal");
      await sleep(130);
      addLog("[ OK ] Establishing virtual SSL/TLS tunnel...", "text-teal");
      await sleep(100);
      addLog("[ OK ] Mounting portfolio databases...", "text-teal");
      await sleep(180);
      addLog("[ OK ] Loading credential store...", "text-teal");
      await sleep(120);
      addLog("[ OK ] Identity verification: SYSTEM_GUEST", "text-teal");
      await sleep(250);
      addLog("[ INFO ] Decryption keys verified.", "text-amber");
      await sleep(300);

      // Step 3: Terminal Session
      addLog("guest@syedsec:~$ decrypt --profile=syed_maaz_athar", "text-text");
      await sleep(350);
      addLog("Access granted. Initializing interactive display...", "text-text-dim");
      await sleep(400);

      // Step 4: Glitch Typing Name
      const nameToType = "Syed Maaz Athar";
      let currentName = "";
      const glyphs = "$%#@!*&^%-+=[]{}|;:<>,.?/";

      for (let i = 0; i < nameToType.length; i++) {
        if (!isMounted) return;

        // Subtle typing glitch effect
        if (Math.random() < 0.35) {
          const randomChar = glyphs[Math.floor(Math.random() * glyphs.length)];
          setTypedName(currentName + randomChar);
          await sleep(35);
        }

        currentName += nameToType[i];
        setTypedName(currentName);
        await sleep(45 + Math.random() * 45);
      }

      await sleep(300);
      if (!isMounted) return;
      setShowStatus(true);

      // Post-sequence buffer
      await sleep(1200);
      if (!isMounted) return;
      setIsFinishing(true);
      await sleep(350);
      onComplete();
    };

    runSequence();

    return () => {
      isMounted = false;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [shouldReduceMotion, onComplete, handleSkip]);

  if (shouldReduceMotion) return null;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={isFinishing ? { opacity: 0 } : { opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="fixed inset-0 z-[9999] flex flex-col justify-between bg-bg p-6 md:p-12 font-mono text-[13px] text-text select-none overflow-hidden"
    >
      {/* Scanlines / CRT Simulation */}
      <div
        className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(11,13,12,0)_50%,rgba(11,13,12,0.35)_50%)] bg-[length:100%_4px] opacity-25 z-50"
        aria-hidden="true"
      />

      {/* Top Header Row */}
      <div className="flex items-center justify-between border-b border-line pb-3 opacity-60">
        <span className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-teal animate-pulse" />
          SECURE_SESSION: ACTIVE
        </span>
        <span>PORTAL v2.4.6</span>
      </div>

      {/* Main Terminal Viewport */}
      <div className="my-auto flex flex-col gap-6 md:gap-10 max-w-[800px] w-full mx-auto justify-center min-h-[400px]">
        {/* Boot Logs */}
        <div className="flex flex-col gap-1 text-left select-none max-h-[160px] md:max-h-[220px] overflow-hidden opacity-50 font-mono text-[11px] leading-relaxed">
          {logs.map((log, index) => (
            <div key={index} className={log.colorClass}>
              {log.text}
            </div>
          ))}
        </div>

        {/* Centerpiece Decrypted Metadata */}
        <div className="border border-line bg-bg-raised p-6 md:p-8 rounded relative overflow-hidden flex flex-col justify-center">
          {/* Decorative Corner Brackets */}
          <div className="absolute top-2 left-2 text-text-faint text-xs">[+]</div>
          <div className="absolute top-2 right-2 text-text-faint text-xs">[+]</div>
          <div className="absolute bottom-2 left-2 text-text-faint text-xs">[+]</div>
          <div className="absolute bottom-2 right-2 text-text-faint text-xs">[+]</div>

          <div className="space-y-4">
            <div className="flex flex-col">
              <span className="text-[10px] text-text-faint uppercase tracking-wider font-bold mb-1">
                Decrypted Security Identity
              </span>
              <div className="flex items-center gap-2">
                <span className="text-teal font-bold">&gt;</span>
                <span className="text-xl md:text-3xl font-semibold tracking-tight text-text text-shadow-glow">
                  {typedName || "\u00A0"}
                  {!showStatus && (
                    <span className="inline-block w-[10px] h-[18px] md:h-[26px] bg-teal ml-1 cursor-blink align-middle" />
                  )}
                </span>
              </div>
            </div>

            {showStatus && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="flex flex-col pt-3 border-t border-line/50"
              >
                <span className="text-[10px] text-text-faint uppercase tracking-wider font-bold mb-1">
                  Access Status
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-amber font-bold">&gt;</span>
                  <span className="text-sm md:text-base text-amber font-bold flex items-center gap-2">
                    PORTFOLIO ONLINE
                    <span className="inline-block w-[8px] h-[14px] bg-amber cursor-blink align-middle" />
                  </span>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Footer / Action Row */}
      <div className="flex items-center justify-between border-t border-line pt-3 text-[11px] text-text-faint">
        <span>PRESS [ESC] OR CLICK</span>
        <button
          onClick={handleSkip}
          className="border border-text-faint/30 px-2.5 py-1 rounded hover:border-amber hover:text-amber transition-colors duration-200"
        >
          SKIP_INTRO_
        </button>
      </div>
    </motion.div>
  );
}
