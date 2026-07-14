import { useParams, Navigate, Link } from "react-router-dom";
import { motion, useReducedMotion, Variants } from "motion/react";
import { newsletters } from "../lib/newsletters";
import MarkdownRenderer from "../components/MarkdownRenderer";

export default function NewsletterPost() {
  const { slug } = useParams();
  const issue = newsletters.find((n) => n.slug === slug);
  const shouldReduceMotion = useReducedMotion();

  if (!issue) return <Navigate to="/newsletter" replace />;

  const pageVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <motion.article
      initial="hidden"
      animate="visible"
      variants={pageVariants}
      className="py-14 max-w-[680px]"
    >
      {/* Back link */}
      <Link
        to="/newsletter"
        className="mb-8 inline-flex items-center gap-1.5 font-mono text-xs text-text-faint transition-colors duration-200 hover:text-amber"
      >
        <span aria-hidden="true">←</span> all issues
      </Link>

      {/* Issue badge + title */}
      <div className="mt-6 flex flex-wrap items-baseline gap-3">
        {issue.issue && (
          <span className="font-mono text-xs text-text-faint">{issue.issue}</span>
        )}
        <h1 className="font-mono text-2xl font-semibold text-text">
          {issue.title}
        </h1>
      </div>
      <p className="mt-1 mb-8 font-mono text-sm text-text-faint">{issue.date}</p>

      {/* Body */}
      <div className="mt-8">
        <MarkdownRenderer content={issue.content} variant="newsletter" />
      </div>

      {/* Footer nav */}
      <div className="mt-12 border-t border-line pt-6">
        <Link
          to="/newsletter"
          className="inline-flex items-center gap-1.5 font-mono text-xs text-text-faint transition-colors duration-200 hover:text-amber"
        >
          <span aria-hidden="true">←</span> back to all issues
        </Link>
      </div>
    </motion.article>
  );
}