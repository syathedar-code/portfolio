// import { Link } from "react-router-dom";
// import { motion, useReducedMotion, Variants } from "motion/react";
// import { posts } from "../lib/posts";
// import { SearchFilterList } from "../components/Search";

// export default function Blog() {
//   const shouldReduceMotion = useReducedMotion();

//   const pageVariants: Variants = {
//     hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 15 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: { duration: 0.5, ease: "easeOut" }
//     }
//   };

//   return (
//     <motion.section
//       initial="hidden"
//       animate="visible"
//       variants={pageVariants}
//       className="py-14"
//     >
//       <h1 className="mb-8 font-mono text-2xl font-semibold text-text">Blog</h1>

//       {posts.length === 0 ? (
//         <p className="font-mono text-sm text-text-faint">
//           Nothing here yet — first post is in the works.
//         </p>
//       ) : (
//         <div className="flex flex-col gap-6">
//           {posts.map((post) => (
//             <Link key={post.slug} to={`/blog/${post.slug}`} className="block group">
//               <h2 className="font-mono text-lg text-text group-hover:text-amber transition-colors duration-200">
//                 {post.title}
//               </h2>
//               <p className="text-sm text-text-faint mt-1">{post.date}</p>
//               <p className="text-text-dim mt-2 group-hover:text-text transition-colors duration-200">{post.excerpt}</p>
//             </Link>
//           ))}
//         </div>
//       )}
//     </motion.section>
//   );
// }


import { Link } from "react-router-dom";
import { posts } from "../lib/posts";
import SearchFilterList from "../components/Search";

export default function Blog() {
  return (
    <section className="py-14">
      <div className="mb-2 font-mono text-sm text-teal">
        <span className="text-amber-dim">$</span> cat blog/index
      </div>
      <h1 className="mb-8 font-mono text-2xl font-semibold text-text">Blog</h1>

      {posts.length === 0 ? (
        <p className="font-mono text-sm text-text-faint">
          Nothing here yet — first post is in the works.
        </p>
      ) : (
        <SearchFilterList
          items={posts}
          searchFields={(post) => [post.title, post.excerpt]}
          sortKeys={{
            getNewestValue: (post) => post.date,
            getAlphabeticalValue: (post) => post.title,
          }}
          renderItem={(post) => (
            <Link
              key={post.slug}
              to={`/blog/${post.slug}`}
              className="block border-b border-line py-5 group"
            >
              <h2 className="font-mono text-[15px] font-semibold text-text transition-colors group-hover:text-amber">
                {post.title}
              </h2>
              <p className="text-xs text-text-faint mt-1">{post.date}</p>
              <p className="text-text-dim text-[14px] mt-2">{post.excerpt}</p>
            </Link>
          )}
        />
      )}
    </section>
  );
}