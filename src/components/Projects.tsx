import { motion, useReducedMotion, Variants } from "motion/react";
import SectionHeading from "./SectionHeading";
import { projects } from "../data/projects";

export default function Projects() {
  const shouldReduceMotion = useReducedMotion();

  const sectionVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.6, 
        ease: "easeOut",
        staggerChildren: 0.12
      }
    }
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 15 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <motion.section
      id="projects"
      aria-labelledby="projects-heading"
      className="border-t border-line py-14"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={sectionVariants}
    >
      <SectionHeading index="04" command="ls -la projects/" id="projects-heading" />
      <div className="flex flex-col gap-4">
        {projects.map((project) => (
          <motion.article
            key={project.name}
            variants={cardVariants}
            whileHover={shouldReduceMotion ? {} : { 
              y: -4, 
              borderColor: "rgba(242, 169, 60, 0.4)",
              boxShadow: "0 4px 20px -2px rgba(242, 169, 60, 0.05)",
            }}
            transition={{ duration: 0.2 }}
            className="group rounded border border-line bg-bg-panel px-6 py-[22px] transition-all duration-200 hover:border-amber/50"
          >
            <div className="mb-1.5 flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-mono text-[15.5px] font-semibold text-text transition-colors duration-200 group-hover:text-amber">
                {project.name}
              </h3>
              <span className="font-mono text-[11.5px] text-text-faint">{project.period}</span>
            </div>
            <ul className="mt-2.5 flex flex-col gap-2">
              {project.highlights.map((line) => (
                <li key={line} className="relative pl-5 text-[14.5px] text-text-dim transition-colors duration-200 hover:text-text">
                  <span className="absolute left-0 font-mono text-teal">&gt;</span>
                  {line}
                </li>
              ))}
            </ul>
            <div className="mt-3.5 flex flex-wrap gap-1.5">
              {project.tools.map((tool) => (
                <span
                  key={tool}
                  className="rounded-[3px] border border-line bg-bg-raised px-2 py-[3px] font-mono text-[11.5px] text-text-dim transition-colors duration-200 hover:text-amber hover:border-amber/20"
                >
                  {tool}
                </span>
              ))}
            </div>
            {(project.repoUrl || project.liveUrl) && (
              <div className="mt-4 flex gap-4 font-mono text-xs">
                {project.repoUrl && (
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber hover:underline flex items-center gap-1 group/link"
                  >
                    view code <span className="inline-block transition-transform duration-200 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5">↗</span>
                  </a>
                )}
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber hover:underline flex items-center gap-1 group/link"
                  >
                    live demo <span className="inline-block transition-transform duration-200 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5">↗</span>
                  </a>
                )}
              </div>
            )}
          </motion.article>
        ))}
      </div>
    </motion.section>
  );
}
