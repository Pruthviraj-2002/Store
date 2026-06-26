"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ArrowLongRightIcon, 
  EyeIcon, 
  EyeSlashIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

export default function LoginPage() {
  const router = useRouter();
  
  // UI States
  const [isLogin, setIsLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Form Data State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    termsAccepted: false
  });

  // Handle Input Changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Mock Google OAuth
  const handleGoogleSignIn = () => {
    setIsLoading(true);
    // Simulate API delay
    setTimeout(() => {
      setIsLoading(false);
      setSuccessMessage("Google Authentication Successful! Redirecting...");
      setTimeout(() => router.push('/'), 1500);
    }, 1200);
  };

  // Handle Form Submission
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMessage("");

    // Simulate API request (Replace this with your actual NextAuth/Firebase logic)
    setTimeout(() => {
      setIsLoading(false);
      if (isLogin) {
        setSuccessMessage("Welcome back! Redirecting to dashboard...");
      } else {
        setSuccessMessage("Account created successfully! Redirecting...");
      }
      // Redirect after success
      setTimeout(() => router.push('/'), 1500);
    }, 1500);
  };

  // Toggle between Login and Signup (clears form and messages)
  const toggleMode = () => {
    setIsLogin(!isLogin);
    setSuccessMessage("");
    setFormData({ name: '', email: '', username: '', password: '', termsAccepted: false });
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex items-center justify-center p-4 md:p-8 font-sans">
      
      {/* Main Card Container */}
      <div className="bg-white rounded-4xl shadow-2xl flex flex-col md:flex-row w-full max-w-275 p-3 md:p-4 min-h-175 relative overflow-hidden transition-all duration-500">
        
        {/* LEFT SIDE: Image Panel */}
        <div className="relative w-full md:w-5/12 h-62.5 md:h-auto rounded-3xl overflow-hidden shrink-0">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200')] bg-cover bg-center transition-transform duration-1000 hover:scale-105"></div>
          <div className="absolute inset-0 bg-linear-to-t from-[#0f172a] via-[#0f172a]/60 to-transparent"></div>
          
          <div className="absolute inset-0 p-8 flex flex-col justify-between">
            <Link href="/" className="text-white font-black text-2xl tracking-tight z-10 hover:opacity-80 transition-opacity w-fit">
              SK<span className="text-blue-500">.</span>
            </Link>

            <div className="z-10 mt-auto animate-fade-in-up">
              <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-3">
                Powering your next big innovation.
              </h2>
              <p className="text-gray-300 text-sm font-medium">
                India's trusted source for electronic components.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: Form Panel */}
        <div className="w-full md:w-7/12 p-6 md:p-12 flex flex-col relative">
          
          {/* Top Right Toggle */}
          <div className="absolute top-8 right-8 md:top-10 md:right-12 hidden sm:flex items-center gap-2 text-sm z-10">
            <span className="text-gray-500">
              {isLogin ? "Don't have an account?" : "Already a member?"}
            </span>
            <button 
              onClick={toggleMode}
              disabled={isLoading}
              className="font-bold text-[#1a1a2e] hover:text-blue-600 transition-colors flex items-center gap-1 disabled:opacity-50"
            >
              {isLogin ? "Sign up" : "Sign in"}
              <ArrowLongRightIcon className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 flex flex-col justify-center max-w-md w-full mx-auto mt-8 sm:mt-0">
            
            <h1 className="text-3xl font-black text-[#1a1a2e] mb-8 transition-all">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h1>

            {/* Success Message Banner */}
            {successMessage && (
              <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-xl flex items-center gap-3 animate-fade-in">
                <CheckCircleIcon className="h-5 w-5 text-green-600 shrink-0" />
                <p className="text-sm font-bold">{successMessage}</p>
              </div>
            )}

            {/* Google OAuth Button */}
            <button 
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              type="button"
              className="w-full bg-[#1a1a2e] hover:bg-[#2a2a4a] text-white rounded-full py-3.5 px-4 flex items-center justify-center gap-3 transition-all shadow-sm font-medium text-sm mb-6 disabled:opacity-70 disabled:cursor-not-allowed active:scale-[0.98]"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              {isLogin ? "Sign in with Google" : "Sign up with Google"}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px bg-gray-200 flex-1"></div>
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Or using email</span>
              <div className="h-px bg-gray-200 flex-1"></div>
            </div>

            {/* Main Form */}
            <form onSubmit={handleFormSubmit} className="space-y-4">
              
              {/* Dynamic Fields: Name & Username only show on Sign Up */}
              <div className={`space-y-4 overflow-hidden transition-all duration-500 ease-in-out ${isLogin ? 'max-h-0 opacity-0' : 'max-h-50 opacity-100'}`}>
                <div>
                  <label className="block text-xs font-bold text-[#1a1a2e] mb-1.5 ml-1">Name</label>
                  <input 
                    type="text" 
                    name="name"
                    required={!isLogin}
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-[#f4f5f7] border-transparent rounded-xl px-4 py-3.5 text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1a1a2e] mb-1.5 ml-1">Email or Phone no.</label>
                <input 
                  type="text" 
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-[#f4f5f7] border-transparent rounded-xl px-4 py-3.5 text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                />
              </div>

              <div className={`space-y-4 overflow-hidden transition-all duration-500 ease-in-out ${isLogin ? 'max-h-0 opacity-0' : 'max-h-25 opacity-100'}`}>
                <div>
                  <label className="block text-xs font-bold text-[#1a1a2e] mb-1.5 ml-1">Username</label>
                  <input 
                    type="text" 
                    name="username"
                    required={!isLogin}
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full bg-[#f4f5f7] border-transparent rounded-xl px-4 py-3.5 text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-end mb-1.5 ml-1 pr-1">
                  <label className="block text-xs font-bold text-[#1a1a2e]">Password</label>
                  {isLogin && (
                    <button type="button" className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors">
                      Forgot Password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full bg-[#f4f5f7] border-transparent rounded-xl pl-4 pr-12 py-3.5 text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-[#1a1a2e] transition-colors"
                  >
                    {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {!isLogin && (
                <div className="flex items-center gap-2 pt-2 transition-all">
                  <input 
                    type="checkbox" 
                    id="termsAccepted" 
                    name="termsAccepted"
                    checked={formData.termsAccepted}
                    onChange={handleChange}
                    className="w-4 h-4 rounded text-[#1a1a2e] border-gray-300 focus:ring-[#1a1a2e] cursor-pointer" 
                    required 
                  />
                  <label htmlFor="termsAccepted" className="text-xs text-gray-500 cursor-pointer select-none">
                    I agree to all <span className="font-bold text-[#1a1a2e]">terms</span> and <span className="font-bold text-[#1a1a2e]">Privacy Policy</span>
                  </label>
                </div>
              )}

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-[#1a1a2e] hover:bg-[#2a2a4a] text-white rounded-full py-3.5 font-bold text-sm transition-all mt-4 shadow-md flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed active:scale-[0.98]"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  isLogin ? "Log in" : "Sign up"
                )}
              </button>
            </form>

            {/* Mobile Toggle (Visible only on small screens) */}
            <div className="mt-8 text-center sm:hidden">
              <span className="text-gray-500 text-sm">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
              </span>
              <button 
                onClick={toggleMode}
                disabled={isLoading}
                className="font-bold text-[#1a1a2e] hover:text-blue-600 transition-colors text-sm"
              >
                {isLogin ? "Sign up" : "Log in"}
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}