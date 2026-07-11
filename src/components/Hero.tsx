import { useState, useEffect } from "react";
import { contact } from "../data/contact";

export default function Hero() {
  const [displayedText, setDisplayedText] = useState("");
  const fullName = "Syed Maaz Athar";

  useEffect(() => {
    let currentIndex = 0;
    let timeoutId: ReturnType<typeof setTimeout>;

    const typeNextChar = () => {
      if (currentIndex < fullName.length) {
        currentIndex++;
        setDisplayedText(fullName.substring(0, currentIndex));
        
        // Natural typing speed variation:
        // Base delay around 80ms, with a random offset of +/- 20ms, and a slightly longer pause for spaces
        const char = fullName[currentIndex - 1];
        const isSpace = char === " ";
        const baseDelay = isSpace ? 180 : 80;
        const randomDelay = Math.random() * 40;
        
        timeoutId = setTimeout(typeNextChar, baseDelay + randomDelay);
      }
    };

    // Natural start delay on page load
    timeoutId = setTimeout(typeNextChar, 300);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <section aria-label="Introduction" className="py-16 sm:py-[88px]">
      <div className="mb-4 flex items-center gap-2 font-mono text-sm text-teal">
        <span className="text-amber-dim">$</span> whoami
      </div>
      <h1 
        className="mb-2.5 font-mono text-[clamp(30px,5vw,48px)] font-semibold tracking-tight text-text"
        aria-label="Syed Maaz Athar"
      >
        <span aria-hidden="true">{displayedText}</span>
        <span
          aria-hidden="true"
          className="cursor-blink ml-1 inline-block w-[0.5em] bg-amber align-middle"
        >
          &nbsp;
        </span>
      </h1>
      <div className="mb-5 font-mono text-[15px] text-amber">
        full stack developer — data science — appsec-aware engineer
      </div>
      <p className="mb-7 max-w-[600px] text-[16.5px] text-text-dim">
        CSE 2026 graduate in Bangalore, shipping features on a live pharma simulation platform:
        Node.js APIs, React UI, MySQL schemas, in a team of eight. Off the clock I build and break
        my own security lab — WAF hardening, log analysis, and vulnerability testing on a
        self-managed Kali/Ubuntu setup.
      </p>
      <div className="flex flex-wrap gap-3">
        <a
          href={`mailto:${contact.email}`}
          className="inline-flex items-center gap-2 rounded-[3px] border border-amber bg-amber px-[18px] py-2.5 font-mono text-[13px] font-semibold text-bg transition-colors hover:bg-transparent hover:text-amber"
        >
          contact me
        </a>
      </div>
    </section>
  );
}
