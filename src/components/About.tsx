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
      {/* Changed command to about.md to dynamically match our styled text highlights */}
      <SectionHeading index="01" command="cat about.md" id="about-heading" />

      <div className="max-w-[640px] text-[14.5px] text-text-dim leading-relaxed space-y-4">
        <p>
          I am a <span className="text-text font-semibold">Full-Stack Developer</span> focused on
          <span className="text-text font-semibold"> Application Security</span> bridging the gap between feature engineering and defensive security.
          My development philosophy is simple: you cannot truly secure a system until you understand
          how to build it, and you cannot safely build a feature until you predict how it will fail.
        </p>

        <p>
          Through active defensive home lab deployments, I translate theoretical vulnerabilities into
          concrete protections. This includes configuring network perimeters via a SafeLine WAF,
          building zero-dependency SSL/TLS pipelines from scratch, and executing log-based incident triage.
          This hands-on research allows me to build applications with resilient guardrails baked directly
          into the codebase.
        </p>

        <p>
          Currently seeking cross-functional engineering, AppSec, or technical operations roles where
          deep systems reasoning and secure development practices are highly valued.
        </p>
      </div>

      {/* Meticulously aligned data list with fixed key width column tracking */}
      <dl className="mt-8 max-w-[460px] space-y-2 font-mono text-[13px] text-text-faint">
        {meta.map(([key, value]) => (
          <div key={key} className="flex group select-none">
            {/* Setting a fixed 24-unit width forces everything on the right side to snap into vertical line alignment */}
            <dt className="w-24 text-teal transition-colors duration-200 group-hover:text-amber shrink-0">
              {key}:
            </dt>
            <dd className="transition-colors duration-200 text-text-dim group-hover:text-text">
              {key === "status" ? (
                <span className="text-amber font-semibold uppercase tracking-wide animate-pulse">
                  {value}
                </span>
              ) : (
                value
              )}
            </dd>
          </div>
        ))}
      </dl>
    </motion.section>
  );
}