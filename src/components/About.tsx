import { motion, useReducedMotion, Variants } from "motion/react";
import SectionHeading from "./SectionHeading";

const meta: [string, string][] = [
  ["location", "Bangalore, India"],
  ["education", "B.E. CSE, VTU — 2022–2026"],
  ["focus", "full stack dev, applied security"],
  ["status", "open to work"],
];

export default function About() {
  const shouldReduceMotion = useReducedMotion();

  const sectionVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <motion.section
      id="about"
      aria-labelledby="about-heading"
      className="border-t border-line py-14"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={sectionVariants}
    >
      <SectionHeading index="01" command="cat about.txt" id="about-heading" />
      <div className="max-w-[640px] text-[15.5px] text-text-dim">
        <p className="mb-3.5">
          I'm a full stack developer who splits time between building product features and
          testing how they hold up under attack. At Cology Labs I work across the frontend,
          backend, and database layers of a live pharma simulation platform used by pharmacy
          students. Outside of work, I run a home lab where I stand up vulnerable environments on
          purpose — DVWA behind a SafeLine WAF, SSL/TLS from scratch, log-based incident triage —
          to understand both sides of the systems I build.
        </p>
        <p>
          I'm currently looking at roles across development, AppSec, and L1 support — anywhere
          that values someone who can write the feature and reason about how it fails.
        </p>
      </div>
      <dl className="mt-6 grid max-w-[420px] grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 font-mono text-[13px] text-text-faint">
        {meta.map(([key, value]) => (
          <div key={key} className="contents group">
            <dt className="text-teal transition-colors duration-200 group-hover:text-amber">{key}</dt>
            <dd className="transition-colors duration-200 group-hover:text-text">{value}</dd>
          </div>
        ))}
      </dl>
    </motion.section>
  );
}
