"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createAdminClient } from '@/utils/supabase/client';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Initialize our bulletproof browser admin client
  const supabase = createAdminClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Send credentials to Supabase
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("Invalid email or password. Please try again.");
      setIsLoading(false);
      return;
    }

    // Success! Force a hard redirect so the server instantly reads the new cookie
    // This perfectly bypasses the Next.js/Chrome race condition
    window.location.href = '/admin';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">

      {/* Icon & Headers */}
      <div className="text-center mb-8">
        <div className="bg-blue-600 text-white w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
            <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" />
          </svg>
        </div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Admin Portal</h1>
        <p className="text-gray-500">Sign in to access the SK Store command center.</p>
      </div>

      {/* Login Card */}
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-sm border border-gray-100">
        <form onSubmit={handleLogin} className="space-y-6">

          {/* Error Message  */}
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium border border-red-100 text-center">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Email address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all text-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all text-gray-900"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors disabled:bg-blue-400 active:scale-95 flex justify-center items-center h-12"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              "Sign in"
            )}
          </button>
        </form>
      </div>

      {/* Back to store link */}
      <div className="mt-8 text-center">
        <button
          onClick={() => router.push('/')}
          className="text-gray-500 hover:text-gray-900 font-medium transition-colors text-sm"
        >
          &larr; Back to Store
        </button>
      </div>

    </div>
  );
}