import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Database, Brain, ChevronRight } from 'lucide-react';

// --- Types & Interfaces ---
interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  category: string;
  icon: React.ReactNode;
  gradient: string;
  badgeColor: string;
}

interface Contributor {
  name: string;
  role: string;
  initials: string;
}

// --- Mock Data ---
const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "Optimizing Core Web Vitals in E-commerce",
    excerpt: "How we reduced our Time to Interactive by 40% using component lazy loading and optimized asset delivery.",
    date: "Aug 05, 2026",
    author: "Engineering Team",
    category: "PERFORMANCE",
    icon: <Activity className="w-4 h-4 mr-2" />,
    gradient: "from-blue-900/40 to-transparent",
    badgeColor: "text-blue-400 bg-blue-400/10 border-blue-400/20"
  },
  {
    id: 2,
    title: "Migrating to a Headless Architecture",
    excerpt: "The challenges and triumphs of decoupling our frontend from the monolithic backend.",
    date: "Jul 28, 2026",
    author: "Backend Architecture",
    category: "INFRASTRUCTURE",
    icon: <Database className="w-4 h-4 mr-2" />,
    gradient: "from-teal-900/40 to-transparent",
    badgeColor: "text-teal-400 bg-teal-400/10 border-teal-400/20"
  },
  {
    id: 3,
    title: "AI-Powered Personalization: A Deep Dive",
    excerpt: "Leveraging ML to deliver ultra-relevant product recommendations in real-time.",
    date: "Aug 12, 2026",
    author: "Data Science Team",
    category: "ARTIFICIAL INTELLIGENCE",
    icon: <Brain className="w-4 h-4 mr-2" />,
    gradient: "from-purple-900/40 to-transparent",
    badgeColor: "text-purple-400 bg-purple-400/10 border-purple-400/20"
  }
];

const contributors: Contributor[] = [
  { name: "Chief Architect", role: "Lead Architect", initials: "CA" },
  { name: "Lead Performance Engineer", role: "Engineer", initials: "LP" },
  { name: "Data Scientist", role: "Data Scientist", initials: "DS" },
  { name: "Data Scientist", role: "Data Scientist", initials: "DS" },
];

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

export default function TechBlog(): React.JSX.Element {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-200 font-sans selection:bg-blue-500/30">
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 pt-24 pb-20">
        
        {/* Header Section */}
        <div className="text-center mb-20">
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-6xl font-bold tracking-tight mb-6 text-white"
          >
            Engineering at <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Store-MU</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed"
          >
            Insights, architectural decisions, and technical deep-dives from the team building our platform.
          </motion.p>
        </div>

        {/* Blog Post Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
        >
          {blogPosts.map((post) => (
            <motion.article 
              key={post.id} 
              variants={itemVariants}
              className="group relative flex flex-col bg-[#111111] rounded-2xl border border-white/5 overflow-hidden hover:border-white/20 transition-all duration-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.1)]"
            >
              {/* Graphic Placeholder Top Half */}
              <div className={`h-40 w-full bg-gradient-to-b ${post.gradient} flex items-center justify-center opacity-60 group-hover:opacity-100 transition-opacity duration-500`}>
                {/* Image placeholder */}
              </div>

              {/* Content Bottom Half */}
              <div className="p-8 flex-1 flex flex-col z-10 -mt-8 bg-[#111111] rounded-t-2xl">
                <div className="flex items-center justify-between mb-6">
                  <span className={`flex items-center text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full border ${post.badgeColor}`}>
                    {post.icon}
                    {post.category}
                  </span>
                  <span className="text-sm text-gray-500 font-medium">{post.date}</span>
                </div>
                
                <h2 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors duration-300 leading-snug">
                  {post.title}
                </h2>
                
                <p className="text-gray-400 mb-8 flex-1 leading-relaxed">
                  {post.excerpt}
                </p>
                
                <div className="mt-auto pt-6 border-t border-white/5 flex items-center">
                  <span className="text-sm font-medium text-gray-300">
                    By {post.author}
                  </span>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>

        {/* Pagination / Load More */}
        <div className="flex flex-col items-center justify-center space-y-4 mb-24">
          <div className="flex space-x-1 mb-2">
            <span className="w-2 h-2 rounded-full bg-white/20"></span>
            <span className="w-2 h-2 rounded-full bg-white/40"></span>
            <span className="w-2 h-2 rounded-full bg-white/60"></span>
            <span className="w-2 h-2 rounded-full bg-white/80"></span>
          </div>
          <button className="px-6 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium transition-all duration-200">
            Load More
          </button>
          <a href="#" className="text-sm text-gray-500 hover:text-white flex items-center mt-4 transition-colors">
            See all posts <ChevronRight className="w-4 h-4 ml-1" />
          </a>
        </div>

        {/* Contributors Section */}
        <div className="border-t border-white/10 pt-16">
          <h3 className="text-2xl font-bold text-white mb-8">Featured Contributors</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {contributors.map((contributor, idx) => (
              <div key={idx} className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-sm font-bold text-white shadow-inner border border-white/10">
                  {contributor.initials}
                </div>
                <div>
                  <p className="text-white font-medium text-sm">{contributor.name}</p>
                  <p className="text-gray-500 text-xs">{contributor.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}