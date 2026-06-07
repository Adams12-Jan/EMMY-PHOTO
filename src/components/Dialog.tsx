/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X } from 'lucide-react';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
}

export default function Dialog({ isOpen, onClose, title, size = 'md', children }: DialogProps) {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-3xl',
    xl: 'max-w-5xl'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-neutral-950/80 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Modal Card */}
      <div 
        className={`relative w-full ${sizeClasses[size]} bg-[#18181b] border border-[#27272a] rounded-xl shadow-2xl overflow-hidden transition-all duration-300 transform scale-100 z-10 flex flex-col max-h-[90vh]`}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#27272a] bg-[#18181b]">
          <h3 className="text-lg font-semibold tracking-tight text-white font-sans">{title}</h3>
          <button 
            type="button" 
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body Scrollable */}
        <div className="p-6 overflow-y-auto flex-1 text-sm text-neutral-300 font-sans">
          {children}
        </div>
      </div>
    </div>
  );
}
