/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useRouter, Link } from './Router';
import { Camera, Shield, Menu, X, ArrowUpRight } from 'lucide-react';
import { SiteSettings } from '../types';

interface NavigationProps {
  settings: SiteSettings;
  onBookClick: () => void;
}

export default function Navigation({ settings, onBookClick }: NavigationProps) {
  const { currentPath } = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const accentColorClass = settings.branding.accentColor === 'emerald' ? 'text-emerald-400' 
    : settings.branding.accentColor === 'sky' ? 'text-sky-400'
    : settings.branding.accentColor === 'rose' ? 'text-rose-400'
    : settings.branding.accentColor === 'purple' ? 'text-purple-400'
    : 'text-amber-400'; // Default gold

  const accentBgClass = settings.branding.accentColor === 'emerald' ? 'bg-emerald-500 hover:bg-emerald-600' 
    : settings.branding.accentColor === 'sky' ? 'bg-sky-500 hover:bg-sky-600'
    : settings.branding.accentColor === 'rose' ? 'bg-rose-500 hover:bg-rose-600'
    : settings.branding.accentColor === 'purple' ? 'bg-purple-500 hover:bg-purple-600'
    : 'bg-amber-500 hover:bg-amber-600'; // Default gold

  const accentBorderClass = settings.branding.accentColor === 'emerald' ? 'border-emerald-500/20 hover:border-emerald-500' 
    : settings.branding.accentColor === 'sky' ? 'border-sky-500/20 hover:border-sky-500'
    : settings.branding.accentColor === 'rose' ? 'border-rose-500/20 hover:border-rose-500'
    : settings.branding.accentColor === 'purple' ? 'border-purple-500/20 hover:border-purple-500'
    : 'border-amber-500/20 hover:border-amber-500'; // Default gold

  const navLinks = [
    { label: 'Portfolio', anchor: '#portfolio' },
    { label: 'Services', anchor: '#services' },
    { label: 'Promotions', anchor: '#promotions' },
    { label: 'Creative Blog', anchor: '#blog' },
    { label: 'About', anchor: '#about' },
    { label: 'Contact', anchor: '#contact' },
  ];

  const handleNavClick = (anchor: string) => {
    setMobileOpen(false);
    const element = document.querySelector(anchor);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
      scrolled 
        ? 'bg-neutral-950/90 backdrop-blur-md border-b border-neutral-900 py-3' 
        : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo Brand */}
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2">
              <Camera className={`w-6 h-6 ${accentColorClass}`} />
              <span className="text-xl font-bold tracking-widest text-white font-sans">
                {settings.branding.logoText}
              </span>
            </Link>
          </div>

          {/* Desktop Nav Actions */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.anchor)}
                className="text-sm font-medium text-neutral-400 hover:text-white hover:tracking-wide transition-all font-sans cursor-pointer"
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={onBookClick}
              className={`px-4 py-2 border rounded-full text-xs font-semibold tracking-wider uppercase bg-neutral-900/50 hover:bg-neutral-950 text-white transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${accentBorderClass}`}
            >
              Book Shoot <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
            <Link
              to="/admin"
              className="p-2 rounded-full border border-neutral-900 hover:border-neutral-800 text-neutral-400 hover:text-white transition-colors bg-neutral-900/10"
              title="Admin Portal Gate"
            >
              <Shield className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile hamburger */}
          <div className="md:hidden flex items-center gap-3">
            <Link
              to="/admin"
              className="p-1.5 rounded-full border border-neutral-900 text-neutral-400"
            >
              <Shield className="w-4 h-4" />
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="text-neutral-400 hover:text-white p-1"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileOpen && (
        <div className="md:hidden bg-neutral-950 border-b border-neutral-900 py-4 px-4 space-y-4">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.anchor)}
                className="text-left py-2 px-3 rounded-lg text-sm font-medium text-neutral-400 hover:text-white hover:bg-neutral-900 transition-all cursor-pointer"
              >
                {link.label}
              </button>
            ))}
          </div>
          <div className="pt-2 border-t border-neutral-900 flex flex-col gap-3">
            <button
              onClick={() => { setMobileOpen(false); onBookClick(); }}
              className={`w-full py-2.5 rounded-lg text-center text-xs font-semibold tracking-widest uppercase text-white transition-colors cursor-pointer ${accentBgClass}`}
            >
              Secure a Shoot
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
