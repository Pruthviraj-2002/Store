"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Clock, Component } from "lucide-react";
import Link from "next/link";

// Generalized Database Entry for the Hub
const blogPosts = [
  {
    id: "components-overview",
    title: "The Ultimate Guide to Electronic Components",
    excerpt: "A comprehensive overview of the essential building blocks of electronics, from basic passive components to complex ICs.",
    category: "General Hardware",
    readTime: "6 min",
    image: "/images/blog/hardware-overview.jpg", // Replace with your actual image path
  }
];

const categories = ["All", "General Hardware", "Tutorials", "Guides"];

export default function TechBlogHub() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredPosts = blogPosts.filter((post) => 
    activeCategory === "All" ? true : post.category === activeCategory
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120 } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } }
  };

  return (
    <div className="min-h-screen bg-[#0B1120] px-4 py-16 font-sans text-slate-100">
      <div className="mx-auto max-w-6xl">
        
        <header className="mb-12 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl"
          >
            SK Store <span className="text-blue-500">Tech Blog</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-400"
          >
            Engineering tutorials, component breakdowns, and hardware guides.
          </motion.p>
        </header>

        <div className="mb-12 flex flex-wrap justify-center gap-3">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
                activeCategory === category
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                  : "bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {filteredPosts.map((post) => (
              <motion.article
                key={post.id}
                layout
                variants={cardVariants}
                initial="hidden"
                animate="show"
                exit="exit"
                whileHover={{ y: -8 }}
                className="group overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm transition-colors hover:border-slate-700 hover:bg-slate-800/80"
              >
                <Link href={`/tech-blog/${post.id}`} className="block h-full w-full">
                  <div className="h-48 w-full bg-slate-800 flex items-center justify-center">
                    <Component size={48} className="text-slate-600 opacity-50" />
                  </div>
                  
                  <div className="p-6">
                    <div className="mb-3 flex items-center justify-between text-xs font-semibold">
                      <span className="text-blue-400">{post.category}</span>
                      <span className="flex items-center gap-1 text-slate-500">
                        <Clock size={14} /> {post.readTime}
                      </span>
                    </div>
                    
                    <h2 className="mb-2 text-xl font-bold text-white transition-colors group-hover:text-blue-400">
                      {post.title}
                    </h2>
                    <p className="mb-6 text-sm text-slate-400 line-clamp-2">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center text-sm font-medium text-blue-500 transition-transform group-hover:translate-x-1">
                      Read Article <ArrowRight size={16} className="ml-2" />
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
        
      </div>
    </div>
  );
}