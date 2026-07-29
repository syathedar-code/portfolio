import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "motion/react";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Newsletter from "./pages/Newsletter";
import NewsletterPost from "./pages/NewsletterPost";
import Intro from "./components/Intro";
import NotFound from './pages/NotFound';

// Component that decides whether to show intro or router
function AppContent() {
  const location = useLocation();
  const [isIntroFinished, setIsIntroFinished] = useState(() => {
    // Skip intro if path starts with /blog or /newsletter
    const path = window.location.pathname;
    return path.startsWith('/blog') || path.startsWith('/newsletter');
  });

  useEffect(() => {
    if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  return (
    <AnimatePresence mode="wait">
      {!isIntroFinished ? (
        <Intro
          key="intro"
          onComplete={() => {
            if (typeof window !== "undefined") {
              if (window.location.hash) {
                window.history.replaceState(null, "", window.location.pathname);
              }
              window.scrollTo(0, 0);
            }
            setIsIntroFinished(true);
          }}
        />
      ) : (
        <Routes location={location} key={location.pathname}>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/newsletter" element={<Newsletter />} />
            <Route path="/newsletter/:slug" element={<NewsletterPost />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      )}
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}