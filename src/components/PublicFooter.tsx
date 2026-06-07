/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Camera, Mail, Phone, MapPin, ArrowUp, ArrowUpRight } from 'lucide-react';
import { SiteSettings } from '../types';

interface FooterProps {
  settings: SiteSettings;
}

export default function PublicFooter({ settings }: FooterProps) {
  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const accentColorClass = settings.branding.accentColor === 'emerald' ? 'text-emerald-400' 
    : settings.branding.accentColor === 'sky' ? 'text-sky-400'
    : settings.branding.accentColor === 'rose' ? 'text-rose-400'
    : settings.branding.accentColor === 'purple' ? 'text-purple-400'
    : 'text-amber-400';

  const accentBgClass = settings.branding.accentColor === 'emerald' ? 'bg-emerald-500 hover:bg-emerald-600' 
    : settings.branding.accentColor === 'sky' ? 'bg-sky-500 hover:bg-sky-600'
    : settings.branding.accentColor === 'rose' ? 'bg-rose-500 hover:bg-rose-600'
    : settings.branding.accentColor === 'purple' ? 'bg-purple-500 hover:bg-purple-600'
    : 'bg-amber-500 hover:bg-amber-600';

  return (
    <footer className="bg-neutral-950 border-t border-neutral-900 pt-16 pb-8 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Upper Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-12 border-b border-neutral-900">
          
          {/* Brand Intro Column */}
          <div className="col-span-1 md:col-span-4 space-y-6">
            <div className="flex items-center gap-2">
              <Camera className={`w-6 h-6 ${accentColorClass}`} />
              <span className="text-xl font-bold tracking-widest text-white font-sans">
                {settings.branding.logoText}
              </span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed max-w-sm font-sans">
              Award-winning agency specializing in luxury portraiture, cinematic videography, and contemporary brand design. Preserving milestones with immaculate lighting and composition.
            </p>
            
            {/* Social channels */}
            <div className="flex items-center gap-3">
              {Object.entries(settings.business.socials || {}).map(([network, url]) => {
                if (!url) return null;
                return (
                  <a
                    key={network}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full border border-neutral-800 flex items-center justify-center text-xs text-neutral-400 hover:text-white hover:border-neutral-500 transition-colors capitalize font-sans"
                  >
                    {network.charAt(0)}
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick links Grid Column */}
          <div className="col-span-1 md:col-span-4 space-y-4">
            <h4 className="text-xs font-semibold tracking-wider text-white uppercase font-sans">Corporate Coordinates</h4>
            <ul className="space-y-3.5 text-xs text-neutral-400 font-sans">
              <li className="flex items-start gap-3">
                <MapPin className={`w-4 h-4 mt-0.5 shrink-0 ${accentColorClass}`} />
                <span>{settings.business.address || 'Design District, USA'}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className={`w-4 h-4 shrink-0 ${accentColorClass}`} />
                <span>{settings.business.phone || '+1 (555) 000-0000'}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className={`w-4 h-4 shrink-0 ${accentColorClass}`} />
                <span>{settings.business.email || 'info@emmyss.com'}</span>
              </li>
            </ul>
          </div>

          {/* Business Hours Column */}
          <div className="col-span-1 md:col-span-4 space-y-4">
            <h4 className="text-xs font-semibold tracking-wider text-white uppercase font-sans">Operational Hours</h4>
            <div className="space-y-2 text-xs text-neutral-400 font-sans leading-relaxed">
              <div className="flex justify-between border-b border-neutral-900 pb-1">
                <span>Weekdays (Mon - Fri)</span>
                <span className="text-white">09:00 AM - 06:00 PM</span>
              </div>
              <div className="flex justify-between border-b border-neutral-900 pb-1">
                <span>Saturday Sessions</span>
                <span className="text-white">10:00 AM - 04:00 PM</span>
              </div>
              <div className="flex justify-between text-neutral-500">
                <span>Sunday Shoots</span>
                <span>By Appointment Only</span>
              </div>
            </div>
          </div>

        </div>

        {/* Lower copyright row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <p className="text-[10px] text-neutral-500 font-sans">
              &copy; {new Date().getFullYear()} {settings.business.companyName || 'EMMYSS Studio'}. All rights reserved under local licensing regulations.
            </p>
            <p className="text-[9px] text-neutral-600 font-mono mt-1">
              Bespoke CMS Platform engineered gracefully for EMMYSS staff.
            </p>
          </div>

          <button
            onClick={handleScrollTop}
            className="p-2.5 rounded-lg bg-neutral-900/50 border border-neutral-800 hover:border-neutral-600 text-neutral-400 hover:text-white transition-all cursor-pointer flex items-center gap-1.5 text-xs font-mono"
            title="Return to peak"
          >
            <span>TOP</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </footer>
  );
}
