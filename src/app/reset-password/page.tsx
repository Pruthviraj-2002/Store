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
  LockClosedIcon,
  ShieldCheckIcon,
  CpuChipIcon,
  TruckIcon
} from '@heroicons/react/24/outline';
import { supabaseBrowser } from '@/lib/supabase';

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

export default function ResetPasswordPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setErrorMsg("");
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabaseBrowser) {
      setErrorMsg("Supabase is not configured.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }
    
    if (formData.password.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const { error } = await supabaseBrowser.auth.updateUser({
        password: formData.password
      });
      if (error) throw error;
      
      setSuccessMsg("Password updated successfully!");
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (error: any) {
      console.error("Update Error:", error);
      setErrorMsg(error.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
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
            
            <div className="space-y-6 mt-10">
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

      </div>

      {/* --- RIGHT SIDE: FORM --- */}
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
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-3xl font-black text-gray-900 tracking-tight"
            >
              Set new password
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-gray-500 text-sm mt-2 font-medium"
            >
              Please enter your new password below.
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
            
            <FloatingInput 
              label="New Password"
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
            
            <FloatingInput 
              label="Confirm New Password"
              name="confirmPassword"
              type="password"
              icon={LockClosedIcon}
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              isPassword
              showPassword={showPassword}
              onTogglePassword={() => setShowPassword(!showPassword)}
            />

            <div className="pt-4">
              <button 
                type="submit" 
                disabled={isLoading || !formData.password || !formData.confirmPassword}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-4 font-bold text-sm transition-all shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed active:scale-[0.98] group"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating...
                  </>
                ) : (
                  <>
                    Reset Password
                    <ArrowRightIcon className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}
