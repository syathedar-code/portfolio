// import { Link } from "react-router-dom";
// import { motion, useReducedMotion, Variants } from "motion/react";
// import { newsletters } from "../lib/newsletters";
// import { NewsletterForm } from "../components/NewsletterForm"; // Imported form component
// import { SearchFilterList } from "../components/Search";
// export default function Newsletter() {
//   const shouldReduceMotion = useReducedMotion();

//   const pageVariants: Variants = {
//     hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 15 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: { duration: 0.5, ease: "easeOut" },
//     },
//   };

//   const itemVariants: Variants = {
//     hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 10 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: { duration: 0.4, ease: "easeOut" },
//     },
//   };
//   return (
//     <motion.section
//       initial="hidden"
//       animate="visible"
//       variants={pageVariants}
//       className="py-14"
//     >
//       {/* Container for Heading (Left) and Subscribe Form (Right) */}
//       <div className="flex flex-col sm:flex-row justify-between items-start gap-6 mb-10">
//         <div>
//           {/* Header text */}
//           <div className="mb-2 font-mono text-sm text-teal">
//             <span className="text-amber-dim">$</span> cat newsletter/index
//           </div>
//           <h1 className="mb-2 font-mono text-2xl font-semibold text-text">
//             Newsletter
//           </h1>
//           <p className="max-w-[560px] text-[14.5px] text-text-dim">
//             Occasional dispatches on dev, security, and the stuff I'm building or
//             breaking — no fluff, no schedule, just when there's something worth
//             saying.
//           </p>
//         </div>

//         {/* Subscribe Form Container - Pinned to the top right */}
//         <div className="w-full sm:w-auto shrink-0">
//           <NewsletterForm />
//         </div>
//       </div>

//       {newsletters.length === 0 ? (
//         <div className="rounded border border-line bg-bg-panel px-6 py-8 font-mono text-sm text-text-faint">
//           <span className="text-teal mr-2">&gt;</span>
//           First issue is in the works — check back soon.
//         </div>
//       ) : (
//         <motion.div
//           className="flex flex-col"
//           variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
//         >
//           {newsletters.map((issue) => (
//             <motion.div key={issue.slug} variants={itemVariants}>
//               <Link
//                 to={`/newsletter/${issue.slug}`}
//                 className="group flex flex-col gap-1 border-b border-line py-5 transition-colors duration-200 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4"
//               >
//                 {/* Left: issue number + title */}
//                 <div className="flex items-baseline gap-3">
//                   {issue.issue && (
//                     <span className="shrink-0 font-mono text-xs text-text-faint">
//                       {issue.issue}
//                     </span>
//                   )}
//                   <span className="font-mono text-[15px] font-semibold text-text transition-colors duration-200 group-hover:text-amber">
//                     {issue.title}
//                   </span>
//                 </div>
//                 {/* Right: date */}
//                 <span className="shrink-0 font-mono text-xs text-text-faint transition-colors duration-200 group-hover:text-text-dim">
//                   {issue.date}
//                 </span>
//               </Link>
//               {/* Excerpt */}
//               <p className="pb-5 pt-2 text-[14px] text-text-dim transition-colors duration-200 group-hover:text-text">
//                 {issue.excerpt}
//               </p>
//             </motion.div>
//           ))}
//         </motion.div>
//       )}
//     </motion.section>
//   );
// }


import { Link } from "react-router-dom";
import { motion, useReducedMotion, Variants } from "motion/react";
import { newsletters } from "../lib/newsletters";
import { NewsletterForm } from "../components/NewsletterForm";
import SearchFilterList from "../components/Search";

export default function Newsletter() {
  const shouldReduceMotion = useReducedMotion();

  const pageVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={pageVariants}
      className="py-14"
    >
      {/* Container for Heading (Left) and Subscribe Form (Right) */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-6 mb-10">
        <div>
          {/* Header text */}
          <div className="mb-2 font-mono text-sm text-teal">
            <span className="text-amber-dim">$</span> cat newsletter/index
          </div>
          <h1 className="mb-2 font-mono text-2xl font-semibold text-text">
            Newsletter
          </h1>
          <p className="max-w-[560px] text-[14.5px] text-text-dim">
            Occasional dispatches on dev, security, and the stuff I'm building or
            breaking — no fluff, no schedule, just when there's something worth
            saying.
          </p>
        </div>

        {/* Subscribe Form Container */}
        <div className="w-full sm:w-auto shrink-0">
          <NewsletterForm />
        </div>
      </div>

      {newsletters.length === 0 ? (
        <div className="rounded border border-line bg-bg-panel px-6 py-8 font-mono text-sm text-text-faint">
          <span className="text-teal mr-2">&gt;</span>
          First issue is in the works — check back soon.
        </div>
      ) : (
        <SearchFilterList
          items={newsletters}
          searchFields={(issue) => [issue.title, issue.excerpt]}
          sortKeys={{
            getNewestValue: (issue) => issue.date,
            getAlphabeticalValue: (issue) => issue.title,
          }}
          renderItem={(issue) => (
            <motion.div
              variants={itemVariants}
              className="border-b border-line"
            >
              <Link
                to={`/newsletter/${issue.slug}`}
                className="group flex flex-col gap-1 py-5 transition-colors duration-200 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4"
              >
                {/* Left side: issue number + title */}
                <div className="flex items-baseline gap-3">
                  {issue.issue && (
                    <span className="shrink-0 font-mono text-xs text-text-faint">
                      {issue.issue}
                    </span>
                  )}
                  <span className="font-mono text-[15px] font-semibold text-text transition-colors duration-200 group-hover:text-amber">
                    {issue.title}
                  </span>
                </div>
                {/* Right side: date */}
                <span className="shrink-0 font-mono text-xs text-text-faint transition-colors duration-200 group-hover:text-text-dim">
                  {issue.date}
                </span>
              </Link>
              {/* Excerpt description text */}
              <p className="pb-5 pt-2 text-[14px] text-text-dim">
                {issue.excerpt}
              </p>
            </motion.div>
          )}
        />
      )}
    </motion.section>
  );
}