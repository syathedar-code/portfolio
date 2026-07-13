// import { motion, useReducedMotion, Variants } from "motion/react";
// import SectionHeading from "./SectionHeading";
// import { certifications } from "../data/certifications";

// export default function Certifications() {
//   const shouldReduceMotion = useReducedMotion();

//   const sectionVariants: Variants = {
//     hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: { 
//         duration: 0.6, 
//         ease: "easeOut",
//         staggerChildren: 0.08
//       }
//     }
//   };

//   const rowVariants: Variants = {
//     hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 10 },
//     visible: { 
//       opacity: 1, 
//       y: 0,
//       transition: { duration: 0.4, ease: "easeOut" }
//     }
//   };

//   return (
//     <motion.section
//       id="certifications"
//       aria-labelledby="certifications-heading"
//       className="border-t border-line py-14"
//       initial="hidden"
//       whileInView="visible"
//       viewport={{ once: true, margin: "-100px" }}
//       variants={sectionVariants}
//     >
//       <SectionHeading index="05" command="cat certifications.log" id="certifications-heading" />
//       <div className="flex flex-col font-mono text-[13.5px]">
//         {certifications.map((cert) => (
//           <motion.div
//             key={cert.name}
//             variants={rowVariants}
//             whileHover={shouldReduceMotion ? {} : { x: 4 }}
//             transition={{ type: "spring", stiffness: 400, damping: 30 }}
//             className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-4 border-b border-line py-2.5 text-text-dim transition-colors duration-200 hover:text-text cursor-default group"
//           >
//             <span className="text-text-dim group-hover:text-text transition-colors duration-200">
//               <span className="text-teal group-hover:text-amber transition-colors duration-200 mr-2">&gt;</span>
//               {cert.name} — {cert.issuer}
//             </span>
//             <span className="text-text-faint group-hover:text-text-dim transition-colors duration-200 pl-5 sm:pl-0 text-xs sm:text-[13.5px] whitespace-nowrap">
//               {cert.date}
//             </span>
//           </motion.div>
//         ))}
//       </div>
//     </motion.section>
//   );
// }

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion, Variants } from "motion/react";
import { X, ExternalLink, Download } from "lucide-react";
import SectionHeading from "./SectionHeading";
import { certifications } from "../data/certifications";
import type { Certification } from "../types";

export default function Certifications() {
  const shouldReduceMotion = useReducedMotion();
  const [selectedCert, setSelectedCert] = useState<Certification | null>(null);

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
        {certifications.map((cert) => {
          const isClickable = !!cert.previewUrl;
          return (
            <motion.div
              key={cert.name}
              variants={rowVariants}
              whileHover={shouldReduceMotion ? {} : { x: 4 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              onClick={() => isClickable && setSelectedCert(cert)}
              className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-4 border-b border-line py-2.5 text-text-dim transition-colors duration-200 hover:text-text group ${
                isClickable ? "cursor-pointer" : "cursor-default"
              }`}
            >
              <span className="text-text-dim group-hover:text-text transition-colors duration-200">
                <span className="text-teal group-hover:text-amber transition-colors duration-200 mr-2">&gt;</span>
                {cert.name} — {cert.issuer}
                {isClickable && (
                  <span className="ml-2 text-[10px] text-amber opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    [view]
                  </span>
                )}
              </span>
              <span className="text-text-faint group-hover:text-text-dim transition-colors duration-200 pl-5 sm:pl-0 text-xs sm:text-[13.5px] whitespace-nowrap">
                {cert.date}
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* MODAL SYSTEM OVERLAY */}
      <AnimatePresence>
        {selectedCert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Smooth Dim Backdrop Layer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCert(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Terminal Window Box Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="relative w-full max-w-3xl bg-bg-panel border border-line rounded-xl shadow-2xl overflow-hidden z-10 font-mono"
            >
              {/* Drag Top Header Panel Mockup */}
              <div className="flex items-center justify-between bg-black/40 px-4 py-3 border-b border-line">
                <span className="text-xs text-text-faint">
                  viewing_credential_{selectedCert.id || "info"}.log
                </span>
                <button
                  onClick={() => setSelectedCert(null)}
                  className="text-text-dim hover:text-amber transition-colors focus:outline-none"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Layout Content Grid */}
              <div className="p-6 grid grid-cols-1 md:grid-cols-5 gap-6">
                {/* Embedded Asset Window Screen */}
                <div className="md:col-span-3 border border-line bg-black rounded-lg overflow-hidden flex items-center justify-center min-h-[240px]">
                  <img
                    src={selectedCert.previewUrl}
                    alt={`${selectedCert.name} preview`}
                    className="w-full h-auto object-contain max-h-[400px]"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                      const parent = e.currentTarget.parentElement;
                      if (parent) parent.innerHTML = `<span class="text-xs text-text-faint p-4 text-center">Preview image missing at:<br/>${selectedCert.previewUrl}</span>`;
                    }}
                  />
                </div>

                {/* Right Side Text Attribute Columns */}
                <div className="md:col-span-2 flex flex-col justify-between text-sm space-y-4">
                  <div className="space-y-3">
                    <h2 className="text-amber text-base font-bold">{selectedCert.name}</h2>
                    <div className="space-y-1 text-xs text-text-dim">
                      <p><span className="text-text-faint">Issuer   :</span> {selectedCert.issuer}</p>
                      <p><span className="text-text-faint">Completed:</span> {selectedCert.date}</p>
                      {selectedCert.credentialId && (
                        <p><span className="text-text-faint">ID Token :</span> <code className="bg-black/50 px-1 py-0.5 rounded border border-line/50">{selectedCert.credentialId}</code></p>
                      )}
                    </div>

                    {selectedCert.skills && selectedCert.skills.length > 0 && (
                      <div className="pt-2">
                        <span className="text-xs text-text-faint block mb-1.5">Acquired Competencies:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedCert.skills.map((skill) => (
                            <span key={skill} className="text-[11px] bg-black border border-line px-2 py-0.5 rounded text-text-dim">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions Link Row Buttons footer */}
                  <div className="flex flex-col gap-2 pt-4 border-t border-line text-xs font-semibold">
                    <a
                      href={selectedCert.previewUrl}
                      download
                      className="flex items-center justify-center gap-2 w-full py-2.5 bg-black border border-line text-text rounded hover:border-amber hover:text-amber transition-colors"
                    >
                      Download Document <Download size={14} />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}