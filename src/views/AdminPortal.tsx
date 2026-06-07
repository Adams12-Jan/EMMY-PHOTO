/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useRouter } from '../components/Router';
import AdminSidebar from '../components/AdminSidebar';
import Dialog from '../components/Dialog';
import { 
  Key, 
  User, 
  HelpCircle, 
  Plus, 
  Edit, 
  Trash2, 
  Check, 
  X, 
  Sparkles, 
  ArrowUpDown, 
  Briefcase, 
  TrendingUp, 
  Users, 
  BookOpen, 
  Calendar, 
  Mail, 
  AlertCircle, 
  CheckCircle, 
  FileDown, 
  CornerDownRight, 
  RefreshCw,
  ArrowUp,
  ArrowDown,
  MonitorPlay,
  Settings,
  Eye,
  CheckCircle2,
  Bookmark
} from 'lucide-react';
import { AppDatabase, UserSession, Booking, Enquiry, BlogPost, ServiceItem, PortfolioItem, TestimonialItem, Promotion, EmailLog } from '../types';

interface AdminProps {
  db: AppDatabase;
  onRefreshDb: () => void;
}

export default function AdminPortal({ db, onRefreshDb }: AdminProps) {
  const { currentPath, navigate } = useRouter();

  // Authentication & session management
  const [session, setSession] = useState<UserSession | null>(() => {
    const saved = localStorage.getItem('emmyss_session');
    return saved ? JSON.parse(saved) : null;
  });

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSuccessMsg, setResetSuccessMsg] = useState('');

  // Analytics API stats state
  const [analytics, setAnalytics] = useState<any>(null);
  const [emailLogs, setEmailLogs] = useState<EmailLog[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Active form modals state
  const [activeFormType, setActiveFormType] = useState<'service' | 'portfolio' | 'testimonial' | 'blog' | 'promotion' | null>(null);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  // CRUD Forms individual states
  const [serviceForm, setServiceForm] = useState<Partial<ServiceItem>>({
    name: '', category: 'Photography', description: '', price: '', featured: false, status: 'Active'
  });
  const [portfolioForm, setPortfolioForm] = useState<Partial<PortfolioItem>>({
    title: '', category: 'Portraits', imageUrl: '', description: ''
  });
  const [testimonialForm, setTestimonialForm] = useState<Partial<TestimonialItem>>({
    name: '', position: '', testimonial: '', rating: 5, imageUrl: ''
  });
  const [blogForm, setBlogForm] = useState<Partial<BlogPost>>({
    title: '', excerpt: '', content: '', category: 'Creative', tags: [], status: 'Draft', metaTitle: '', metaDescription: '', keywords: '', bannerUrl: ''
  });
  const [promotionForm, setPromotionForm] = useState<Partial<Promotion>>({
    title: '', description: '', startDate: '', endDate: '', status: 'Active', bannerUrl: ''
  });

  // Image Upload helper states
  const [uploadProgress, setUploadProgress] = useState('');
  const [imageCropPreview, setImageCropPreview] = useState('');

  // AI Assistant states
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiTopic, setAiTopic] = useState('');
  const [aiGenerating, setAiGenerating] = useState(false);

  // Filter & interaction fields
  const [bookingFilter, setBookingFilter] = useState<string>('All');
  const [enquiryFilter, setEnquiryFilter] = useState<string>('All');
  const [replyMessage, setReplyMessage] = useState('');
  const [replyingEnquiryId, setReplyingEnquiryId] = useState<string | null>(null);
  const [assigneeStaff, setAssigneeStaff] = useState('');

  // Fetch metrics & notifications
  const loadStatsAndLogs = async () => {
    if (!session) return;
    setIsRefreshing(true);
    try {
      const runStats = await fetch('/api/analytics');
      const statsJson = await runStats.json();
      setAnalytics(statsJson);

      const runLogs = await fetch('/api/email-logs');
      const logsJson = await runLogs.json();
      setEmailLogs(logsJson);
    } catch (err) {
      console.error('Failed to load metrics:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (session) {
      loadStatsAndLogs();
    }
  }, [session, db]);

  // Auth Submit handler
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!loginEmail || !loginPassword) {
      setLoginError('Complete all credentials.');
      return;
    }

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failure');

      localStorage.setItem('emmyss_session', JSON.stringify(data));
      setSession(data);
      navigate('/admin/dashboard');
      onRefreshDb();
    } catch (err: any) {
      setLoginError(err.message || 'Database error occurred');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('emmyss_session');
    setSession(null);
    navigate('/');
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setResetSuccessMsg('');
    if (!resetEmail) return;

    // Simulate standard security token resetting
    setResetSuccessMsg(`A secure reset recovery code has been logged to simulation database for: "${resetEmail}". Verify on the notifications log below.`);
    
    // Server log simulated reset
    fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerName: 'Security Gate',
        customerEmail: resetEmail,
        customerPhone: 'N/A',
        serviceRequested: 'Account Recovery Reset',
        preferredDate: new Date().toISOString().split('T')[0],
        notes: `Simulated Recover Token reset request dispatched for username associated with ${resetEmail}.`
      })
    }).then(() => {
      onRefreshDb();
      loadStatsAndLogs();
    });
  };

  // Base64 Client-side Image compression to WebP Format
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>, target: 'portfolio' | 'testimonial' | 'service' | 'promotion' | 'blog') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadProgress('Processing and optimizing graphic asset...');
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        // Build Canvas element for resizing
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = target === 'testimonial' ? 150 : 800; // Auto-compress to optimal resolutions
        const scale = MAX_WIDTH / img.width;
        
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scale;

        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          // Optimize, compress, convert as WebP Image string
          const compressedBase64 = canvas.toDataURL('image/webp', 0.82);
          
          if (target === 'portfolio') setPortfolioForm(v => ({ ...v, imageUrl: compressedBase64 }));
          if (target === 'testimonial') setTestimonialForm(v => ({ ...v, imageUrl: compressedBase64 }));
          if (target === 'service') setServiceForm(v => ({ ...v, imageUrl: compressedBase64 }));
          if (target === 'promotion') setPromotionForm(v => ({ ...v, bannerUrl: compressedBase64 }));
          if (target === 'blog') setBlogForm(v => ({ ...v, bannerUrl: compressedBase64 }));

          setImageCropPreview(compressedBase64);
          setUploadProgress('Image localized, converted to WebP, and fully optimized.');
        }
      };
    };
    reader.readAsDataURL(file);
  };

  // Reset Application Data
  const handleHardResetDatabase = async () => {
    if (!confirm('Are you absolutely certain you want to wipe and re-seed the entire CMS directory?')) return;
    try {
      const res = await fetch('/api/db/reset', { method: 'POST' });
      await res.json();
      onRefreshDb();
      loadStatsAndLogs();
      alert('Application Database has been successfully reset and restored.');
    } catch (err) {
      alert('Reset error.');
    }
  };

  // --- CRUD DISPATCH METHODS ---

  // Services Management
  const submitServiceForm = async (e: React.FormEvent) => {
    e.preventDefault();
    const endpoint = editingItemId ? `/api/services/${editingItemId}` : '/api/services';
    const method = editingItemId ? 'PUT' : 'POST';

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(serviceForm)
      });
      if (!res.ok) throw new Error('API dispatch failed');
      onRefreshDb();
      setActiveFormType(null);
      setEditingItemId(null);
    } catch (err) {
      alert('Save failed.');
    }
  };

  // Portfolio Management
  const submitPortfolioForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!portfolioForm.imageUrl) {
      alert('Associated optimized file represents a requirement.');
      return;
    }
    const endpoint = editingItemId ? `/api/portfolio/${editingItemId}` : '/api/portfolio';
    const method = editingItemId ? 'PUT' : 'POST';

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(portfolioForm)
      });
      if (!res.ok) throw new Error('API failed');
      onRefreshDb();
      setActiveFormType(null);
      setEditingItemId(null);
    } catch (err) {
      alert('Save failed.');
    }
  };

  // Testimonials Management
  const submitTestimonialForm = async (e: React.FormEvent) => {
    e.preventDefault();
    const endpoint = editingItemId ? `/api/testimonials/${editingItemId}` : '/api/testimonials';
    const method = editingItemId ? 'PUT' : 'POST';

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testimonialForm)
      });
      if (!res.ok) throw new Error('API failed');
      onRefreshDb();
      setActiveFormType(null);
      setEditingItemId(null);
    } catch (err) {
      alert('Save failed.');
    }
  };

  // Blog Management
  const submitBlogForm = async (e: React.FormEvent) => {
    e.preventDefault();
    const endpoint = editingItemId ? `/api/blog/${editingItemId}` : '/api/blog';
    const method = editingItemId ? 'PUT' : 'POST';

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(blogForm)
      });
      if (!res.ok) throw new Error('API failed');
      onRefreshDb();
      setActiveFormType(null);
      setEditingItemId(null);
    } catch (err) {
      alert('Save failed.');
    }
  };

  // Promotions Management
  const submitPromotionForm = async (e: React.FormEvent) => {
    e.preventDefault();
    const endpoint = editingItemId ? `/api/promotions/${editingItemId}` : '/api/promotions';
    const method = editingItemId ? 'PUT' : 'POST';

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(promotionForm)
      });
      if (!res.ok) throw new Error('API failed');
      onRefreshDb();
      setActiveFormType(null);
      setEditingItemId(null);
    } catch (err) {
      alert('Save failed.');
    }
  };

  // AI automated blog outlines generator via server side Gemini
  const triggerAIGenerator = async () => {
    if (!aiPrompt) return;
    setAiGenerating(true);
    try {
      const res = await fetch('/api/blog/generate-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: aiPrompt, topic: aiTopic, category: blogForm.category })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'AI Copilot failure');

      const parsed = JSON.parse(data.text);
      setBlogForm(v => ({
        ...v,
        title: parsed.title || v.title,
        content: parsed.content || v.content,
        excerpt: parsed.excerpt || v.excerpt,
        metaTitle: parsed.metaTitle || v.metaTitle,
        metaDescription: parsed.metaDescription || v.metaDescription,
        keywords: parsed.keywords || v.keywords
      }));
      setAiPrompt('');
      alert('Gemini has written an elegant outline, metadata, and blog content structure.');
    } catch (err: any) {
      alert(err.message || 'AI service unavailable.');
    } finally {
      setAiGenerating(false);
    }
  };

  // Generic Deletion
  const handleDeleteItem = async (type: string, id: string) => {
    if (!confirm('Are you positive you wish to remove this catalog entry?')) return;
    try {
      const res = await fetch(`/api/${type}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete API error');
      onRefreshDb();
    } catch (err) {
      alert('Deletion failed.');
    }
  };

  // Bookings approvals states modifiers
  const handleBookingStatusChange = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error('Status modify failed');
      onRefreshDb();
    } catch (err) {
      alert('Booking status update failed.');
    }
  };

  // Submit Enquiry Response Form
  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyMessage || !replyingEnquiryId) return;

    try {
      const res = await fetch(`/api/enquiries/${replyingEnquiryId}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: replyMessage, sender: session?.name || 'EMMYSS Creative support' })
      });
      if (!res.ok) throw new Error('Enquiry reply failed');
      setReplyMessage('');
      setReplyingEnquiryId(null);
      onRefreshDb();
    } catch (err) {
      alert('Fail to respond to Lead.');
    }
  };

  const handleAssignenquiryStaff = async (id: string, staff: string) => {
    try {
      const res = await fetch(`/api/enquiries/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assignedStaff: staff, status: 'In Progress' })
      });
      if (!res.ok) throw new Error('Assign failed');
      onRefreshDb();
    } catch (err) {
      alert('Assign failed.');
    }
  };

  // Bulk Gallery Arrange Up & Down
  const handleReorderPortfolio = async (id: string, dir: 'up' | 'down') => {
    const list = [...db.portfolio];
    const index = list.findIndex(item => item.id === id);
    if (index === -1) return;

    const targetIdx = dir === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= list.length) return;

    // Swap ordering parameters
    const temp = list[index].order;
    list[index].order = list[targetIdx].order;
    list[targetIdx].order = temp;

    // Build payload array
    const orders = list.map(item => ({ id: item.id, order: item.order }));
    try {
      const res = await fetch('/api/portfolio/bulk', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orders })
      });
      if (!res.ok) throw new Error('Bulk reorder fail');
      onRefreshDb();
    } catch (err) {
      console.error(err);
    }
  };

  // Settings Save handler
  const handleSiteSettingsSubmit = async (e: React.FormEvent, sector: 'business' | 'seo' | 'branding') => {
    e.preventDefault();
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(db.settings)
      });
      if (!res.ok) throw new Error('Save error');
      onRefreshDb();
      alert('Corporate parameters modified successfully.');
    } catch (err) {
      alert('Config save error.');
    }
  };

  // Export Data tool
  const handleExportDataAsJson = (type: 'bookings' | 'enquiries') => {
    const items = type === 'bookings' ? db.bookings : db.enquiries;
    const fileContent = JSON.stringify(items, null, 2);
    const blob = new Blob([fileContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `archive-${type}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Counting pending badges
  const pendingBookingsCount = db.bookings.filter(b => b.status === 'New').length;
  const pendingEnquiriesCount = db.enquiries.filter(e => e.status === 'New').length;

  // --- ACCESS BLOCK CHECK ---
  if (!session) {
    return (
      <div className="bg-[#09090b] min-h-screen text-[#fafafa] flex flex-col items-center justify-center p-6 selection:bg-rose-500/20">
        <div className="w-full max-w-md bg-[#18181b] border border-[#27272a] rounded-xl p-8 shadow-2xl flex flex-col space-y-8">
          
          <div className="text-center space-y-2">
            <h1 className="text-xl font-bold font-sans tracking-widest text-white uppercase">EMMYSS CMS</h1>
            <p className="text-xs text-[#a1a1aa] font-sans">CMS portal lock. Authenticate credentials to enter.</p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-mono tracking-widest uppercase text-[#71717a] block">Staff Email</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="admin@emmyss.com"
                  value={loginEmail}
                  onChange={e => setLoginEmail(e.target.value)}
                  className="w-full bg-[#09090b] border border-[#27272a] focus:border-rose-500/50 rounded-xl px-4 py-3 text-xs text-white focus:outline-hidden"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between">
                <label className="text-[10px] font-mono tracking-widest uppercase text-[#71717a] block p-0">Password</label>
                <button 
                  type="button" 
                  onClick={() => setResetModalOpen(true)}
                  className="text-[10px] text-neutral-500 hover:text-white cursor-pointer"
                >
                  Forgot Reset?
                </button>
              </div>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={loginPassword}
                onChange={e => setLoginPassword(e.target.value)}
                className="w-full bg-[#09090b] border border-[#27272a] focus:border-rose-500/50 rounded-xl px-4 py-3 text-xs text-white focus:outline-hidden"
              />
            </div>

            {loginError && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-xs text-red-400 font-mono flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-500" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-rose-500 hover:bg-rose-600 focus:outline-hidden focus:ring-2 focus:ring-rose-500/25 text-white text-xs font-bold uppercase tracking-widest cursor-pointer transition-colors"
            >
              Sign In to CMS
            </button>
          </form>

          {/* Quick roles demo switcher helpers */}
          <div className="pt-6 border-t border-neutral-800 space-y-2.5">
            <span className="text-[10px] font-mono uppercase text-neutral-500 tracking-wider block text-center">DEMO CREDENTIALS CLUE</span>
            <div className="grid grid-cols-1 gap-2 text-[10px] font-sans text-neutral-400">
              <div className="p-2 border border-neutral-800/60 rounded bg-neutral-950/40 flex justify-between items-center">
                <span>Super Admin: <strong className="text-white">admin@emmyss.com</strong></span>
                <button onClick={() => { setLoginEmail('admin@emmyss.com'); setLoginPassword('adminpassword'); }} className="text-[10px] text-rose-400 font-mono hover:underline cursor-pointer">Use</button>
              </div>
              <div className="p-2 border border-neutral-800/60 rounded bg-neutral-950/40 flex justify-between items-center">
                <span>Content Manager: <strong className="text-white">manager@emmyss.com</strong></span>
                <button onClick={() => { setLoginEmail('manager@emmyss.com'); setLoginPassword('managerpassword'); }} className="text-[10px] text-rose-400 font-mono hover:underline cursor-pointer">Use</button>
              </div>
              <div className="p-2 border border-neutral-800/60 rounded bg-neutral-950/40 flex justify-between items-center">
                <span>Staff Queue: <strong className="text-white">staff@emmyss.com</strong></span>
                <button onClick={() => { setLoginEmail('staff@emmyss.com'); setLoginPassword('staffpassword'); }} className="text-[10px] text-rose-400 font-mono hover:underline cursor-pointer">Use</button>
              </div>
            </div>
            <p className="text-[9px] text-neutral-500 text-center uppercase tracking-normal pt-1 flex items-center justify-center gap-1">
              Password code is <code className="bg-neutral-800 text-neutral-300 px-1 rounded font-mono">role + password</code> (e.g. "adminpassword")
            </p>
          </div>

        </div>

        {/* Dynamic recover simulation Dialog */}
        <Dialog
          isOpen={resetModalOpen}
          onClose={() => setResetModalOpen(false)}
          title="Account Recovery Simulation"
          size="sm"
        >
          <form onSubmit={handleForgotPassword} className="space-y-4 text-xs font-sans">
            <p className="text-neutral-400 leading-relaxed text-[11px] mt-1">Provide your corporate staff email address. Our simulator will inject reset tracking tokens directly into the alerts list.</p>
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-neutral-500 uppercase block">Registered Email</label>
              <input
                type="email"
                required
                value={resetEmail}
                onChange={e => setResetEmail(e.target.value)}
                placeholder="staff@emmyss.com"
                className="w-full px-4.5 py-3 rounded bg-neutral-950 border border-neutral-800 text-white focus:outline-hidden"
              />
            </div>
            {resetSuccessMsg && (
              <p className="text-emerald-450 text-[11px] bg-emerald-500/5 p-3 rounded border border-emerald-500/20 leading-relaxed font-mono">{resetSuccessMsg}</p>
            )}
            <div className="flex gap-4 pt-2">
              <button
                type="button"
                onClick={() => { setResetModalOpen(false); setResetSuccessMsg(''); }}
                className="flex-1 py-2.5 rounded bg-neutral-800 text-neutral-450 font-semibold"
              >
                Close
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded bg-rose-500 text-white font-semibold"
              >
                Simulate Reset
              </button>
            </div>
          </form>
        </Dialog>
      </div>
    );
  }

  // --- RENDERING AUTHORIZED CMS SCREEN LAYOUT ---

  const renderContentPanel = () => {
    switch (currentPath) {
      
      // 1. DASHBOARD SUMMARY
      case '/admin':
      case '/admin/dashboard':
        return (
          <div className="space-y-10">
            
            {/* Header Row */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h1 className="text-2xl font-bold text-white tracking-tight font-sans uppercase">METRICS OVERVIEW</h1>
                <p className="text-xs text-neutral-400 font-sans">Corporate visitor volumes, shoot commissions conversion rates, and recent workflow activity.</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleHardResetDatabase}
                  className="p-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-neutral-400 hover:text-red-400 hover:border-red-500/20 text-xs font-mono font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer"
                  title="Wipe database changes and restore default catalog seed information"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Database Restore
                </button>
                <div className="text-xs text-neutral-400 font-mono tracking-wide px-3.5 py-2.5 border border-neutral-900 rounded-xl bg-neutral-900/40">
                  {new Date().toISOString().split('T')[0]} ({session.role})
                </div>
              </div>
            </div>

            {/* Stats widgets grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="p-6 bg-[#18181b] border border-[#27272a] rounded-xl flex items-center justify-between">
                <div className="space-y-2">
                  <span className="text-[10px] font-mono text-[#71717a] uppercase tracking-widest block font-sans">Website Views</span>
                  <span className="text-2xl font-bold text-white leading-none font-sans">{analytics?.summary?.totalViews || db.visitorStats.totalViews}</span>
                </div>
                <Users className="w-8 h-8 text-rose-500/20" />
              </div>

              <div className="p-6 bg-[#18181b] border border-[#27272a] rounded-xl flex items-center justify-between">
                <div className="space-y-2">
                  <span className="text-[10px] font-mono text-[#71717a] uppercase tracking-widest block font-sans">Total Bookings</span>
                  <span className="text-2xl font-bold text-white leading-none font-sans">{analytics?.summary?.totalBookings || db.bookings.length}</span>
                </div>
                <Calendar className="w-8 h-8 text-emerald-500/20" />
              </div>

              <div className="p-6 bg-[#18181b] border border-[#27272a] rounded-xl flex items-center justify-between">
                <div className="space-y-2">
                  <span className="text-[10px] font-mono text-[#71717a] uppercase tracking-widest block font-sans">Leads Enquiries</span>
                  <span className="text-2xl font-bold text-white leading-none font-sans">{analytics?.summary?.totalEnquiries || db.enquiries.length}</span>
                </div>
                <Mail className="w-8 h-8 text-purple-500/20" />
              </div>

              <div className="p-6 bg-[#18181b] border border-[#27272a] rounded-xl flex items-center justify-between">
                <div className="space-y-2">
                  <span className="text-[10px] font-mono text-[#71717a] uppercase tracking-widest block font-sans">Conversion rate</span>
                  <span className="text-2xl font-bold text-white leading-none font-sans">{analytics?.summary?.conversionRate || '5.2%'}</span>
                </div>
                <TrendingUp className="w-8 h-8 text-amber-500/20" />
              </div>

            </div>

            {/* Custom SVG Charts panel */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Daily page hits chart */}
              <div className="p-6 bg-[#18181b] border border-[#27272a] rounded-xl space-y-6">
                <h4 className="text-xs font-mono tracking-widest uppercase text-white">Daily Traffic Volume (Jun 01 - Jun 07)</h4>
                
                {/* SVG Line chart */}
                <div className="h-44 w-full">
                  <svg className="w-full h-full" viewBox="0 0 500 150">
                    {/* Gridlines */}
                    <line x1="50" y1="20" x2="480" y2="20" stroke="#1f1f1f" strokeDasharray="3,3" />
                    <line x1="50" y1="70" x2="480" y2="70" stroke="#1f1f1f" strokeDasharray="3,3" />
                    <line x1="50" y1="120" x2="480" y2="120" stroke="#333" strokeWidth="1" />

                    {/* Chart path */}
                    <path
                      d="M 50 120 L 110 90 L 170 70 L 230 40 L 295 60 L 355 30 L 415 20 L 480 110"
                      fill="none"
                      stroke="#f43f5e"
                      strokeWidth="3.2"
                      strokeLinecap="round"
                    />

                    {/* Nodes points */}
                    <circle cx="50" cy="120" r="4" fill="#fff" stroke="#f43f5e" strokeWidth="2" />
                    <circle cx="110" cy="90" r="4" fill="#fff" stroke="#f43f5e" strokeWidth="2" />
                    <circle cx="170" cy="70" r="4" fill="#fff" stroke="#f43f5e" strokeWidth="2" />
                    <circle cx="230" cy="40" r="4" fill="#fff" stroke="#f43f5e" strokeWidth="2" />
                    <circle cx="295" cy="60" r="4" fill="#fff" stroke="#f43f5e" strokeWidth="2" />
                    <circle cx="355" cy="30" r="4" fill="#fff" stroke="#f43f5e" strokeWidth="2" />
                    <circle cx="415" cy="20" r="4" fill="#fff" stroke="#f43f5e" strokeWidth="2" />
                    <circle cx="480" cy="110" r="4" fill="#fff" stroke="#f43f5e" strokeWidth="2" />

                    {/* Labels */}
                    <text x="50" y="140" fill="#666" fontSize="8" textAnchor="middle">01 Jun</text>
                    <text x="110" y="140" fill="#666" fontSize="8" textAnchor="middle">02 Jun</text>
                    <text x="170" y="140" fill="#666" fontSize="8" textAnchor="middle">03 Jun</text>
                    <text x="230" y="140" fill="#666" fontSize="8" textAnchor="middle">04 Jun</text>
                    <text x="295" y="140" fill="#666" fontSize="8" textAnchor="middle">05 Jun</text>
                    <text x="355" y="140" fill="#666" fontSize="8" textAnchor="middle">06 Jun</text>
                    <text x="415" y="140" fill="#666" fontSize="8" textAnchor="middle">07 Jun</text>
                  </svg>
                </div>
              </div>

              {/* Traffic allocation channels */}
              <div className="p-6 bg-[#18181b] border border-[#27272a] rounded-xl space-y-6">
                <h4 className="text-xs font-mono tracking-widest uppercase text-white">Acquisition Channels Referral counts</h4>
                
                <div className="space-y-4">
                  {(analytics?.sources || db.visitorStats.sources).map((source: any, i: number) => {
                    const pct = source.count ? ((source.count / 1420) * 100).toFixed(0) : '15';
                    const barWidths = [`w-[55%]`, `w-[35%]`, `w-[15%]`, `w-[12%]`];
                    return (
                      <div key={source.name} className="space-y-1.5 text-xs">
                        <div className="flex items-center justify-between text-neutral-400">
                          <span>{source.name}</span>
                          <span className="text-white font-mono">{source.count} views ({pct}%)</span>
                        </div>
                        <div className="h-2 w-full bg-[#09090b] rounded-full overflow-hidden">
                          <div className={`h-full bg-rose-500 rounded-full ${barWidths[i] || 'w-[20%]'}`} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Combined Timeline log queues */}
            <div className="grid grid-cols-1 gap-8">
              <div className="p-6 bg-[#18181b] border border-[#27272a] rounded-xl space-y-6">
                <h4 className="text-xs font-mono tracking-widest uppercase text-white">Latest Activity & Notification Logs (Simulated)</h4>
                
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                  {emailLogs.length === 0 ? (
                    <p className="text-xs text-neutral-500">Log entries are generated dynamically on public submissions.</p>
                  ) : (
                    emailLogs.map((log) => (
                      <div key={log.id} className="p-3.5 bg-neutral-950 rounded-xl border border-neutral-900/75 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-sans">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-mono font-semibold uppercase ${log.type === 'Admin Alerts' ? 'bg-amber-500/10 text-amber-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                              {log.type}
                            </span>
                            <span className="text-white font-semibold">To: {log.recipient}</span>
                          </div>
                          <p className="text-neutral-300"><strong className="text-neutral-100">{log.subject}</strong></p>
                          <p className="text-neutral-500 text-[11px] leading-relaxed italic">"{log.body.slice(0, 150)}..."</p>
                        </div>
                        <span className="text-[10px] text-neutral-500 font-mono flex-shrink-0 self-end sm:self-center">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

          </div>
        );

      // 2. BOOKINGS APPROVALS PANEL
      case '/admin/bookings':
        const filteredBookings = bookingFilter === 'All'
          ? db.bookings
          : db.bookings.filter(b => b.status === bookingFilter);

        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h1 className="text-2xl font-bold text-white tracking-tight font-sans">SHOOTS COMMISSIONS QUEUE</h1>
                <p className="text-xs text-neutral-400">Approve schedules, update status codes, or download bookings archives.</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleExportDataAsJson('bookings')}
                  className="px-3.5 py-2 rounded-xl bg-rose-500 text-white font-semibold text-xs tracking-wide uppercase hover:bg-rose-600 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <FileDown className="w-4.5 h-4.5" /> Export Bookings JSON
                </button>
              </div>
            </div>

            {/* Filter buttons */}
            <div className="flex flex-wrap gap-2 p-1 bg-neutral-900/60 border border-neutral-900 rounded-xl max-w-fit">
              {['All', 'New', 'Pending', 'Confirmed', 'Completed', 'Cancelled'].map((status) => (
                <button
                  key={status}
                  onClick={() => setBookingFilter(status)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-sans cursor-pointer ${
                    bookingFilter === status ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

            {/* Bookings Table queue */}
            <div className="bg-neutral-900/10 border border-neutral-900 rounded-2xl overflow-x-auto">
              <table className="w-full text-xs text-left text-neutral-400 select-none">
                <thead className="text-[10px] uppercase font-mono tracking-wider text-neutral-500 bg-neutral-950/65 border-b border-neutral-900/80">
                  <tr>
                    <th className="px-6 py-4 font-semibold text-white">Client Details</th>
                    <th className="px-6 py-4 font-semibold text-white">Commission Service</th>
                    <th className="px-6 py-4 font-semibold text-white">Target Date</th>
                    <th className="px-6 py-4 font-semibold text-white">Status Alert</th>
                    <th className="px-6 py-4 font-semibold text-white text-right">Verification Controls</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-900/50">
                  {filteredBookings.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-xs text-neutral-500">No booking commissions match filter conditions.</td>
                    </tr>
                  ) : (
                    filteredBookings.map((b) => (
                      <tr key={b.id} className="hover:bg-neutral-900/10 transition-colors">
                        <td className="px-6 py-5 space-y-1">
                          <h4 className="text-neutral-100 font-bold">{b.customerName}</h4>
                          <div className="flex flex-col text-[11px] text-neutral-400 space-y-0.5 font-sans">
                            <span>Email: <strong className="text-neutral-300">{b.customerEmail}</strong></span>
                            <span>Phone: {b.customerPhone}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span className="font-semibold text-white block">{b.serviceRequested}</span>
                          {b.notes && <span className="text-[10px] text-neutral-500 italic max-w-xs block truncate" title={b.notes}>"{b.notes}"</span>}
                        </td>
                        <td className="px-6 py-5 font-mono text-neutral-300">{b.preferredDate}</td>
                        <td className="px-6 py-5">
                          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase ${
                            b.status === 'Confirmed' ? 'bg-emerald-500/10 text-emerald-400' 
                            : b.status === 'Cancelled' ? 'bg-red-500/10 text-red-400' 
                            : b.status === 'Completed' ? 'bg-sky-500/10 text-sky-400'
                            : 'bg-amber-500/10 text-amber-400'
                          }`}>
                            {b.status}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-right space-x-1.5 space-y-1">
                          <button
                            onClick={() => handleBookingStatusChange(b.id, 'Confirmed')}
                            className="p-1 text-emerald-400 hover:bg-emerald-500/10 border border-neutral-900 hover:border-emerald-500/20 rounded cursor-pointer"
                            title="Approve / Confirm"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleBookingStatusChange(b.id, 'Completed')}
                            className="p-1 text-sky-400 hover:bg-sky-500/10 border border-neutral-900 hover:border-sky-500/20 rounded cursor-pointer"
                            title="Mark Completed"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleBookingStatusChange(b.id, 'Cancelled')}
                            className="p-1 text-red-400 hover:bg-red-500/10 border border-neutral-900 hover:border-red-500/20 rounded cursor-pointer"
                            title="Reject/Cancel"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteItem('bookings', b.id)}
                            className="p-1 text-neutral-500 hover:text-red-400 hover:bg-red-500/5 border border-neutral-900 rounded cursor-pointer"
                            title="Remove completely"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );

      // 3. ENQUIRIES CONTACT LEADS PANEL
      case '/admin/enquiries':
        const filteredEnquiries = enquiryFilter === 'All'
          ? db.enquiries
          : db.enquiries.filter(e => e.status === enquiryFilter);

        return (
          <div className="space-y-6">
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h1 className="text-2xl font-bold text-white tracking-tight font-sans">LEAD ACQUISITIONS QUEUE</h1>
                <p className="text-xs text-neutral-400">Respond to inbox enquiries, assign operational staff, and track customer lead replies.</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleExportDataAsJson('enquiries')}
                  className="px-3.5 py-2 rounded-xl bg-rose-500 text-white font-semibold text-xs tracking-wide uppercase hover:bg-rose-600 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <FileDown className="w-4.5 h-4.5" /> Export Enquiries JSON
                </button>
              </div>
            </div>

            {/* Filter buttons */}
            <div className="flex gap-2 p-1 bg-neutral-900/60 border border-neutral-900 rounded-xl max-w-fit">
              {['All', 'New', 'In Progress', 'Replied', 'Archived'].map((status) => (
                <button
                  key={status}
                  onClick={() => setEnquiryFilter(status)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                    enquiryFilter === status ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

            {/* Enquiries Leads list */}
            <div className="space-y-4">
              {filteredEnquiries.length === 0 ? (
                <div className="py-12 border border-dashed border-neutral-900 p-8 rounded-2xl text-center text-xs text-neutral-500">
                  Leads folder is clean. No inquiries matching chosen indices.
                </div>
              ) : (
                filteredEnquiries.map((e) => (
                  <div 
                    key={e.id}
                    className="p-6 bg-neutral-900/35 border border-neutral-900/70 rounded-2xl space-y-4 font-sans text-xs transition-shadow hover:shadow-lg"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-neutral-900 pb-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-white tracking-tight">{e.name}</h4>
                          <span className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-mono uppercase ${
                            e.status === 'Replied' ? 'bg-emerald-500/10 text-emerald-400' 
                            : e.status === 'In Progress' ? 'bg-amber-500/10 text-amber-400' 
                            : 'bg-rose-500/10 text-rose-400'
                          }`}>
                            {e.status}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-neutral-400 text-xs">
                          <span>Email: <strong className="text-neutral-300">{e.email}</strong></span>
                          <span>Phone: {e.phone}</span>
                          <span className="font-mono text-neutral-500">Submitted: {new Date(e.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      {/* Staff assignment & controls */}
                      <div className="flex items-center gap-3">
                        <select
                          value={e.assignedStaff || ''}
                          onChange={(evt) => handleAssignenquiryStaff(e.id, evt.target.value)}
                          className="px-2.5 py-1.5 bg-neutral-950 border border-neutral-800 rounded text-[11px] text-neutral-300 focus:outline-shadow text-center font-mono uppercase tracking-tight"
                        >
                          <option value="">No staff Assigned</option>
                          <option value="Gideon Superadmin">Gideon Superadmin</option>
                          <option value="Sarah ContentManager">Sarah ContentManager</option>
                          <option value="James Staff">James Staff</option>
                        </select>
                        <button
                          onClick={() => handleDeleteItem('enquiries', e.id)}
                          className="p-1.5 text-neutral-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h5 className="text-[10px] font-mono uppercase text-neutral-500 tracking-wider">Requested service: "{e.serviceRequested}"</h5>
                      <p className="text-neutral-300 leading-relaxed bg-neutral-950/40 p-3.5 border border-neutral-900 rounded-xl">"{e.message}"</p>
                    </div>

                    {/* Show previous replies dialog lines */}
                    {e.replies && e.replies.length > 0 && (
                      <div className="pl-6 border-l-2 border-neutral-800 space-y-3">
                        <span className="text-[9px] font-mono uppercase text-neutral-500 tracking-widest block">Outbox Reply logs:</span>
                        {e.replies.map((rep) => (
                          <div key={rep.id} className="p-3 bg-neutral-950/80 rounded-lg space-y-1 border border-neutral-900/60 font-mono text-[11px]">
                            <div className="flex items-center gap-2">
                              <CornerDownRight className="w-3.5 h-3.5 text-rose-500" />
                              <span className="text-neutral-300 font-bold">{rep.sender}</span>
                              <span className="text-neutral-600">({new Date(rep.date).toLocaleDateString()})</span>
                            </div>
                            <p className="text-neutral-400 italic">"{rep.message}"</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Quick Respond Form */}
                    <div className="pt-2">
                      {replyingEnquiryId === e.id ? (
                        <form onSubmit={handleReplySubmit} className="space-y-3">
                          <textarea
                            rows={3}
                            required
                            value={replyMessage}
                            onChange={evt => setReplyMessage(evt.target.value)}
                            placeholder={`Dear ${e.name}, thank you for your query... Detail reply proposal here (Simulated Resend API dispatch is fully enabled!)`}
                            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-xs text-white placeholder-neutral-600 focus:outline-hidden"
                          />
                          <div className="flex gap-2">
                            <button
                              type="submit"
                              className="px-4 py-2 rounded bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs cursor-pointer"
                            >
                              Dispatch Simulation Reply
                            </button>
                            <button
                              type="button"
                              onClick={() => { setReplyingEnquiryId(null); setReplyMessage(''); }}
                              className="px-4 py-2 rounded bg-neutral-850 hover:bg-neutral-800 font-semibold text-neutral-400 text-xs"
                            >
                              Dismiss
                            </button>
                          </div>
                        </form>
                      ) : (
                        <button
                          onClick={() => setReplyingEnquiryId(e.id)}
                          className="text-xs text-rose-450 hover:underline hover:tracking-wide transition-all font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          Draft Outbox Reply Message <CornerDownRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                  </div>
                ))
              )}
            </div>

          </div>
        );

      // 4. PORTFOLIO & DRAG & DROP REORDERING PANEL
      case '/admin/portfolio':
        return (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h1 className="text-2xl font-bold text-white tracking-tight font-sans">GALLERY DISPATCH MANAGEMENT</h1>
                <p className="text-xs text-neutral-400">Configure public pictures, optimize formats, and set custom visual layouts.</p>
              </div>
              <button
                onClick={() => {
                  setEditingItemId(null);
                  setPortfolioForm({ title: '', category: 'Portraits', imageUrl: '', description: '' });
                  setActiveFormType('portfolio');
                  setImageCropPreview('');
                  setUploadProgress('');
                }}
                className="px-4 py-2.5 rounded-xl bg-rose-500 text-white font-bold text-xs tracking-widest uppercase hover:bg-rose-600 transition-colors flex items-center gap-1.5 cursor-pointer shadow-lg shadow-rose-500/10"
              >
                <Plus className="w-4 h-4" /> Upload Graphic Asset
              </button>
            </div>

            {/* List and Ordering */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 select-none">
              
              {/* PORTFOLIO GRID PREVIEW */}
              <div className="bg-neutral-900/35 border border-neutral-900 p-6 rounded-2xl space-y-6">
                <h4 className="text-xs font-mono tracking-widest uppercase text-white pb-3 border-b border-neutral-900">Current visual layout orders ({db.portfolio.length} images)</h4>
                
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                  {db.portfolio.map((item, idx) => (
                    <div 
                      key={item.id}
                      className="p-3 bg-neutral-950 rounded-xl border border-neutral-900 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img 
                          src={item.imageUrl} 
                          alt={item.title} 
                          referrerPolicy="no-referrer"
                          className="w-11 h-11 rounded-lg object-cover bg-neutral-900 shrink-0 border border-neutral-800"
                        />
                        <div className="min-w-0">
                          <h5 className="font-bold text-white truncate font-sans">{item.title}</h5>
                          <span className="text-[10px] text-emerald-400 uppercase font-mono tracking-wide">{item.category}</span>
                        </div>
                      </div>

                      {/* Direction controls & edits */}
                      <div className="flex items-center gap-2shrink-0">
                        <div className="flex flex-col gap-0.5">
                          <button 
                            onClick={() => handleReorderPortfolio(item.id, 'up')}
                            className="p-1 hover:bg-neutral-800 border border-neutral-900 hover:border-neutral-700 text-neutral-400 hover:text-white rounded cursor-pointer"
                            disabled={idx === 0}
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={() => handleReorderPortfolio(item.id, 'down')}
                            className="p-1 hover:bg-neutral-800 border border-neutral-900 hover:border-neutral-700 text-neutral-400 hover:text-white rounded cursor-pointer"
                            disabled={idx === db.portfolio.length - 1}
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <button
                          onClick={() => {
                            setPortfolioForm(item);
                            setEditingItemId(item.id);
                            setActiveFormType('portfolio');
                            setImageCropPreview(item.imageUrl);
                            setUploadProgress('Asset details loaded for customization.');
                          }}
                          className="p-1.5 bg-neutral-900 text-neutral-300 hover:text-white border border-neutral-800 rounded-lg cursor-pointer"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteItem('portfolio', item.id)}
                          className="p-1.5 text-neutral-500 hover:text-red-400 rounded-lg cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* COMMISSIONS SERVICES LIST */}
              <div className="bg-neutral-900/35 border border-neutral-900 p-6 rounded-2xl flex flex-col justify-between">
                <div className="space-y-6">
                  <h4 className="text-xs font-mono tracking-widest uppercase text-white pb-3 border-b border-neutral-900">ACTIVE ATELIER SERVICES ({db.services.length} items)</h4>
                  
                  <div className="space-y-3 max-h-[400px] overflow-y-auto">
                    {db.services.map((srv) => (
                      <div key={srv.id} className="p-3.5 bg-neutral-950 rounded-xl border border-neutral-900 flex items-center justify-between text-xs font-sans">
                        <div className="space-y-1">
                          <h5 className="font-bold text-white uppercase tracking-tight">{srv.name}</h5>
                          <div className="flex items-center gap-2 text-[10px] text-neutral-400">
                            <span className="font-mono text-emerald-400">{srv.category}</span>
                            <span>Est: <strong className="text-white">{srv.price || 'Quotes'}</strong></span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setServiceForm(srv);
                              setEditingItemId(srv.id);
                              setActiveFormType('service');
                            }}
                            className="p-1 bg-neutral-900 hover:bg-neutral-855 text-neutral-350 hover:text-white rounded border border-neutral-800 cursor-pointer"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteItem('services', srv.id)}
                            className="p-1 text-neutral-500 hover:text-red-400 rounded cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setEditingItemId(null);
                    setServiceForm({ name: '', category: 'Photography', description: '', price: '', featured: false, status: 'Active' });
                    setActiveFormType('service');
                  }}
                  className="w-full mt-6 py-3 border border-neutral-800 hover:border-neutral-500 hover:bg-neutral-900/30 text-neutral-300 hover:text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                >
                  Configure Service Pack
                </button>
              </div>

            </div>

          </div>
        );

      // 5. TESTIMONIALS CRM LIST
      case '/admin/testimonials':
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h1 className="text-2xl font-bold text-white tracking-tight font-sans">REVIEWS & TESTIMONIALS</h1>
                <p className="text-xs text-neutral-400">Publish high-fidelity evaluations, stars ratings, and client photos.</p>
              </div>
              <button
                onClick={() => {
                  setEditingItemId(null);
                  setTestimonialForm({ name: '', position: '', testimonial: '', rating: 5, imageUrl: '' });
                  setActiveFormType('testimonial');
                  setImageCropPreview('');
                  setUploadProgress('');
                }}
                className="px-4 py-2.5 rounded-xl bg-rose-500 text-white font-bold text-xs tracking-widest uppercase hover:bg-rose-600 transition-colors flex items-center gap-1.5 cursor-pointer shadow-lg shadow-rose-500/10"
              >
                <Plus className="w-4 h-4" /> Add Testimonial
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {db.testimonials.map((test) => (
                <div 
                  key={test.id}
                  className="bg-neutral-900/25 border border-neutral-900 rounded-2xl p-6 space-y-4 hover:border-neutral-800 transition-colors flex flex-col justify-between"
                >
                  <div className="space-y-3.5 font-sans">
                    <div className="flex justify-between items-start">
                      <div className="flex gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Check 
                            key={i} 
                            className={`w-4 h-4 ${i < test.rating ? 'text-amber-400 fill-amber-400/20' : 'text-neutral-800'}`} 
                          />
                        ))}
                      </div>
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => {
                            setTestimonialForm(test);
                            setEditingItemId(test.id);
                            setActiveFormType('testimonial');
                            setImageCropPreview(test.imageUrl);
                          }}
                          className="p-1 bg-neutral-950 hover:bg-neutral-900 text-neutral-400 hover:text-white rounded border border-neutral-900/80 cursor-pointer"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteItem('testimonials', test.id)}
                          className="p-1 text-neutral-500 hover:text-red-400 rounded cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-neutral-300 leading-relaxed italic">"{test.testimonial}"</p>
                  </div>

                  <div className="flex items-center gap-3 pt-3 border-t border-neutral-900/60">
                    <img 
                      src={test.imageUrl} 
                      alt={test.name} 
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 object-cover rounded-full border border-neutral-800 shrink-0"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-white font-sans">{test.name}</h4>
                      <p className="text-[10px] text-neutral-500 font-mono tracking-tight mt-0.5">{test.position}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      // 6. CREATIVE BLOG OUTLINING WITH GEMINI CO-PILOT
      case '/admin/blog':
        return (
          <div className="space-y-8 select-none">
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h1 className="text-2xl font-bold text-white tracking-tight font-sans">STUDIO JOURNAL CATALOG</h1>
                <p className="text-xs text-neutral-400">Review creative journals in Draft or Published stages with integrated AI Writing support.</p>
              </div>
              <button
                onClick={() => {
                  setEditingItemId(null);
                  setBlogForm({ title: '', excerpt: '', content: '', category: 'Creative', tags: [], status: 'Draft', metaTitle: '', metaDescription: '', keywords: '', bannerUrl: '' });
                  setActiveFormType('blog');
                  setImageCropPreview('');
                  setUploadProgress('');
                }}
                className="px-4 py-2.5 rounded-xl bg-rose-500 text-white font-bold text-xs tracking-widest uppercase hover:bg-rose-600 transition-colors flex items-center gap-1.5 cursor-pointer shadow-lg shadow-rose-500/10"
              >
                <Plus className="w-4 h-4" /> Create Journal Draft
              </button>
            </div>

            {/* AI Assistant Banner */}
            <div className="p-6 bg-gradient-to-r from-rose-500/10 via-rose-500/5 to-transparent border border-rose-500/10 rounded-2xl space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-rose-400" />
                <h4 className="text-xs font-semibold tracking-wider font-mono text-white uppercase">AI Co-Pilot Copywriter (Gemini 3.5 Flash)</h4>
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed font-sans max-w-2xl">
                Unleash the Google Gemini model directly from the content server. Provide a quick prompt outline of ideas, and let the AI instantly draft complete journals with optimized tags and SEO descriptions.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 pt-1">
                <input
                  type="text"
                  value={aiPrompt}
                  onChange={e => setAiPrompt(e.target.value)}
                  placeholder="e.g., Explain depth of field in luxury wedding cinema shoots and lighting requirements"
                  className="flex-1 bg-neutral-950 border border-neutral-905 focus:border-rose-500/40 rounded-xl px-4 py-3 text-xs text-white focus:outline-hidden"
                />
                <button
                  type="button"
                  onClick={() => {
                    setEditingItemId(null);
                    setBlogForm({ title: '', excerpt: '', content: '', category: 'Education', tags: [], status: 'Draft' });
                    setActiveFormType('blog');
                    setTimeout(() => triggerAIGenerator(), 100);
                  }}
                  className="px-5 py-3 rounded-xl bg-rose-500 text-white font-bold text-xs font-sans hover:bg-rose-600 cursor-pointer flex items-center gap-2 flex-shrink-0 justify-center"
                >
                  <Sparkles className="w-3.5 h-3.5 fill-white/20" /> Write Article Outlines
                </button>
              </div>
            </div>

            {/* List Table of blogs */}
            <div className="bg-neutral-900/10 border border-neutral-900 rounded-2xl overflow-x-auto">
              <table className="w-full text-xs text-left text-neutral-400">
                <thead className="text-[10px] uppercase font-mono tracking-wider text-neutral-500 bg-neutral-950/65 border-b border-neutral-900/80">
                  <tr>
                    <th className="px-6 py-4 font-semibold text-white">Cover</th>
                    <th className="px-6 py-4 font-semibold text-white">Post Title</th>
                    <th className="px-6 py-4 font-semibold text-white">Category</th>
                    <th className="px-6 py-4 font-semibold text-white">SEO Keys</th>
                    <th className="px-6 py-4 font-semibold text-white">Stage</th>
                    <th className="px-6 py-4 font-semibold text-white text-right">Settings</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-900/50">
                  {db.blog.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-xs text-neutral-500">The journal folder is empty. Initialize writing draft above.</td>
                    </tr>
                  ) : (
                    db.blog.map((p) => (
                      <tr key={p.id} className="hover:bg-neutral-900/10 transition-colors">
                        <td className="px-6 py-4 shrink-0">
                          <img 
                            src={p.bannerUrl} 
                            alt={p.title} 
                            referrerPolicy="no-referrer"
                            className="w-10 h-10 object-cover rounded bg-neutral-950 border border-neutral-800"
                          />
                        </td>
                        <td className="px-6 py-4 font-bold text-white max-w-xs truncate" title={p.title}>
                          {p.title}
                        </td>
                        <td className="px-6 py-4 font-mono text-emerald-400">{p.category}</td>
                        <td className="px-6 py-4 font-sans text-neutral-400 text-[11px] max-w-xs truncate">{p.keywords || 'None set'}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold uppercase ${
                            p.status === 'Published' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-neutral-800 text-neutral-500'
                          }`}>
                            {p.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <button
                            onClick={() => {
                              setBlogForm(p);
                              setEditingItemId(p.id);
                              setActiveFormType('blog');
                              setImageCropPreview(p.bannerUrl);
                            }}
                            className="p-1.5 bg-neutral-900 border border-neutral-800 text-neutral-350 hover:text-white rounded cursor-pointer inline-block"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteItem('blog', p.id)}
                            className="p-1.5 text-neutral-500 hover:text-red-400 rounded cursor-pointer inline-block"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Promotions section */}
            <div className="pt-6 border-t border-neutral-900 space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-sm font-mono tracking-widest uppercase text-white">Active Promotions Campign Specials</h3>
                  <p className="text-xs text-neutral-400">Display and configure sales campaign alerts shown on public website header overlays.</p>
                </div>
                <button
                  onClick={() => {
                    setEditingItemId(null);
                    setPromotionForm({ title: '', description: '', startDate: '', endDate: '', status: 'Active', bannerUrl: '' });
                    setActiveFormType('promotion');
                  }}
                  className="px-3.5 py-2 border border-neutral-800 hover:border-neutral-500 text-neutral-300 hover:text-white text-xs font-bold uppercase rounded-xl font-sans"
                >
                  Configure Special Deals
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
                {db.promotions.map((promo) => (
                  <div key={promo.id} className="p-4 bg-neutral-950 border border-neutral-900/65 rounded-xl space-y-3 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <h4 className="font-bold text-white uppercase">{promo.title}</h4>
                        <span className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-mono font-semibold uppercase ${
                          promo.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-neutral-800 text-neutral-500'
                        }`}>
                          {promo.status}
                        </span>
                      </div>
                      <p className="text-neutral-400 leading-relaxed italic">"{promo.description}"</p>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-neutral-900 text-[10px] font-mono text-neutral-550">
                      <span>Expires {promo.endDate}</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setPromotionForm(promo);
                            setEditingItemId(promo.id);
                            setActiveFormType('promotion');
                            setImageCropPreview(promo.bannerUrl);
                          }}
                          className="text-neutral-400 hover:text-white cursor-pointer"
                        >
                          Modify
                        </button>
                        <button
                          onClick={() => handleDeleteItem('promotions', promo.id)}
                          className="text-red-400 hover:underline cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        );

      // 7. WEBSITE PREFERENCE SETTINGS
      case '/admin/settings':
        return (
          <div className="space-y-10">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold text-white tracking-tight font-sans">WEBSITE CONFIG & BRANDING</h1>
              <p className="text-xs text-neutral-400">Modify corporate address contacts, organic SEO settings, and general colors layout themes.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-xs font-sans">
              
              {/* BRANDING GRAPHICS SETTINGS Form */}
              <div className="p-6 bg-neutral-900/35 border border-neutral-900 rounded-2xl space-y-4">
                <h4 className="text-xs font-mono tracking-widest uppercase text-white pb-3 border-b border-neutral-900">Custom Brand colors theme</h4>
                
                <form onSubmit={(e) => handleSiteSettingsSubmit(e, 'branding')} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase block">Logo text branding</label>
                    <input
                      type="text"
                      value={db.settings.branding.logoText}
                      onChange={e => {
                        db.settings.branding.logoText = e.target.value;
                        onRefreshDb();
                      }}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-hidden"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase block">Visual Accent Palette</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { key: 'gold', label: 'Gold Amber', bg: 'bg-amber-500' },
                        { key: 'emerald', label: 'Emerald Jade', bg: 'bg-emerald-500' },
                        { key: 'sky', label: 'Sky Blue', bg: 'bg-sky-500' },
                        { key: 'rose', label: 'Rose Gold Pink', bg: 'bg-rose-500' },
                        { key: 'purple', label: 'Luxury Purple', bg: 'bg-purple-500' }
                      ].map((item) => (
                        <button
                          key={item.key}
                          type="button"
                          onClick={() => {
                            db.settings.branding.accentColor = item.key;
                            onRefreshDb();
                          }}
                          className={`flex items-center gap-2 p-2 rounded-lg text-[11px] border text-left cursor-pointer transition-all ${
                            db.settings.branding.accentColor === item.key 
                              ? 'border-neutral-400 bg-neutral-950 text-white' 
                              : 'border-neutral-900 hover:border-neutral-800 text-neutral-400 bg-transparent'
                          }`}
                        >
                          <span className={`w-3 h-3 rounded-full shrink-0 ${item.bg}`} />
                          <span>{item.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-lg bg-rose-500 hover:bg-rose-600 text-white font-bold text-[10px] uppercase tracking-widest"
                  >
                    Save branding Preset
                  </button>
                </form>
              </div>

              {/* CORPORATE COORDINATES Form */}
              <div className="p-6 bg-neutral-900/35 border border-neutral-900 rounded-2xl space-y-4">
                <h4 className="text-xs font-mono tracking-widest uppercase text-white pb-3 border-b border-neutral-900">Corporate Coordinates configuration</h4>
                
                <form onSubmit={(e) => handleSiteSettingsSubmit(e, 'business')} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-neutral-500 uppercase">Agency name</label>
                    <input
                      type="text"
                      value={db.settings.business.companyName}
                      onChange={e => {
                        db.settings.business.companyName = e.target.value;
                        onRefreshDb();
                      }}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-neutral-500 uppercase">Registered address</label>
                    <input
                      type="text"
                      value={db.settings.business.address}
                      onChange={e => {
                        db.settings.business.address = e.target.value;
                        onRefreshDb();
                      }}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-neutral-500 uppercase">Corporate email</label>
                    <input
                      type="email"
                      value={db.settings.business.email}
                      onChange={e => {
                        db.settings.business.email = e.target.value;
                        onRefreshDb();
                      }}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-neutral-500 uppercase">Direct telephone</label>
                    <input
                      type="text"
                      value={db.settings.business.phone}
                      onChange={e => {
                        db.settings.business.phone = e.target.value;
                        onRefreshDb();
                      }}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-lg bg-rose-500 hover:bg-rose-600 text-white font-bold text-[10px] uppercase tracking-widest"
                  >
                    Save Corp Info
                  </button>
                </form>
              </div>

              {/* SEARCH ENGINE OPTIMIZATION Form */}
              <div className="p-6 bg-neutral-900/35 border border-neutral-900 rounded-2xl space-y-4">
                <h4 className="text-xs font-mono tracking-widest uppercase text-white pb-3 border-b border-neutral-900">SEO Meta parameters config</h4>
                
                <form onSubmit={(e) => handleSiteSettingsSubmit(e, 'seo')} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-neutral-500 uppercase">Index Title tag</label>
                    <input
                      type="text"
                      value={db.settings.seo.metaTitle}
                      onChange={e => {
                        db.settings.seo.metaTitle = e.target.value;
                        onRefreshDb();
                      }}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-neutral-500 uppercase">Search Keywords (CSV)</label>
                    <input
                      type="text"
                      value={db.settings.seo.keywords}
                      onChange={e => {
                        db.settings.seo.keywords = e.target.value;
                        onRefreshDb();
                      }}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-neutral-500 uppercase">Index Meta descriptions</label>
                    <textarea
                      rows={3}
                      value={db.settings.seo.metaDescription}
                      onChange={e => {
                        db.settings.seo.metaDescription = e.target.value;
                        onRefreshDb();
                      }}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-xs text-white resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-lg bg-rose-500 hover:bg-rose-600 text-white font-bold text-[10px] uppercase tracking-widest"
                  >
                    Save SEO Tags
                  </button>
                </form>
              </div>

            </div>

            {/* Static pages management (Hero, About Us) */}
            <div className="pt-8 border-t border-neutral-900 grid grid-cols-1 md:grid-cols-2 gap-8 text-xs font-sans">
              
              {/* HOME HERO CONTENT EDITORS */}
              <div className="p-6 bg-neutral-900/35 border border-neutral-900 rounded-2xl space-y-4">
                <h4 className="text-xs font-mono tracking-widest uppercase text-white pb-3 border-b border-neutral-900">Custom HomePage Hero content values</h4>
                
                <form 
                  onSubmit={async (e) => {
                    e.preventDefault();
                    await fetch('/api/hero', {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(db.hero)
                    });
                    alert('Hero segments modified.');
                    onRefreshDb();
                  }}
                  className="space-y-4"
                >
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-neutral-500 uppercase">Hero Display Heading Title</label>
                    <input
                      type="text"
                      value={db.hero.title}
                      onChange={e => {
                        db.hero.title = e.target.value;
                        onRefreshDb();
                      }}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-neutral-500 uppercase">Subtext Tagline description</label>
                    <textarea
                      rows={3}
                      value={db.hero.subtitle}
                      onChange={e => {
                        db.hero.subtitle = e.target.value;
                        onRefreshDb();
                      }}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-xs text-white resize-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-neutral-500 uppercase">Primary Action CTA Text</label>
                      <input
                        type="text"
                        value={db.hero.primaryCtaText}
                        onChange={e => {
                          db.hero.primaryCtaText = e.target.value;
                          onRefreshDb();
                        }}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-neutral-500 uppercase">Secondary CTA Text</label>
                      <input
                        type="text"
                        value={db.hero.secondaryCtaText}
                        onChange={e => {
                          db.hero.secondaryCtaText = e.target.value;
                          onRefreshDb();
                        }}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-lg bg-rose-500 hover:bg-rose-600 text-white font-bold text-[10px] uppercase tracking-widest cursor-pointer"
                  >
                    Save homepage Hero Content
                  </button>
                </form>
              </div>

              {/* ABOUT SECTION CONTENT EDITORS */}
              <div className="p-6 bg-neutral-900/35 border border-neutral-900 rounded-2xl space-y-4">
                <h4 className="text-xs font-mono tracking-widest uppercase text-white pb-3 border-b border-neutral-900">Custom AboutUs narrative descriptions</h4>
                
                <form 
                  onSubmit={async (e) => {
                    e.preventDefault();
                    await fetch('/api/about', {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(db.about)
                    });
                    alert('About segments modified.');
                    onRefreshDb();
                  }}
                  className="space-y-4"
                >
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-neutral-500 uppercase">Company main Description</label>
                    <textarea
                      rows={3}
                      value={db.about.description}
                      onChange={e => {
                        db.about.description = e.target.value;
                        onRefreshDb();
                      }}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-xs text-white resize-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-neutral-500 uppercase">Mission Statement segment</label>
                    <textarea
                      rows={2}
                      value={db.about.mission}
                      onChange={e => {
                        db.about.mission = e.target.value;
                        onRefreshDb();
                      }}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-xs text-white resize-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-neutral-500 uppercase">Our Corporate Story background</label>
                    <textarea
                      rows={3}
                      value={db.about.story}
                      onChange={e => {
                        db.about.story = e.target.value;
                        onRefreshDb();
                      }}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-xs text-white resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-lg bg-rose-500 hover:bg-rose-600 text-white font-bold text-[10px] uppercase tracking-widest cursor-pointer"
                  >
                    Save about text details
                  </button>
                </form>
              </div>

            </div>

          </div>
        );

      default:
        return <div className="py-12 text-center text-xs text-neutral-500 font-mono">Routing index error path. Navigating dashboard...</div>;
    }
  };

  return (
    <div className="bg-[#09090b] text-neutral-200 min-h-screen flex animate-fadeIn font-sans overflow-hidden">
      
      {/* Dynamic responsive sidebar elements */}
      <AdminSidebar
        session={session}
        onLogout={handleLogout}
        pendingBookingsCount={pendingBookingsCount}
        pendingEnquiriesCount={pendingEnquiriesCount}
      />

      {/* Main CMS workpanel */}
      <main className="flex-1 bg-[#09090b] p-6 sm:p-10 overflow-y-auto max-h-screen">
        {renderContentPanel()}
      </main>

      {/* --- ALL REUSABLE DIALOG OVERLAYS FOR THE CMS (MODALS) --- */}

      {/* 1. SERVICE DUAL FORM */}
      <Dialog
        isOpen={activeFormType === 'service'}
        onClose={() => setActiveFormType(null)}
        title={editingItemId ? 'Modify Commission Service Pack' : 'Configure New Service Pack'}
        size="md"
      >
        <form onSubmit={submitServiceForm} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-mono text-neutral-500 uppercase">Service name Title</label>
            <input
              type="text"
              required
              value={serviceForm.name}
              onChange={e => setServiceForm(v => ({ ...v, name: e.target.value }))}
              placeholder="e.g., Luxury Editorial portrait"
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-neutral-500 uppercase">Category type</label>
              <select
                value={serviceForm.category}
                onChange={e => setServiceForm(v => ({ ...v, category: e.target.value as any }))}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2 py-2 text-xs text-white"
              >
                <option value="Photography">Photography Area</option>
                <option value="Videography">Videography Cinema</option>
                <option value="Graphic Design">Graphic assets Design</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-neutral-500 uppercase">Estimated rate (optional)</label>
              <input
                type="text"
                value={serviceForm.price || ''}
                onChange={e => setServiceForm(v => ({ ...v, price: e.target.value }))}
                placeholder="e.g., $450"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-mono text-neutral-500 uppercase">Package details specification</label>
            <textarea
              rows={3}
              value={serviceForm.description}
              onChange={e => setServiceForm(v => ({ ...v, description: e.target.value }))}
              placeholder="Detail number of retouched files, duration of shoot, location specifications..."
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-xs text-white resize-none"
            />
          </div>

          <div className="flex items-center justify-between py-2 border-y border-neutral-900 my-2">
            <label className="text-[10px] font-mono text-neutral-400 uppercase">Highlight Service (Featured)</label>
            <input
              type="checkbox"
              checked={!!serviceForm.featured}
              onChange={e => setServiceForm(v => ({ ...v, featured: e.target.checked }))}
              className="w-4 h-4 rounded text-rose-500"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => setActiveFormType(null)}
              className="flex-1 py-2.5 rounded border border-neutral-800 text-neutral-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded bg-rose-500 text-white font-semibold"
            >
              Save Service Details
            </button>
          </div>
        </form>
      </Dialog>

      {/* 2. GALLERY ITEM DUAL FORM */}
      <Dialog
        isOpen={activeFormType === 'portfolio'}
        onClose={() => setActiveFormType(null)}
        title={editingItemId ? 'Update Graphic metadata' : 'Optimize & Upload Graphic Asset'}
        size="md"
      >
        <form onSubmit={submitPortfolioForm} className="space-y-4 text-xs font-sans">
          
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono text-neutral-500 uppercase block">Graphic metadata Heading</label>
            <input
              type="text"
              required
              value={portfolioForm.title}
              onChange={e => setPortfolioForm(v => ({ ...v, title: e.target.value }))}
              placeholder="e.g., Midnight fusion Arena"
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2.5 text-xs text-white"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-mono text-neutral-500 uppercase block">Portfolio Category folder</label>
            <select
              value={portfolioForm.category}
              onChange={e => setPortfolioForm(v => ({ ...v, category: e.target.value as any }))}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2 py-2 text-xs text-white"
            >
              <option value="Portraits">Editorial Portraits</option>
              <option value="Graduation">Graduation highlights</option>
              <option value="Family">Family warmth Outdoor</option>
              <option value="Couples">Couples session</option>
              <option value="Events">Corporate and festive Events</option>
              <option value="Branding">Corporate branding mockups</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-mono text-neutral-500 uppercase block">Creative description (optional)</label>
            <input
              type="text"
              value={portfolioForm.description || ''}
              onChange={e => setPortfolioForm(v => ({ ...v, description: e.target.value }))}
              placeholder="Soft sunset shadows captured along coastal cliffs..."
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white"
            />
          </div>

          {/* File input optimizer upload section */}
          {!editingItemId && (
            <div className="space-y-2 pt-2 border-t border-neutral-900">
              <label className="text-[10px] font-mono text-neutral-400 uppercase block">High-Resolution asset upload (Optimizes in-app dynamically to WebP)</label>
              
              <div className="border border-dashed border-neutral-800 rounded-xl p-4 bg-neutral-950/40 text-center text-xs space-y-3">
                <input
                  type="file"
                  accept="image/*"
                  required={!editingItemId && !portfolioForm.imageUrl}
                  onChange={e => handleImageFileChange(e, 'portfolio')}
                  className="hidden"
                  id="uploader-input-port"
                />
                <label 
                  htmlFor="uploader-input-port"
                  className="px-4 py-2 border border-neutral-800 rounded hover:border-neutral-500 inline-block text-[11px] font-mono text-neutral-300 hover:text-white cursor-pointer"
                >
                  Choose Camera File
                </label>
                {uploadProgress && <p className="text-[10px] text-emerald-450 font-mono tracking-tight">{uploadProgress}</p>}
                
                {imageCropPreview && (
                  <div className="w-24 h-24 bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden mx-auto">
                    <img src={imageCropPreview} alt="crop preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => setActiveFormType(null)}
              className="flex-1 py-2.5 rounded border border-neutral-800 text-neutral-450"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded bg-rose-500 text-white font-semibold"
            >
              Publish Portfolio Image
            </button>
          </div>
        </form>
      </Dialog>

      {/* 3. TESTIMONIAL FORM */}
      <Dialog
        isOpen={activeFormType === 'testimonial'}
        onClose={() => setActiveFormType(null)}
        title={editingItemId ? 'Modify Client evaluation' : 'Publish Client Evaluation'}
        size="md"
      >
        <form onSubmit={submitTestimonialForm} className="space-y-4 text-xs">
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-neutral-500 uppercase">Customer Name</label>
              <input
                type="text"
                required
                value={testimonialForm.name}
                onChange={e => setTestimonialForm(v => ({ ...v, name: e.target.value }))}
                placeholder="Elizabeth Vance"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-neutral-500 uppercase">Position / Corporate credentials</label>
              <input
                type="text"
                required
                value={testimonialForm.position}
                onChange={e => setTestimonialForm(v => ({ ...v, position: e.target.value }))}
                placeholder="CEO at VESTIGE Label"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-mono text-neutral-500 uppercase">Testimonial words</label>
            <textarea
              rows={3}
              required
              value={testimonialForm.testimonial}
              onChange={e => setTestimonialForm(v => ({ ...v, testimonial: e.target.value }))}
              placeholder="EMMYSS has designed and transformed..."
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-xs text-white resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 items-center">
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-neutral-500 uppercase">Star Rating scale (1 - 5)</label>
              <input
                type="number"
                min={1}
                max={5}
                required
                value={testimonialForm.rating}
                onChange={e => setTestimonialForm(v => ({ ...v, rating: parseInt(e.target.value) || 5 }))}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white"
              />
            </div>

            {/* Profile upload crop optimizer */}
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-neutral-500 uppercase block">Customer Profile photo</label>
              <input
                type="file"
                accept="image/*"
                onChange={e => handleImageFileChange(e, 'testimonial')}
                className="hidden"
                id="uploader-input-test"
              />
              <label 
                htmlFor="uploader-input-test"
                className="py-2 text-[10px] font-mono text-neutral-300 px-3 cursor-pointer border border-neutral-800 rounded hover:border-neutral-500 inline-block"
              >
                Choose Photo
              </label>
              {imageCropPreview && <span className="text-[9px] text-emerald-400 block mt-1">Image processed.</span>}
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => setActiveFormType(null)}
              className="flex-1 py-2 rounded border border-neutral-800 text-neutral-450"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2 rounded bg-rose-500 text-white font-semibold"
            >
              Commit Testimonial
            </button>
          </div>
        </form>
      </Dialog>

      {/* 4. BLOG FORM */}
      <Dialog
        isOpen={activeFormType === 'blog'}
        onClose={() => setActiveFormType(null)}
        title={editingItemId ? 'Customize Journal Entry' : 'Write Journal Entry'}
        size="xl"
      >
        <form onSubmit={submitBlogForm} className="space-y-5 text-xs font-sans">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Writing Side */}
            <div className="lg:col-span-8 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-neutral-550 uppercase">Article main Title</label>
                <input
                  type="text"
                  required
                  value={blogForm.title}
                  onChange={e => setBlogForm(v => ({ ...v, title: e.target.value }))}
                  placeholder="Mastering the Golden hour photography..."
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-rose-500/50 rounded-xl px-4 py-3 text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-neutral-555 uppercase">Journal markdown rich text content Editor</label>
                <textarea
                  rows={10}
                  required
                  value={blogForm.content}
                  onChange={e => setBlogForm(v => ({ ...v, content: e.target.value }))}
                  placeholder="### Why lighting matters... Detail guidelines and header formats using Markdown syntax..."
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-4 text-xs text-white resize-none font-mono"
                />
              </div>
            </div>

            {/* Config & SEO Metadata Side */}
            <div className="lg:col-span-4 space-y-4 bg-neutral-900/10 p-5 border border-neutral-900 rounded-2xl flex flex-col justify-between">
              <div className="space-y-4">
                <span className="text-[10px] font-mono uppercase text-neutral-500 font-bold block pb-2 border-b border-neutral-900">Config & SEO metadata</span>
                
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-neutral-500 uppercase">Tags Index (Comma-Separated)</label>
                  <input
                    type="text"
                    value={blogForm.tags?.join(', ') || ''}
                    onChange={e => setBlogForm(v => ({ ...v, tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean) }))}
                    placeholder="Lighting, Outdoor, Portraits"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white text-center"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-neutral-500 uppercase">SEO Meta Heading Title</label>
                  <input
                    type="text"
                    value={blogForm.metaTitle || ''}
                    onChange={e => setBlogForm(v => ({ ...v, metaTitle: e.target.value }))}
                    placeholder="Golden Hour portrait guide..."
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white text-center"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-neutral-500 uppercase">SEO Meta description</label>
                  <textarea
                    rows={2}
                    value={blogForm.metaDescription || ''}
                    onChange={e => setBlogForm(v => ({ ...v, metaDescription: e.target.value }))}
                    placeholder="Learn custom light theories..."
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-xs text-white resize-none text-center"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[10px] font-mono text-neutral-400">
                    <span>Banner image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e => handleImageFileChange(e, 'blog')}
                      className="hidden"
                      id="blog-banner-file"
                    />
                    <label htmlFor="blog-banner-file" className="cursor-pointer hover:text-white underline">Choose file</label>
                  </div>
                  <input
                    type="text"
                    value={blogForm.bannerUrl || ''}
                    onChange={e => setBlogForm(v => ({ ...v, bannerUrl: e.target.value }))}
                    placeholder="Provide Banner Photo URL directly"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-[10px] text-neutral-450 text-center mt-1"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 items-center pt-2">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-neutral-500 uppercase">Publish Stage</label>
                    <select
                      value={blogForm.status}
                      onChange={e => setBlogForm(v => ({ ...v, status: e.target.value as any }))}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2 py-1.5 text-xs text-white text-center"
                    >
                      <option value="Draft">Draft (Hidden)</option>
                      <option value="Published">Published (Public)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-neutral-550 uppercase">Category tag</label>
                    <select
                      value={blogForm.category}
                      onChange={e => setBlogForm(v => ({ ...v, category: e.target.value }))}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2 py-1.5 text-xs text-white text-center"
                    >
                      <option value="Creative">Creative Direction</option>
                      <option value="Education">Educational tips</option>
                      <option value="Atelier News">Atelier Announcements</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-6 border-t border-neutral-900 mt-6">
                <button
                  type="button"
                  onClick={() => setActiveFormType(null)}
                  className="flex-1 py-3 border border-neutral-800 rounded-xl text-neutral-400 hover:text-white font-semibold text-xs transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-rose-500 font-semibold text-xs text-white hover:bg-rose-600 transition-colors shadow-lg"
                >
                  Publish Draft Entry
                </button>
              </div>
            </div>
          </div>

        </form>
      </Dialog>

      {/* 5. PROMOTION SPECIFIC FORM */}
      <Dialog
        isOpen={activeFormType === 'promotion'}
        onClose={() => setActiveFormType(null)}
        title={editingItemId ? 'Modify Special Deal Campaign' : 'Configure Campaign Promotion Deal'}
        size="md"
      >
        <form onSubmit={submitPromotionForm} className="space-y-4 text-xs font-sans">
          
          <div className="space-y-1">
            <label className="text-[10px] font-mono text-neutral-500 uppercase">Promotion Campaign short title</label>
            <input
              type="text"
              required
              value={promotionForm.title}
              onChange={e => setPromotionForm(v => ({ ...v, title: e.target.value }))}
              placeholder="e.g., Graduation summer Deals Special"
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-mono text-neutral-500 uppercase">Deal parameters instructions description</label>
            <textarea
              rows={3}
              required
              value={promotionForm.description}
              onChange={e => setPromotionForm(v => ({ ...v, description: e.target.value }))}
              placeholder="Take 15% off complete portraits packages when combined..."
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-xs text-white resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-neutral-500 uppercase">Category Banner file</label>
              <input
                type="file"
                accept="image/*"
                onChange={e => handleImageFileChange(e, 'promotion')}
                className="hidden"
                id="promo-banner-file"
              />
              <label htmlFor="promo-banner-file" className="px-4 py-2 bg-neutral-950 border border-neutral-800 rounded text-[11px] font-mono text-neutral-300 block text-center cursor-pointer">Choose Graphic Banner</label>
            </div>
            
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-neutral-500 uppercase">Operational Status</label>
              <select
                value={promotionForm.status}
                onChange={e => setPromotionForm(v => ({ ...v, status: e.target.value as any }))}
                className="w-full bg-neutral-950 border border-neutral-800 rounded px-2 py-1.5 text-xs text-white text-center"
              >
                <option value="Active">Active Campaign</option>
                <option value="Inactive">Halted / Archive</option>
              </select>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => setActiveFormType(null)}
              className="flex-1 py-2 rounded border border-neutral-800 text-neutral-450"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2 rounded bg-rose-500 text-white font-semibold"
            >
              Commit Promo Deal
            </button>
          </div>
        </form>
      </Dialog>

    </div>
  );
}
