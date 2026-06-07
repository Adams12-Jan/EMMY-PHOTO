/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Camera, 
  ChevronRight, 
  Calendar, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Sparkles, 
  Star, 
  BookOpen, 
  ArrowRight,
  Send,
  SlidersHorizontal,
  Bookmark,
  CheckCircle2,
  CalendarCheck
} from 'lucide-react';
import { AppDatabase, BlogPost, PortfolioItem, ServiceItem, Booking, Enquiry, Promotion } from '../types';
import Dialog from '../components/Dialog';

interface PublicProps {
  db: AppDatabase;
  onRefreshDb: () => void;
  bookingOpen: boolean;
  setBookingOpen: (open: boolean) => void;
}

export default function PublicWebsite({ db, onRefreshDb, bookingOpen, setBookingOpen }: PublicProps) {
  // Page hit logger
  useEffect(() => {
    fetch('/api/analytics/visit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ source: 'Local Referral' })
    })
    .then(() => onRefreshDb())
    .catch(err => console.error('Hit logger error:', err));
  }, []);

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedImage, setSelectedImage] = useState<PortfolioItem | null>(null);
  const [readingPost, setReadingPost] = useState<BlogPost | null>(null);

  // Form states
  const [bookingForm, setBookingForm] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    serviceRequested: '',
    preferredDate: '',
    notes: ''
  });
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState('');

  const [enquiryForm, setEnquiryForm] = useState({
    name: '',
    email: '',
    phone: '',
    serviceRequested: '',
    message: ''
  });
  const [enquirySuccess, setEnquirySuccess] = useState(false);
  const [enquiryError, setEnquiryError] = useState('');

  // Filtering portfolio
  const categories = ['All', 'Portraits', 'Graduation', 'Family', 'Couples', 'Events', 'Branding'];
  const filteredPortfolio = activeCategory === 'All'
    ? db.portfolio
    : db.portfolio.filter(item => item.category === activeCategory);

  // Accent helpers based on Dynamic Settings
  const accentColorClass = db.settings.branding.accentColor === 'emerald' ? 'text-emerald-400' 
    : db.settings.branding.accentColor === 'sky' ? 'text-sky-400'
    : db.settings.branding.accentColor === 'rose' ? 'text-rose-400'
    : db.settings.branding.accentColor === 'purple' ? 'text-purple-400'
    : 'text-amber-400';

  const accentBgClass = db.settings.branding.accentColor === 'emerald' ? 'bg-emerald-500 hover:bg-emerald-600 focus:ring-emerald-500/20' 
    : db.settings.branding.accentColor === 'sky' ? 'bg-sky-500 hover:bg-sky-600 focus:ring-sky-500/20'
    : db.settings.branding.accentColor === 'rose' ? 'bg-rose-500 hover:bg-rose-600 focus:ring-rose-500/20'
    : db.settings.branding.accentColor === 'purple' ? 'bg-purple-500 hover:bg-purple-600 focus:ring-purple-500/20'
    : 'bg-amber-500 hover:bg-amber-600 focus:ring-amber-500/20';

  const accentBorderClass = db.settings.branding.accentColor === 'emerald' ? 'border-emerald-500/20 hover:border-emerald-500 text-emerald-400' 
    : db.settings.branding.accentColor === 'sky' ? 'border-sky-500/20 hover:border-sky-500 text-sky-400'
    : db.settings.branding.accentColor === 'rose' ? 'border-rose-500/20 hover:border-rose-500 text-rose-400'
    : db.settings.branding.accentColor === 'purple' ? 'border-purple-500/20 hover:border-purple-500 text-purple-400'
    : 'border-amber-500/20 hover:border-amber-500 text-amber-400';

  const accentRingClass = db.settings.branding.accentColor === 'emerald' ? 'focus:ring-emerald-500/30 focus:border-emerald-500' 
    : db.settings.branding.accentColor === 'sky' ? 'focus:ring-sky-500/30 focus:border-sky-500'
    : db.settings.branding.accentColor === 'rose' ? 'focus:ring-rose-500/30 focus:border-rose-500'
    : db.settings.branding.accentColor === 'purple' ? 'focus:ring-purple-500/30 focus:border-purple-500'
    : 'focus:ring-amber-500/30 focus:border-amber-500';

  // Booking Form Submission
  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingError('');
    setBookingSuccess(false);

    if (!bookingForm.customerName || !bookingForm.customerEmail || !bookingForm.customerPhone || !bookingForm.serviceRequested || !bookingForm.preferredDate) {
      setBookingError('All fields with asterisks (*) are required.');
      return;
    }

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingForm)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to request booking.');

      setBookingSuccess(true);
      setBookingForm({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        serviceRequested: '',
        preferredDate: '',
        notes: ''
      });
      onRefreshDb();
    } catch (err: any) {
      setBookingError(err.message || 'Server error occurred.');
    }
  };

  // Contact Enquiry Submission
  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnquiryError('');
    setEnquirySuccess(false);

    if (!enquiryForm.name || !enquiryForm.email || !enquiryForm.phone || !enquiryForm.message) {
      setEnquiryError('Please fill out all contact fields.');
      return;
    }

    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(enquiryForm)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit contact enquiry.');

      setEnquirySuccess(true);
      setEnquiryForm({
        name: '',
        email: '',
        phone: '',
        serviceRequested: '',
        message: ''
      });
      onRefreshDb();
    } catch (err: any) {
      setEnquiryError(err.message || 'Server error occurred.');
    }
  };

  const activePromotions = db.promotions.filter(p => p.status === 'Active');
  const activeServices = db.services.filter(s => s.status === 'Active');
  const publishedBlogPosts = db.blog.filter(post => post.status === 'Published');

  const handleBookWithService = (serviceName: string) => {
    setBookingForm(prev => ({ ...prev, serviceRequested: serviceName }));
    setBookingOpen(true);
  };

  const scrollToSection = (id: string) => {
    const element = document.querySelector(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-[#09090b] min-h-screen text-[#fafafa] flex flex-col font-sans selection:bg-[#F5C400]/20 selection:text-white">
      
      {/* 1. HERO BANNER */}
      <header className="relative min-h-screen flex items-center justify-center p-6 bg-radial from-[#18181b]/60 to-[#09090b] overflow-hidden">
        {/* Background Visual Blobs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-amber-500/5 blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] rounded-full bg-[#009CA6]/5 blur-3xl" />

        {/* Dynamic Backgrid Image Overlay for Premium Atmosphere */}
        <div className="absolute inset-0 opacity-10 mix-blend-color-dodge bg-cover bg-center pointer-events-none" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1600&q=80')` }} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/75 to-[#09090b]/20 pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center space-y-8 px-4 z-10 flex flex-col items-center">
          
          {/* Subtle Accent Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#27272a] bg-[#18181b]/60 text-[#a1a1aa] text-[10px] font-mono tracking-widest uppercase">
            <Sparkles className={`w-3.5 h-3.5 ${accentColorClass}`} />
            <span>FINE ART ATELIER</span>
            <span className="text-[#71717a]">•</span>
            <span className="font-serif italic lowercase tracking-normal text-[#F5C400] font-semibold text-[11px] select-none">shoot. create. inspire.</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-8xl font-display font-black tracking-tight text-white max-w-4xl text-center leading-[1.05] uppercase">
            {db.hero.title}
          </h1>

          <p className="text-sm sm:text-lg text-[#a1a1aa] font-sans max-w-2xl leading-relaxed">
            {db.hero.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
            <button
              onClick={() => setBookingOpen(true)}
              className={`w-full sm:w-auto px-8 py-4 rounded-full text-xs font-bold tracking-widest uppercase text-white shadow-xl cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 ${accentBgClass}`}
            >
              {db.hero.primaryCtaText}
            </button>
            <button
              onClick={() => scrollToSection('#portfolio')}
              className="w-full sm:w-auto px-8 py-4 rounded-full text-xs font-bold tracking-widest uppercase border border-[#27272a] hover:border-neutral-500 text-neutral-200 hover:text-white bg-[#18181b]/20 hover:bg-[#09090b]/40 cursor-pointer transition-all duration-300"
            >
              {db.hero.secondaryCtaText}
            </button>
          </div>

        </div>

        {/* Scroll down hint */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer z-10 opacity-60 hover:opacity-100 transition-opacity" onClick={() => scrollToSection('#portfolio')}>
          <span className="text-[10px] font-mono tracking-widest uppercase text-neutral-400 text-center">SCROLL ATELIER</span>
          <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" />
        </div>
      </header>

      {/* 2. DYNAMIC PROMOTIONS PACKAGES ALERT */}
      {activePromotions.length > 0 && (
        <section id="promotions" className="bg-[#09090b] py-24 border-t border-[#27272a] relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center text-center space-y-4 mb-16">
              <span className={`text-xs font-bold tracking-widest uppercase font-mono ${accentColorClass}`}>EXCLUSIVE OFFERS</span>
              <h2 className="text-3xl sm:text-4xl font-display font-black tracking-tight text-white uppercase">Active Promotions & Specials</h2>
              <div className="h-0.5 w-12 bg-[#27272a]" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {activePromotions.map((promo) => (
                <div 
                  key={promo.id} 
                  className="flex flex-col sm:flex-row bg-[#18181b] border border-[#27272a] rounded-2xl overflow-hidden hover:border-neutral-500 transition-all duration-300"
                >
                  <div className="sm:w-2/5 relative h-48 sm:h-auto min-h-[180px]">
                    <img 
                      src={promo.bannerUrl} 
                      alt={promo.title}
                      referrerPolicy="no-referrer"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#18181b]/90 sm:to-[#18181b]/40" />
                  </div>
                  <div className="sm:w-3/5 p-6 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-mono bg-[#F5C400]/10 text-[#F5C400] font-semibold tracking-wide uppercase">Campaign Open</span>
                      <h3 className="text-base font-bold text-white tracking-tight">{promo.title}</h3>
                      <p className="text-xs text-[#a1a1aa] leading-relaxed">{promo.description}</p>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-[#27272a] text-[10px] font-mono text-[#71717a]">
                      <span>Ends: {promo.endDate}</span>
                      <button 
                        onClick={() => handleBookWithService(promo.title)}
                        className={`text-xs font-bold hover:underline flex items-center gap-1 ${accentColorClass}`}
                      >
                        Claim deal <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 3. GALERIE & PORTFOLIO */}
      <section id="portfolio" className="bg-[#09090b] py-24 border-t border-[#27272a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="space-y-3">
              <span className={`text-xs font-bold tracking-widest uppercase font-mono ${accentColorClass}`}>CURATED MUSEUM</span>
              <h2 className="text-3xl sm:text-4xl font-display font-black tracking-tight text-white uppercase leading-none">Our Creative Portfolios</h2>
              <p className="text-xs text-[#a1a1aa] max-w-md font-sans">Filtered by dynamic categories maintained directly by EMMYSS staff from the CMS admin portal.</p>
            </div>

            {/* Category selection */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-[#18181b]/60 border border-[#27272a] self-start">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-sans transition-all cursor-pointer ${
                    activeCategory === cat 
                      ? 'bg-[#27272a] text-white shadow-xs font-medium' 
                      : 'text-[#a1a1aa] hover:text-white hover:bg-[#18181b]/20'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Image grid */}
          {filteredPortfolio.length === 0 ? (
            <div className="py-24 text-center border border-dashed border-[#27272a] rounded-xl bg-[#18181b]/35">
              <Camera className="w-8 h-8 text-neutral-600 mx-auto mb-3" />
              <h3 className="text-sm font-semibold text-white">Empty Portfolio Category</h3>
              <p className="text-xs text-neutral-500 mt-1">Log in to /admin to upload and assign magnificent pictures.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPortfolio.map((item, idx) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedImage(item)}
                  className="group relative aspect-4/3 rounded-xl overflow-hidden bg-[#18181b] border border-[#27272a] cursor-pointer hover:border-neutral-500 transition-all duration-300 transform hover:-translate-y-1"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  {/* Overlay grad */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-6" />
                  <div className="absolute bottom-0 left-0 right-0 p-5 transform translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 flex flex-col">
                    <span className="text-[10px] font-mono text-[#F5C400] uppercase tracking-widest">{item.category}</span>
                    <h4 className="text-sm font-bold text-white tracking-tight mt-1">{item.title}</h4>
                    {item.description && <p className="text-[11px] text-[#a1a1aa] truncate mt-0.5">{item.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </section>

      {/* 4. ATELIER SERVICES & PRICES */}
      <section id="services" className="bg-[#09090b] py-24 border-t border-[#27272a] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col items-center text-center space-y-4 mb-16">
            <span className={`text-xs font-bold tracking-widest uppercase font-mono ${accentColorClass}`}>OUR COMMISSIONS</span>
            <h2 className="text-3xl sm:text-4xl font-display font-black tracking-tight text-white uppercase">Photography & Art Services</h2>
            <div className="h-0.5 w-12 bg-[#27272a]" />
            <p className="text-xs text-[#a1a1aa] max-w-md font-sans">Crafted packages to elevate your story. Select a service to initiate booking.</p>
          </div>

          {activeServices.length === 0 ? (
            <div className="py-24 text-center">
              <p className="text-xs text-[#71717a]">No active services setup. Customize services on the admin portal.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {activeServices.map((service) => (
                <div 
                  key={service.id}
                  className="bg-[#18181b] border border-[#27272a] rounded-xl p-8 hover:border-neutral-500 transition-all duration-300 flex flex-col justify-between group h-full"
                >
                  <div className="space-y-6">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-mono font-bold text-[#F5C400] uppercase tracking-widest bg-[#F5C400]/10 px-2 py-1 rounded-sm">
                          {service.category}
                        </span>
                        <h3 className="text-lg font-bold text-white tracking-tight pt-1.5 group-hover:text-[#F5C400] transition-colors font-display">
                          {service.name}
                        </h3>
                      </div>
                      {service.price && (
                        <div className="text-right">
                          <span className={`text-xl font-bold font-mono text-[#F5C400]`}>
                            {service.price}
                          </span>
                          <p className="text-[9px] text-[#71717a] tracking-tight mt-0.5 font-mono">ESTIMATED RATE</p>
                        </div>
                      )}
                    </div>
                    
                    <p className="text-xs text-[#a1a1aa] leading-relaxed font-sans">
                      {service.description}
                    </p>
                  </div>

                  <div className="pt-8 border-t border-[#27272a] mt-6 flex items-center justify-between">
                    <button
                      onClick={() => handleBookWithService(service.name)}
                      className={`px-4 py-2 text-xs font-semibold tracking-wider font-sans uppercase rounded-full cursor-pointer border text-center transition-all ${accentBorderClass}`}
                    >
                      Book Shoot
                    </button>
                    {service.featured && (
                      <span className="flex items-center gap-1 text-[10px] font-mono text-amber-400">
                        <Star className="w-3 h-3 fill-amber-400" /> Featured Commission
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </section>

      {/* 5. CLIENT TESTIMONIALS */}
      <section className="bg-[#09090b] py-24 border-t border-[#27272a] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center space-y-4 mb-16">
            <span className={`text-xs font-bold tracking-widest uppercase font-mono ${accentColorClass}`}>CLIENT RETROSPECTIVE</span>
            <h2 className="text-3xl sm:text-4xl font-display font-black tracking-tight text-white uppercase">Bespoke Reviews & Feedback</h2>
            <div className="h-0.5 w-12 bg-[#27272a]" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {db.testimonials.map((test) => (
              <div 
                key={test.id}
                className="bg-[#18181b] border border-[#27272a] rounded-xl p-8 flex flex-col justify-between space-y-6 hover:border-neutral-500 transition-all duration-300"
              >
                <div className="space-y-4">
                  {/* Rating */}
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 ${i < test.rating ? 'fill-[#F5C400] text-[#F5C400]' : 'text-[#27272a]'}`} 
                      />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed italic font-serif">
                    "{test.testimonial}"
                  </p>
                </div>

                <div className="flex items-center gap-4 pt-4 border-t border-[#27272a]/60">
                  <img
                    src={test.imageUrl}
                    alt={test.name}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-full object-cover border border-[#27272a]"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-white tracking-tight">{test.name}</h4>
                    <p className="text-[10px] text-[#71717a] font-mono mt-0.5">{test.position}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CREATIVE BLOG & NEWS */}
      {publishedBlogPosts.length > 0 && (
        <section id="blog" className="bg-[#09090b] py-24 border-t border-[#27272a]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="flex flex-col items-center text-center space-y-4 mb-16">
              <span className={`text-xs font-bold tracking-widest uppercase font-mono ${accentColorClass}`}>CREATIVE WRITING</span>
              <h2 className="text-3xl sm:text-4xl font-display font-black tracking-tight text-white uppercase">The Studio Journal</h2>
              <div className="h-0.5 w-12 bg-[#27272a]" />
              <p className="text-xs text-[#a1a1aa] max-w-sm">Editorial journals written directly by our staff to share photography aesthetics tips.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {publishedBlogPosts.map((post) => (
                <article 
                  key={post.id}
                  className="bg-[#18181b] border border-[#27272a] rounded-xl overflow-hidden hover:border-neutral-500 transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="relative h-44 bg-neutral-800">
                    <img 
                      src={post.bannerUrl} 
                      alt={post.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4 p-1.5 px-3 rounded bg-[#09090b]/85 backdrop-blur-xs text-[10px] text-white tracking-widest uppercase font-mono border border-[#27272a]">
                      {post.category}
                    </div>
                  </div>

                  <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-3">
                      <span className="text-[9px] text-[#71717a] font-mono block">Published: {post.publishedDate}</span>
                      <h3 className="text-base font-bold text-white tracking-tight leading-snug hover:text-white transition-colors line-clamp-2 font-display">
                        {post.title}
                      </h3>
                      <p className="text-xs text-[#a1a1aa] leading-relaxed line-clamp-3">
                        {post.excerpt}
                      </p>
                    </div>

                    <div className="pt-6 border-t border-[#27272a] mt-4">
                      <button
                        onClick={() => setReadingPost(post)}
                        className={`text-xs font-bold hover:underline flex items-center gap-1 cursor-pointer ${accentColorClass}`}
                      >
                        Read Journal <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

          </div>
        </section>
      )}

      {/* 7. ABOUT THE ATELIER */}
      <section id="about" className="bg-[#09090b] py-24 border-t border-[#27272a]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
            <div className="md:col-span-5 space-y-3">
              <span className={`text-xs font-bold tracking-widest uppercase font-mono ${accentColorClass}`}>ABOUT THE ATELIER</span>
              <h2 className="text-3xl font-display font-black tracking-tight text-white uppercase">Preserving Elegant Storytelling</h2>
              <div className="h-0.5 w-12 bg-[#27272a]" />
            </div>
            <div className="md:col-span-7">
              <p className="text-xs sm:text-sm text-[#a1a1aa] leading-relaxed font-sans">
                {db.about.description}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8 border-t border-[#27272a]">
            <div className="space-y-3">
              <h3 className="text-xs font-mono font-semibold tracking-widest uppercase text-white flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#F5C400] rounded-full" /> Dynamic Mission Statement
              </h3>
              <p className="text-xs text-[#a1a1aa] leading-relaxed font-sans">
                {db.about.mission}
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="text-xs font-mono font-semibold tracking-widest uppercase text-white flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#F5C400] rounded-full" /> Our Corporate Story
              </h3>
              <p className="text-xs text-[#a1a1aa] leading-relaxed font-sans">
                {db.about.story}
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 8. CONTACT & LEAD SUBMISSIONS FORM */}
      <section id="contact" className="bg-[#09090b] py-24 border-t border-[#27272a] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Info Side */}
            <div className="lg:col-span-5 space-y-8 flex flex-col justify-center">
              <div className="space-y-3">
                <span className={`text-xs font-bold tracking-widest uppercase font-mono ${accentColorClass}`}>CONTACT COORDINATOR</span>
                <h2 className="text-3xl sm:text-4xl font-display font-black tracking-tight text-white uppercase">HAVE AN INCOMING CONCEPT?</h2>
                <p className="text-xs text-[#a1a1aa] leading-relaxed">
                  Discuss corporate license commissions, couples events sessions, graduation deals, or general design requests. Our representative monitors queues and assigns dedicated specialists.
                </p>
              </div>

              <div className="space-y-4 text-xs font-sans text-[#a1a1aa]">
                <div className="flex items-center gap-3">
                  <div className="p-2 border border-[#27272a] rounded bg-[#18181b]">
                    <MapPin className="w-4.5 h-4.5 text-[#F5C400]" />
                  </div>
                  <span>{db.settings.business.address}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 border border-[#27272a] rounded bg-[#18181b]">
                    <Phone className="w-4.5 h-4.5 text-[#F5C400]" />
                  </div>
                  <span>{db.settings.business.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 border border-[#27272a] rounded bg-[#18181b]">
                    <Mail className="w-4.5 h-4.5 text-[#F5C400]" />
                  </div>
                  <span>{db.settings.business.email}</span>
                </div>
              </div>
            </div>

            {/* Form Side */}
            <div className="lg:col-span-7 bg-[#18181b] border border-[#27272a] rounded-xl p-8 sm:p-10">
              <form onSubmit={handleEnquirySubmit} className="space-y-6">
                
                {enquirySuccess ? (
                  <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex flex-col items-center text-center space-y-3">
                    <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                    <h3 className="text-white font-semibold text-sm">Enquiry Dispatched Gracefully</h3>
                    <p className="text-xs text-[#a1a1aa] max-w-sm leading-relaxed font-sans">Thank you. An automated notification alert has been logged for EMMYSS staff. Check the admin console logs to track outgoing simulation replies.</p>
                    <button
                      type="button"
                      onClick={() => setEnquirySuccess(false)}
                      className="px-4 py-1.5 rounded-full bg-[#27272a] hover:bg-neutral-700 text-xs text-white"
                    >
                      Submit Another
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono tracking-widest uppercase text-[#a1a1aa] block">Name *</label>
                        <input
                          type="text"
                          required
                          value={enquiryForm.name}
                          onChange={e => setEnquiryForm(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Elizabeth Vance"
                          className={`w-full px-4 py-3 rounded-xl bg-[#09090b] border border-[#27272a] text-xs text-white placeholder-neutral-600 focus:outline-hidden transition-all ${accentRingClass}`}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono tracking-widest uppercase text-[#a1a1aa] block">Email *</label>
                        <input
                          type="email"
                          required
                          value={enquiryForm.email}
                          onChange={e => setEnquiryForm(prev => ({ ...prev, email: e.target.value }))}
                          placeholder="elizabeth@example.com"
                          className={`w-full px-4 py-3 rounded-xl bg-[#09090b] border border-[#27272a] text-xs text-white placeholder-neutral-600 focus:outline-hidden transition-all ${accentRingClass}`}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono tracking-widest uppercase text-[#a1a1aa] block">Phone *</label>
                        <input
                          type="tel"
                          required
                          value={enquiryForm.phone}
                          onChange={e => setEnquiryForm(prev => ({ ...prev, phone: e.target.value }))}
                          placeholder="+1 (555) 019-9822"
                          className={`w-full px-4 py-3 rounded-xl bg-[#09090b] border border-[#27272a] text-xs text-white placeholder-neutral-600 focus:outline-hidden transition-all ${accentRingClass}`}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono tracking-widest uppercase text-[#a1a1aa] block">Associated Service</label>
                        <select
                          value={enquiryForm.serviceRequested}
                          onChange={e => setEnquiryForm(prev => ({ ...prev, serviceRequested: e.target.value }))}
                          className={`w-full px-4 py-3 rounded-xl bg-[#09090b] border border-[#27272a] text-xs text-white focus:outline-hidden transition-all ${accentRingClass}`}
                        >
                          <option value="">General Custom Request</option>
                          {db.services.map(s => (
                            <option key={s.id} value={s.name}>{s.name} ({s.category})</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono tracking-widest uppercase text-[#a1a1aa] block">Detail your Concept *</label>
                      <textarea
                        required
                        rows={4}
                        value={enquiryForm.message}
                        onChange={e => setEnquiryForm(prev => ({ ...prev, message: e.target.value }))}
                        placeholder="Detail dates, artistic directions, scale, or requirements..."
                        className={`w-full px-4 py-3 rounded-xl bg-[#09090b] border border-[#27272a] text-xs text-white placeholder-neutral-600 focus:outline-hidden transition-all resize-none ${accentRingClass}`}
                      />
                    </div>

                    {enquiryError && (
                      <p className="text-xs text-rose-450 tracking-tight font-medium">{enquiryError}</p>
                    )}

                    <button
                      type="submit"
                      className={`w-full py-4 rounded-xl text-xs font-bold tracking-widest uppercase text-white shadow-xl cursor-pointer transition-all flex items-center justify-center gap-2 ${accentBgClass}`}
                    >
                      <span>Send Message</span>
                      <Send className="w-4 h-4" />
                    </button>
                  </>
                )}

              </form>
            </div>
          </div>
        </div>
      </section>

      {/* --- ALL REUSABLE DIALOG OVERLAYS FOR CUSTOMER FLOW --- */}

      {/* 1. BOOKING SCHEDULER POPUP */}
      <Dialog
        isOpen={bookingOpen}
        onClose={() => setBookingOpen(false)}
        title="Schedule your Dynamic Session Session"
        size="md"
      >
        <form onSubmit={handleBookingSubmit} className="space-y-5">
          {bookingSuccess ? (
            <div className="p-8 text-center space-y-4">
              <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mx-auto rounded-full flex items-center justify-center">
                <CalendarCheck className="w-6 h-6" />
              </div>
              <h4 className="text-white font-semibold text-sm">Booking Requested Successfully!</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Thank you. We have logged booking alerts and customer verification emails. Our team will verify your desired session date shortly.
              </p>
              <button
                type="button"
                onClick={() => { setBookingSuccess(false); setBookingOpen(false); }}
                className={`w-full py-2 rounded-xl text-xs font-bold text-white uppercase ${accentBgClass}`}
              >
                Done
              </button>
            </div>
          ) : (
            <>
              <p className="text-[11px] text-[#a1a1aa] leading-relaxed font-sans mt-1">
                Configure your desired session options to submit booking records. Business coordinators will follow up to lock in details.
              </p>
              
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-[#a1a1aa]">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={bookingForm.customerName}
                    onChange={e => setBookingForm(prev => ({ ...prev, customerName: e.target.value }))}
                    placeholder="Marcus Aurelius"
                    className={`w-full px-4 py-3 rounded-xl bg-[#09090b] border border-[#27272a] text-xs text-white focus:outline-hidden ${accentRingClass}`}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-[#a1a1aa]">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={bookingForm.customerEmail}
                      onChange={e => setBookingForm(prev => ({ ...prev, customerEmail: e.target.value }))}
                      placeholder="marcus@example.com"
                      className={`w-full px-4 py-3 rounded-xl bg-[#09090b] border border-[#27272a] text-xs text-white focus:outline-hidden ${accentRingClass}`}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-[#a1a1aa]">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={bookingForm.customerPhone}
                      onChange={e => setBookingForm(prev => ({ ...prev, customerPhone: e.target.value }))}
                      placeholder="+1 (555) 018-9122"
                      className={`w-full px-4 py-3 rounded-xl bg-[#09090b] border border-[#27272a] text-xs text-white focus:outline-hidden ${accentRingClass}`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-[#a1a1aa]">Desired Service *</label>
                    <select
                      required
                      value={bookingForm.serviceRequested}
                      onChange={e => setBookingForm(prev => ({ ...prev, serviceRequested: e.target.value }))}
                      className={`w-full px-4 py-3 rounded-xl bg-[#09090b] border border-[#27272a] text-xs text-white focus:outline-hidden ${accentRingClass}`}
                    >
                      <option value="">Select Atelier Service</option>
                      {db.services.map(s => (
                        <option key={s.id} value={s.name}>{s.name} ({s.category})</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-[#a1a1aa]">Preferred Session Date *</label>
                    <input
                      type="date"
                      required
                      value={bookingForm.preferredDate}
                      onChange={e => setBookingForm(prev => ({ ...prev, preferredDate: e.target.value }))}
                      className={`w-full px-4 py-3 rounded-xl bg-[#09090b] border border-[#27272a] text-xs text-white focus:outline-hidden ${accentRingClass}`}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-[#a1a1aa]">Special Requests / Style Notes</label>
                  <textarea
                    rows={3}
                    value={bookingForm.notes}
                    onChange={e => setBookingForm(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Let us know if you prefer scenic outdoor campuses, monochrome high contrast editorial backdrops, custom props or other ideas..."
                    className={`w-full px-4 py-3 rounded-xl bg-[#09090b] border border-[#27272a] text-xs text-white resize-none focus:outline-hidden ${accentRingClass}`}
                  />
                </div>
              </div>

              {bookingError && (
                <p className="text-xs text-rose-450 font-medium tracking-tight">{bookingError}</p>
              )}

              <div className="flex gap-4 pt-3">
                <button
                  type="button"
                  onClick={() => setBookingOpen(false)}
                  className="flex-1 py-3 border border-[#27272a] rounded-xl text-[#a1a1aa] hover:text-white text-xs font-bold uppercase tracking-wider bg-transparent cursor-pointer hover:bg-[#18181b]/40 transition-colors"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className={`flex-1 py-3 rounded-xl text-xs font-bold text-white uppercase tracking-wider cursor-pointer shadow-xl ${accentBgClass}`}
                >
                  Request Appointment
                </button>
              </div>
            </>
          )}
        </form>
      </Dialog>

      {/* 2. PORTFOLIO IMAGE ZOOM LIGHTBOX */}
      <Dialog
        isOpen={selectedImage !== null}
        onClose={() => setSelectedImage(null)}
        title={selectedImage?.title || 'Gallerie Zoom'}
        size="lg"
      >
        {selectedImage && (
          <div className="space-y-5">
            <div className="aspect-16/10 rounded-xl overflow-hidden bg-black border border-neutral-800 relative">
              <img
                src={selectedImage.imageUrl}
                alt={selectedImage.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest block">{selectedImage.category}</span>
                <p className="text-xs text-neutral-400 italic">"{selectedImage.description || 'No description captured.'}"</p>
              </div>
              <button
                onClick={() => {
                  const s = selectedImage.category;
                  setSelectedImage(null);
                  handleBookWithService(`${s} Session`);
                }}
                className={`py-2 px-5 hover:scale-[1.02] active:-scale-95 transition-all text-xs font-bold text-white uppercase tracking-wider rounded-xl cursor-pointer ${accentBgClass}`}
              >
                Inquire Similar Style
              </button>
            </div>
          </div>
        )}
      </Dialog>

      {/* 3. INDIVIDUAL PUBLISHED BLOG POST FULL WRITING READER */}
      <Dialog
        isOpen={readingPost !== null}
        onClose={() => setReadingPost(null)}
        title={readingPost?.title || 'Atelier Journal Writer'}
        size="lg"
      >
        {readingPost && (
          <div className="space-y-6">
            <div className="h-56 rounded-xl overflow-hidden relative">
              <img
                src={readingPost.bannerUrl}
                alt={readingPost.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 to-transparent" />
              <div className="absolute bottom-4 left-6 space-y-1.5">
                <span className="text-[9px] font-mono tracking-widest uppercase bg-neutral-950/80 px-2 py-0.5 text-rose-400 rounded-sm border border-neutral-800 inline-block">
                  {readingPost.category}
                </span>
                <h4 className="text-sm font-bold text-neutral-300 font-mono">Published {readingPost.publishedDate}</h4>
              </div>
            </div>

            <article className="prose prose-invert prose-xs max-w-none text-neutral-300 space-y-4">
              {/* Splitting standard markdown formatted output into elegant block lines */}
              {readingPost.content.split('\n\n').map((paragraph, index) => {
                if (paragraph.startsWith('### ')) {
                  return <h3 key={index} className="text-base font-bold text-white font-sans uppercase tracking-tight mt-6 mb-2 border-b border-neutral-800 pb-1.5">{paragraph.slice(4)}</h3>;
                }
                if (paragraph.startsWith('#### ')) {
                  return <h4 key={index} className="text-sm font-semibold text-rose-450 font-sans tracking-wide mt-4 mb-1">{paragraph.slice(5)}</h4>;
                }
                if (paragraph.startsWith('1. ') || paragraph.startsWith('* ')) {
                  return (
                    <ul key={index} className="list-disc pl-6 space-y-1.5 text-xs text-neutral-400 my-2">
                      {paragraph.split('\n').map((li, i) => (
                        <li key={i}>{li.replace(/^\d+\.\s+\*\*/, '').replace(/^\*\s+\*\*/, '').replace(/\*\*/g, '').replace(/^\d+\.\s+/, '').replace(/^\*\s+/, '')}</li>
                      ))}
                    </ul>
                  );
                }
                return <p key={index} className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-sans">{paragraph}</p>;
              })}
            </article>

            {/* Tags wrapper */}
            {readingPost.tags && readingPost.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 pt-6 border-t border-neutral-900">
                <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wide">INDEX TAGS:</span>
                {readingPost.tags.map(tag => (
                  <span key={tag} className="px-2 py-0.5 rounded-sm bg-neutral-900 border border-neutral-800 text-[10px] text-neutral-400">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            <button
              onClick={() => setReadingPost(null)}
              className="w-full py-3 bg-neutral-900 border border-neutral-800 hover:border-neutral-600 rounded-xl text-neutral-400 hover:text-white text-xs font-bold uppercase tracking-widest cursor-pointer"
            >
              Exit Journal Reading
            </button>
          </div>
        )}
      </Dialog>

    </div>
  );
}
