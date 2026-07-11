import { motion, useReducedMotion, Variants } from "motion/react";
import { Download } from "lucide-react";
import SectionHeading from "./SectionHeading";
import { contact } from "../data/contact";

export default function Contact() {
  const shouldReduceMotion = useReducedMotion();

  const sectionVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const handleDownload = () => {
    if (typeof window !== "undefined") {
      const win = window as Window & { gtag?: (event: string, action: string, params: Record<string, unknown>) => void };
      if (win.gtag) {
        win.gtag("event", "download", {
          event_category: "document",
          event_label: "Syed_Maaz_Athar_CV.pdf",
          value: 1
        });
      }
    }
  };

  return (
    <motion.section
      id="contact"
      aria-labelledby="contact-heading"
      className="border-t border-line py-14"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={sectionVariants}
    >
      <SectionHeading index="06" command="./contact --reach-out" id="contact-heading" />
      <div className="rounded border border-line bg-bg-panel px-[26px] py-7 font-mono text-sm transition-all duration-200 hover:border-teal/30">
        <div className="mb-2.5 text-text-dim flex items-center gap-2 group">
          <span className="text-teal w-20 transition-colors duration-200 group-hover:text-amber">email</span>
          <a 
            href={`mailto:${contact.email}`} 
            className="border-b border-transparent text-amber hover:border-amber transition-colors duration-200"
          >
            {contact.email}
          </a>
        </div>
        <div className="mb-2.5 text-text-dim flex items-center gap-2 group">
          <span className="text-teal w-20 transition-colors duration-200 group-hover:text-amber">linkedin</span>
          <a
            href={contact.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="border-b border-transparent text-amber hover:border-amber transition-colors duration-200"
          >
            {contact.linkedin.replace("https://", "")}
          </a>
        </div>
        <div className="mb-2.5 text-text-dim flex items-center gap-2 group">
          <span className="text-teal w-20 transition-colors duration-200 group-hover:text-amber">instagram</span>
          <a
            href={contact.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="border-b border-transparent text-amber hover:border-amber transition-colors duration-200"
          >
            {contact.instagram.replace("https://", "").replace("www.", "")}
          </a>
        </div>
        <div className="mb-4 text-text-dim flex items-center gap-2 group">
          <span className="text-teal w-20 transition-colors duration-200 group-hover:text-amber">location</span>
          <span className="text-text-dim transition-colors duration-200 group-hover:text-text">{contact.location}</span>
        </div>
        <div className="mt-5 pt-5 border-t border-line flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <span className="text-text-dim text-xs">Need a copy of my resume?</span>
          <a
            href="/Syed_Maaz_Athar_CV.pdf"
            download="Syed_Maaz_Athar_CV.pdf"
            onClick={handleDownload}
            className="inline-flex items-center justify-center gap-2 rounded-[3px] border border-amber bg-transparent px-4 py-2 font-mono text-xs font-semibold text-amber transition-all duration-200 hover:bg-amber hover:text-bg hover:shadow-[0_0_12px_rgba(242,169,60,0.3)]"
          >
            <Download size={13} />
            download cv
          </a>
        </div>
      </div>
    </motion.section>
  );
}
