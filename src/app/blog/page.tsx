// pages/company/tech-blog.jsx
import React from 'react';

// Mock data - eventually fetched from an API/CMS
const blogPosts = [
  {
    id: 1,
    title: "Optimizing Core Web Vitals in E-commerce",
    excerpt: "How we reduced our Time to Interactive by 40% using component lazy loading and optimized asset delivery.",
    date: "Aug 05, 2026",
    author: "Engineering Team",
    category: "Performance"
  },
  {
    id: 2,
    title: "Migrating to a Headless Architecture",
    excerpt: "The challenges and triumphs of decoupling our frontend from the monolithic backend.",
    date: "Jul 28, 2026",
    author: "Backend Architecture",
    category: "Infrastructure"
  }
];

export default function TechBlog() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
      <div className="mb-16 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900 mb-6">
          Engineering at Store-MU
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Insights, architectural decisions, and technical deep-dives from the team building our platform.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPosts.map((post) => (
          <article 
            key={post.id} 
            className="group flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden"
          >
            <div className="p-8 flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                  {post.category}
                </span>
                <span className="text-sm text-gray-500">{post.date}</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                {post.title}
              </h2>
              <p className="text-gray-600 mb-6 flex-1">
                {post.excerpt}
              </p>
              <div className="mt-auto pt-6 border-t border-gray-100 flex items-center">
                <span className="text-sm font-medium text-gray-900">
                  By {post.author}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}