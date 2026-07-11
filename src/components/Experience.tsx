import { motion, useReducedMotion, Variants } from "motion/react";
import SectionHeading from "./SectionHeading";
import { experience } from "../data/experience";

export default function Experience() {
  const shouldReduceMotion = useReducedMotion();

  const sectionVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.6, 
        ease: "easeOut",
        staggerChildren: 0.1
      }
    }
  };

  const entryVariants: Variants = {
    hidden: { opacity: 0, x: shouldReduceMotion ? 0 : -10 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <motion.section
      id="experience"
      aria-labelledby="experience-heading"
      className="border-t border-line py-14"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={sectionVariants}
    >
      <SectionHeading index="03" command="tail -f experience.log" id="experience-heading" />
      <div className="flex flex-col gap-10">
        {experience.map((entry) => (
          <motion.div
            key={entry.role}
            variants={entryVariants}
            className="group relative border-l border-line pl-[22px] before:absolute before:-left-[5px] before:top-1.5 before:h-[9px] before:w-[9px] before:rounded-full before:bg-amber before:shadow-[0_0_6px_var(--color-amber)] before:content-[''] before:transition-transform before:duration-300 hover:before:scale-125"
          >
            <div className="mb-1 flex flex-wrap items-baseline gap-2.5">
              <span className="font-mono text-base font-semibold text-text transition-colors duration-200 group-hover:text-amber">
                {entry.role}
              </span>
              <span className="font-mono text-xs text-text-faint">{entry.period}</span>
            </div>
            <div className="mb-3.5 text-sm text-amber font-mono font-medium">{entry.org}</div>
            <div className="mb-4 font-mono text-xs text-text-faint">{entry.note}</div>
            <ul className="flex flex-col gap-2.5">
              {entry.highlights.map((line) => (
                <li key={line} className="relative pl-5 text-[14.5px] text-text-dim transition-colors duration-200 hover:text-text">
                  <span className="absolute left-0 font-mono text-teal transition-transform duration-200 group-hover:translate-x-0.5">&gt;</span>
                  {line}
                </li>
              ))}
            </ul>
            <div className="mt-4 font-mono text-xs text-text-faint">
              tools: <span className="text-text-dim transition-colors duration-200 group-hover:text-text">{entry.tools.join(", ")}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
