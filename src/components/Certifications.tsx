import { motion, useReducedMotion, Variants } from "motion/react";
import SectionHeading from "./SectionHeading";
import { certifications } from "../data/certifications";

export default function Certifications() {
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

  const rowVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  };

  return (
    <motion.section
      id="certifications"
      aria-labelledby="certifications-heading"
      className="border-t border-line py-14"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={sectionVariants}
    >
      <SectionHeading index="05" command="cat certifications.log" id="certifications-heading" />
      <div className="flex flex-col font-mono text-[13.5px]">
        {certifications.map((cert) => (
          <motion.div
            key={cert.name}
            variants={rowVariants}
            whileHover={shouldReduceMotion ? {} : { x: 4 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="flex justify-between border-b border-line py-2.5 text-text-dim transition-colors duration-200 hover:text-text cursor-default group"
          >
            <span className="text-text-dim group-hover:text-text transition-colors duration-200">
              <span className="text-teal group-hover:text-amber transition-colors duration-200 mr-2">&gt;</span>
              {cert.name} — {cert.issuer}
            </span>
            <span className="text-text-faint group-hover:text-text-dim transition-colors duration-200">{cert.date}</span>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
