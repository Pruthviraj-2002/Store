"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  EyeIcon, 
  EyeSlashIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ArrowRightIcon,
  EnvelopeIcon,
  LockClosedIcon,
  UserIcon,
  ShieldCheckIcon,
  CpuChipIcon,
  TruckIcon
} from '@heroicons/react/24/outline';
import { supabaseBrowser } from '@/lib/supabase';
import { useStore } from '@/store/useStore';

// --- Custom Floating Input Component ---
const FloatingInput = ({ 
  label, type, name, value, onChange, icon: Icon, required = false, isPassword = false, onTogglePassword, showPassword 
}: any) => {
  const [isFocused, setIsFocused] = useState(false);
  const isActive = isFocused || value.length > 0;

  return (
    <div className="relative group">
      <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-300 ${isActive ? 'text-blue-600' : 'text-gray-400'}`}>
        <Icon className="h-5 w-5" />
      </div>
      <label 
        className={`absolute left-11 transition-all duration-300 pointer-events-none z-10 font-medium ${
          isActive 
            ? 'top-2 text-[10px] text-blue-600 uppercase tracking-wider' 
            : 'top-1/2 -translate-y-1/2 text-sm text-gray-400'
        }`}
      >
        {label}
      </label>
      <input 
        type={isPassword ? (showPassword ? 'text' : 'password') : type}
        name={name}
        required={required}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="w-full bg-white border-2 border-gray-100 rounded-xl pl-11 pr-12 pt-6 pb-2 text-sm outline-none focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all text-gray-900 font-semibold"
      />
      {isPassword && (
        <button 
          type="button"
          onClick={onTogglePassword}
          className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-blue-600 transition-colors"
        >
          {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
        </button>
      )}
    </div>
  );
};

export default function AuthPage() {
  const router = useRouter();
  const { setUser, showToast } = useStore();
  
  // UI States
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Form Data State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setErrorMsg("");
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabaseBrowser) {
      showToast("Supabase is not configured.", "error");
      return;
    }

    if (!isLogin && formData.password !== formData.confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      if (isLogin) {
        const { data, error } = await supabaseBrowser.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
        if (error) throw error;
        
        setUser(data.user);
        setSuccessMsg("Welcome back!");
        setTimeout(() => router.push('/'), 1000);
      } else {
        const { data, error } = await supabaseBrowser.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: { name: formData.name }
          }
        });
        if (error) throw error;
        
        if (!data.session) {
          setSuccessMsg("Account created! Please check your email for the verification link.");
        } else {
          setUser(data.user);
          setSuccessMsg("Account created successfully!");
          setTimeout(() => router.push('/'), 1000);
        }
      }
    } catch (error: any) {
      console.error("Auth Error:", error);
      let msg = "An unexpected error occurred. Please try again.";
      if (typeof error === 'string') msg = error;
      else if (error?.message) msg = error.message;
      setErrorMsg(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setErrorMsg("");
    
    try {
      if (!supabaseBrowser) {
        throw new Error("Supabase client is not initialized");
      }
      
      const { error } = await supabaseBrowser.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });
      if (error) throw error;
    } catch (error: any) {
      console.error("Google Auth Error:", error);
      setErrorMsg(error.message || "An error occurred with Google Sign In.");
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setErrorMsg("");
    setSuccessMsg("");
    setFormData({ name: '', email: '', password: '', confirmPassword: '' });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row font-sans">
      
      {/* --- LEFT SIDE: BRAND STORY & IMAGERY --- */}
      <div className="hidden lg:flex w-1/2 relative bg-gray-900 flex-col justify-between p-12 overflow-hidden">
        
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200" 
            alt="Electronics Engineering" 
            className="w-full h-full object-cover opacity-50 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-gray-900/40" />
        </div>

        {/* Top Header */}
        <div className="relative z-10 flex items-center gap-2">
          <Link href="/" className="text-3xl font-black text-white hover:text-gray-200 transition-colors">
            SK<span className="text-blue-500">.</span>
          </Link>
        </div>

        {/* Story Content */}
        <div className="relative z-10 max-w-lg mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight tracking-tight mb-6">
              Powering India's Hardware Revolution.
            </h1>
            <p className="text-lg text-gray-300 font-medium leading-relaxed mb-10">
              For over a decade, SK Store has been the backbone of innovation, providing millions of authentic, industrial-grade electronic components to engineers, researchers, and makers across the globe.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10 shrink-0">
                  <ShieldCheckIcon className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <h4 className="text-white font-bold">100% Authentic Parts</h4>
                  <p className="text-gray-400 text-sm">Sourced directly from authorized manufacturers.</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10 shrink-0">
                  <CpuChipIcon className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <h4 className="text-white font-bold">Massive Inventory</h4>
                  <p className="text-gray-400 text-sm">Over 500,000 components in stock and ready to ship.</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10 shrink-0">
                  <TruckIcon className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <h4 className="text-white font-bold">Lightning Fast Delivery</h4>
                  <p className="text-gray-400 text-sm">Same-day dispatch for critical project deadlines.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Testimonial */}
        <div className="relative z-10 border-t border-white/10 pt-8 mt-auto">
          <p className="text-gray-300 italic mb-4">"SK Store is the only catalog we trust for our aerospace prototyping. Their quality control and delivery speed are unmatched in the industry."</p>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80" alt="Dr. Robert Chen" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-white font-bold text-sm">Dr. Robert Chen</p>
              <p className="text-gray-400 text-xs uppercase tracking-wider">Lead Hardware Engineer</p>
            </div>
          </div>
        </div>

      </div>

      {/* --- RIGHT SIDE: LOGIN FORM --- */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 sm:p-12 lg:p-20 bg-white">
        
        {/* Mobile Header */}
        <div className="lg:hidden w-full max-w-[440px] mb-8">
          <Link href="/" className="inline-block text-3xl font-black text-gray-900">
            SK<span className="text-blue-600">.</span>
          </Link>
        </div>

        <div className="w-full max-w-[440px]">
          
          <div className="mb-10">
            <motion.h2 
              key={isLogin ? 'loginTitle' : 'signupTitle'}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-3xl font-black text-gray-900 tracking-tight"
            >
              {isLogin ? "Welcome back" : "Create your account"}
            </motion.h2>
            <motion.p 
              key={isLogin ? 'loginDesc' : 'signupDesc'}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-gray-500 text-sm mt-2 font-medium"
            >
              {isLogin ? "Enter your details to securely access your workspace." : "Join over 50,000 engineers and makers today."}
            </motion.p>
          </div>

          {/* Alerts */}
          <AnimatePresence mode="wait">
            {errorMsg && (
              <motion.div 
                initial={{ opacity: 0, height: 0, y: -10 }} 
                animate={{ opacity: 1, height: 'auto', y: 0 }} 
                exit={{ opacity: 0, height: 0, y: -10 }}
                className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-semibold border border-red-100 flex items-center gap-3 mb-6"
              >
                <ExclamationCircleIcon className="h-5 w-5 shrink-0" />
                {errorMsg}
              </motion.div>
            )}
            {successMsg && (
              <motion.div 
                initial={{ opacity: 0, height: 0, y: -10 }} 
                animate={{ opacity: 1, height: 'auto', y: 0 }} 
                exit={{ opacity: 0, height: 0, y: -10 }}
                className="bg-green-50 text-green-700 p-4 rounded-xl text-sm font-semibold border border-green-200 flex items-center gap-3 mb-6"
              >
                <CheckCircleIcon className="h-5 w-5 shrink-0" />
                {successMsg}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleFormSubmit} className="space-y-4">
            
            <AnimatePresence initial={false}>
              {!isLogin && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="pb-1">
                    <FloatingInput 
                      label="Full Name"
                      name="name"
                      type="text"
                      icon={UserIcon}
                      value={formData.name}
                      onChange={handleChange}
                      required={!isLogin}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <FloatingInput 
              label="Email Address"
              name="email"
              type="email"
              icon={EnvelopeIcon}
              value={formData.email}
              onChange={handleChange}
              required
            />

            <div className="relative">
              <FloatingInput 
                label="Password"
                name="password"
                type="password"
                icon={LockClosedIcon}
                value={formData.password}
                onChange={handleChange}
                required
                isPassword
                showPassword={showPassword}
                onTogglePassword={() => setShowPassword(!showPassword)}
              />
              {isLogin && (
                <div className="absolute top-3 right-12 z-20">
                  <button type="button" className="text-[10px] font-bold text-gray-400 hover:text-blue-600 uppercase tracking-wider transition-colors">
                    Forgot?
                  </button>
                </div>
              )}
            </div>

            <AnimatePresence initial={false}>
              {!isLogin && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="pt-1">
                    <FloatingInput 
                      label="Confirm Password"
                      name="confirmPassword"
                      type="password"
                      icon={LockClosedIcon}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required={!isLogin}
                      isPassword
                      showPassword={showPassword}
                      onTogglePassword={() => setShowPassword(!showPassword)}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="pt-4">
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-4 font-bold text-sm transition-all shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed active:scale-[0.98] group"
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
                  <>
                    {isLogin ? "Sign In Securely" : "Create Account"}
                    <ArrowRightIcon className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="h-px bg-gray-100 flex-1"></div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Or continue with</span>
            <div className="h-px bg-gray-100 flex-1"></div>
          </div>

          {/* Google OAuth */}
          <button 
            type="button"
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl py-3.5 flex items-center justify-center gap-3 transition-all font-bold text-sm active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Google
          </button>

          {/* Bottom Toggle */}
          <div className="mt-8 text-center">
            <span className="text-gray-500 text-sm font-medium">
              {isLogin ? "New to SK Store? " : "Already have an account? "}
            </span>
            <button 
              onClick={toggleMode}
              disabled={isLoading}
              className="font-bold text-blue-600 hover:text-blue-800 transition-colors text-sm ml-1"
            >
              {isLogin ? "Create an account" : "Sign in here"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}