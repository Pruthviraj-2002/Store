"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircleIcon, XCircleIcon, InformationCircleIcon } from '@heroicons/react/24/solid';
import { useStore } from '@/store/useStore';

export default function Toaster() {
  const { toast, hideToast } = useStore();

  return (
    <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
            className={`pointer-events-auto flex items-center gap-3 py-3 px-5 rounded-xl shadow-lg border backdrop-blur-md ${
              toast.type === 'success' 
                ? 'bg-green-50/90 border-green-200 text-green-800' 
                : toast.type === 'error'
                ? 'bg-red-50/90 border-red-200 text-red-800'
                : 'bg-blue-50/90 border-blue-200 text-blue-800'
            }`}
          >
            {toast.type === 'success' && <CheckCircleIcon className="h-6 w-6 text-green-500" />}
            {toast.type === 'error' && <XCircleIcon className="h-6 w-6 text-red-500" />}
            {toast.type === 'info' && <InformationCircleIcon className="h-6 w-6 text-blue-500" />}
            
            <p className="font-bold text-sm tracking-wide">{toast.message}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
