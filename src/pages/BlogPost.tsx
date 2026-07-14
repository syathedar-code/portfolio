import { useParams, Navigate } from "react-router-dom";
import { motion, useReducedMotion, Variants } from "motion/react";
import { posts } from "../lib/blogs";
import MarkdownRenderer from "../components/MarkdownRenderer";

export default function BlogPost() {
  const { slug } = useParams();
  const post = posts.find((p) => p.slug === slug);
  const shouldReduceMotion = useReducedMotion();

  if (!post) return <Navigate to="/blog" replace />;

  const pageVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <motion.article
      initial="hidden"
      animate="visible"
      variants={pageVariants}
      className="py-14 max-w-[680px]"
    >
      <h1 className="font-mono text-2xl font-semibold text-text mb-2">{post.title}</h1>
      <p className="text-sm text-text-faint mb-8">{post.date}</p>
      <div className="mt-8">
        <MarkdownRenderer content={post.content} variant="blog" />
      </div>
    </motion.article>
  );
}