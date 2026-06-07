/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useRouter } from './Router';
import { 
  LayoutDashboard, 
  CalendarClock, 
  MessageSquare, 
  Image as ImageIcon, 
  Star, 
  FileText, 
  Settings, 
  LogOut, 
  UserCheck,
  Globe
} from 'lucide-react';
import { UserSession } from '../types';

interface SidebarProps {
  session: UserSession;
  onLogout: () => void;
  pendingBookingsCount: number;
  pendingEnquiriesCount: number;
}

export default function AdminSidebar({ session, onLogout, pendingBookingsCount, pendingEnquiriesCount }: SidebarProps) {
  const { currentPath, navigate } = useRouter();

  const menuItems = [
    {
      label: 'Dashboard',
      path: '/admin/dashboard',
      icon: LayoutDashboard,
      roles: ['Super Admin', 'Content Manager', 'Staff']
    },
    {
      label: 'Bookings',
      path: '/admin/bookings',
      icon: CalendarClock,
      badge: pendingBookingsCount > 0 ? pendingBookingsCount : undefined,
      roles: ['Super Admin', 'Staff']
    },
    {
      label: 'Enquiries',
      path: '/admin/enquiries',
      icon: MessageSquare,
      badge: pendingEnquiriesCount > 0 ? pendingEnquiriesCount : undefined,
      roles: ['Super Admin', 'Staff']
    },
    {
      label: 'Gallery Management',
      path: '/admin/portfolio',
      icon: ImageIcon,
      roles: ['Super Admin', 'Content Manager']
    },
    {
      label: 'Testimonials',
      path: '/admin/testimonials',
      icon: Star,
      roles: ['Super Admin', 'Content Manager']
    },
    {
      label: 'Blog Management',
      path: '/admin/blog',
      icon: FileText,
      roles: ['Super Admin', 'Content Manager']
    },
    {
      label: 'Website Settings',
      path: '/admin/settings',
      icon: Settings,
      roles: ['Super Admin']
    }
  ];

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const isRoleAuthorized = (allowedRoles: string[]) => {
    return allowedRoles.includes(session.role);
  };

  return (
    <aside className="w-64 bg-[#09090b] border-r border-[#27272a] flex flex-col h-full flex-shrink-0 select-none">
      
      {/* Brand Header */}
      <div className="p-6 border-b border-[#27272a] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-black rotate-45"></div>
          </div>
          <span className="font-bold text-lg tracking-tight text-white">EMMYSS CMS</span>
        </div>
        <button
          onClick={() => navigate('/')}
          className="p-1.5 rounded-lg text-[#a1a1aa] hover:text-white hover:bg-[#18181b] transition-colors cursor-pointer"
          title="Return to Public Website"
        >
          <Globe className="w-4 h-4" />
        </button>
      </div>

      {/* User Identity Info card */}
      <div className="px-6 py-4 border-b border-[#27272a] bg-[#18181b]/30">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#27272a] border border-[#27272a] flex items-center justify-center text-white font-semibold text-sm">
            {session.name.slice(0, 2).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-semibold text-white truncate font-sans">{session.name}</h4>
            <div className="flex items-center gap-1 mt-0.5">
              <UserCheck className="w-3 h-3 text-emerald-400" />
              <span className="text-[10px] font-medium text-[#a1a1aa] font-mono tracking-tight uppercase">
                {session.role}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation list */}
      <nav className="flex-1 py-6 px-4 space-y-1.5 overflow-y-auto">
        {menuItems.map((item) => {
          const isAuthorized = isRoleAuthorized(item.roles);
          const isActive = currentPath === item.path;

          if (!isAuthorized) return null;

          return (
            <button
              key={item.label}
              onClick={() => handleNavigate(item.path)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left text-sm font-medium transition-all duration-200 group cursor-pointer ${
                isActive 
                  ? 'bg-rose-500/10 border border-rose-500/20 text-rose-400' 
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900/50 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-4.5 h-4.5" />
                <span className="font-sans text-xs tracking-wide">{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span className="px-1.5 py-0.5 rounded-md text-[10px] font-mono leading-none bg-rose-500 text-white font-semibold">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Log out footer button */}
      <div className="p-4 border-t border-[#27272a]">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-left text-xs font-medium text-neutral-400 hover:text-red-400 hover:bg-red-500/5 transition-all cursor-pointer font-mono uppercase tracking-wider"
        >
          <LogOut className="w-4 h-4" />
          <span>Exit Session</span>
        </button>
      </div>

    </aside>
  );
}
