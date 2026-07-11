import { motion, useReducedMotion, Variants } from "motion/react";
import SectionHeading from "./SectionHeading";
import { skills } from "../data/skills";

export default function Skills() {
  const shouldReduceMotion = useReducedMotion();

  const sectionVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.6, 
        ease: "easeOut",
        staggerChildren: 0.08
      }
    }
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 12 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  };

  return (
    <motion.section
      id="skills"
      aria-labelledby="skills-heading"
      className="border-t border-line py-14"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={sectionVariants}
    >
      <SectionHeading index="02" command="systemctl status skills" id="skills-heading" />
      <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-3.5">
        {skills.map((group) => (
          <motion.div
            key={group.id}
            variants={cardVariants}
            whileHover={shouldReduceMotion ? {} : { 
              y: -4, 
              borderColor: "rgba(79, 209, 174, 0.4)",
              boxShadow: "0 4px 20px -2px rgba(79, 209, 174, 0.06)",
            }}
            transition={{ duration: 0.2 }}
            className="group rounded border border-line bg-bg-panel px-[18px] py-4 transition-all duration-200 hover:border-teal/30"
          >
            <div className="mb-2.5 flex items-center justify-between">
              <span className="font-mono text-[13.5px] font-semibold text-text transition-colors duration-200 group-hover:text-teal">
                {group.name}
              </span>
              <span className="flex items-center gap-1.5 font-mono text-[11px] text-text-faint">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-teal"></span>
                </span>
                active
              </span>
            </div>
            <ul className="flex flex-wrap gap-1.5">
              {group.items.map((item) => (
                <li
                  key={item}
                  className="rounded-[3px] border border-line bg-bg-raised px-2 py-[3px] font-mono text-xs text-text-dim transition-all duration-200 hover:text-teal hover:border-teal/20"
                >
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
