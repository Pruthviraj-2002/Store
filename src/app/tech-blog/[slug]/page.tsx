"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import { 
  ArrowLeft, Clock, User, Calendar, ShoppingCart, 
  Share2, Tag, ChevronRight, Component 
} from "lucide-react";

// Generalized Database Entry
const blogPostsData: Record<string, any> = {
  "components-overview": {
    slug: "components-overview",
    title: "The Ultimate Guide to Electronic Components & Prototyping",
    category: "General Hardware",
    author: "SK Store Engineering",
    publishedAt: "August 25, 2026",
    readTime: "6 min",
    excerpt: "A comprehensive overview of the essential building blocks of electronics, from basic passive components to complex integrated circuits and development modules.",
    featuredItems: [
      { id: "smd-resistor-kit", name: "0805 SMD Resistor Kit (40 Values)", price: "₹450.00", inStock: true },
      { id: "capacitor-kit", name: "Electrolytic Capacitor Bundle", price: "₹320.00", inStock: true },
      { id: "soldering-flux", name: "Soldering Paste Flux 15g", price: "₹85.00", inStock: true },
      { id: "jumper-wires", name: "Connecting Wires & Jumpers", price: "₹150.00", inStock: true },
    ],
    content: [
      "Whether you are prototyping a new IoT device or repairing an industrial control board, understanding your inventory is the first step. Electronic design relies on a vast ecosystem of components working in harmony.",
      "Passive components are the foundation of any circuit. Resistors control the flow of current, while capacitors filter noise and store energy. Having a wide range of values on hand—like 0805 SMD packages or standard through-hole variants—ensures you are never stalled during a build.",
      "Active components, such as Integrated Circuits (ICs), voltage regulators, and transistors, provide the logic and power management. From simple voltage regulators to complex digital-to-analog converters (DACs), these silicon chips act as the brain of your hardware.",
      "Finally, prototyping hardware brings it all together. Utilizing proper terminal blocks, heat shrink tubing, and quality soldering flux guarantees that your breadboard concepts transition smoothly into robust, permanent printed circuit board (PCB) designs."
    ]
  }
};

export default function TechBlogArticlePage() {
  const params = useParams();
  const slug = params?.slug as string;
  
  // Fetch specific post or default to overview if not found (for demonstrations)
  const post = blogPostsData[slug] || blogPostsData["components-overview"]; 

  const [scrollProgress, setScrollProgress] = useState(0);

  // Read Progress Bar Logic
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress((window.scrollY / totalScroll) * 100);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!post) return notFound();

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-200 selection:bg-blue-600 selection:text-white font-sans relative">
      
      {/* Scroll Progress Bar */}
      <div 
        className="fixed top-0 left-0 h-1.5 bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-500 z-50 transition-all duration-150 ease-out"
        style={{ width: `${scrollProgress}%` }}
      />

      <main className="max-w-3xl mx-auto px-5 py-12 sm:py-16">
        
        {/* Navigation Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-slate-400 font-medium mb-10">
          <Link href="/tech-blog" className="hover:text-blue-400 transition-colors flex items-center gap-1.5">
            <ArrowLeft size={16} /> Tech Blog
          </Link>
          <ChevronRight size={14} className="text-slate-600" />
          <span className="text-slate-300 truncate">{post.title}</span>
        </nav>

        {/* Header Section */}
        <header className="space-y-6 mb-12">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Tag size={12} /> {post.category}
            </span>
          </div>
          
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-[1.15]">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-slate-400 border-y border-slate-800/60 py-4">
            <span className="flex items-center gap-2"><User size={16} className="text-slate-500" /> {post.author}</span>
            <span className="flex items-center gap-2"><Calendar size={16} className="text-slate-500" /> {post.publishedAt}</span>
            <span className="flex items-center gap-2"><Clock size={16} className="text-blue-400" /> {post.readTime}</span>
          </div>
        </header>

        {/* Featured Categories / Parts Grid */}
        {post.featuredItems && post.featuredItems.length > 0 && (
          <section className="my-10 p-1 bg-gradient-to-br from-blue-500/20 to-transparent rounded-2xl">
            <div className="bg-[#0f172a] p-6 rounded-xl h-full w-full">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-bold text-white flex items-center gap-2.5">
                  <Component size={20} className="text-blue-400" /> Featured Categories
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {post.featuredItems.map((item: any) => (
                  <div key={item.id} className="group flex items-center justify-between p-3 bg-slate-900 border border-slate-800 hover:border-blue-500/50 rounded-lg transition-colors">
                    <div className="flex-1 pr-3">
                      <p className="text-sm font-semibold text-slate-200 line-clamp-1 group-hover:text-white transition-colors">{item.name}</p>
                      <p className="text-xs text-blue-400 font-medium mt-1">{item.price}</p>
                    </div>
                    <button 
                      onClick={() => alert(`Added ${item.name} to cart`)}
                      className="shrink-0 p-2 bg-blue-600 hover:bg-blue-500 rounded-md transition-all active:scale-95 shadow-lg shadow-blue-900/20"
                    >
                      <ShoppingCart size={16} className="text-white" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Text Content Block */}
        <article className="prose prose-invert prose-lg max-w-none prose-headings:text-white prose-p:text-slate-300 prose-a:text-blue-400 hover:prose-a:text-blue-300 prose-strong:text-white">
          <p className="text-xl font-medium text-slate-200 border-l-4 border-blue-500 pl-5 italic mb-8 bg-slate-900/30 py-3 pr-3 rounded-r-lg">
            {post.excerpt}
          </p>

          {post.content.map((paragraph: string, idx: number) => (
            <p key={idx} className="leading-relaxed mb-6">{paragraph}</p>
          ))}
        </article>
        
        {/* Footer & Share Options */}
        <footer className="mt-16 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex flex-col gap-1 text-sm">
            <span className="text-slate-500">Share this overview</span>
            <div className="flex gap-3">
              <button 
                onClick={() => {
                  if (navigator.share) navigator.share({ title: post.title, url: window.location.href });
                  else { navigator.clipboard.writeText(window.location.href); alert("Link copied!"); }
                }}
                className="flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium transition-colors bg-blue-500/10 px-4 py-2 rounded-lg"
              >
                <Share2 size={16} /> Share Link
              </button>
            </div>
          </div>
        </footer>

      </main>
    </div>
  );
}