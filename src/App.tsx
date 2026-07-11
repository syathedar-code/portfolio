// src/App.tsx
import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "motion/react";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Intro from "./components/Intro";

export default function App() {
  const [isIntroFinished, setIsIntroFinished] = useState(false);

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
              // Clear any hash so that router layout doesn't automatically trigger scroll on mount
              if (window.location.hash) {
                window.history.replaceState(null, "", window.location.pathname);
              }
              // Scroll to absolute top instantly
              window.scrollTo(0, 0);
            }
            setIsIntroFinished(true);
          }}
        />
      ) : (
        <BrowserRouter key="app">
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
            </Route>
          </Routes>
        </BrowserRouter>
      )}
    </AnimatePresence>
  );
}