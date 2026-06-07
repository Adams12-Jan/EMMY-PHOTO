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
  CalendarCheck,
  ShieldCheck,
  Brush,
  Zap,
  Tv,
  Compass,
  Sliders,
  Eye,
  Check,
  Activity,
  Video,
  Palette
} from 'lucide-react';
import { AppDatabase, BlogPost, PortfolioItem, ServiceItem, Booking, Enquiry, Promotion } from '../types';
import Dialog from '../components/Dialog';
import { motion, AnimatePresence } from 'motion/react';
import { apiFetch } from '../utils/api';

const initialAestheticItems: PortfolioItem[] = [
  {
    id: 'port-aesthetic-1',
    title: 'Amber Studio Serenity',
    category: 'Portraits',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    description: 'Minimalist editorial studio portrait capturing soft gold lighting.',
    order: 1
  },
  {
    id: 'port-aesthetic-2',
    title: 'Monochrome Shadow Mood',
    category: 'Portraits',
    imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
    description: 'High contrast editorial portrait detailing dramatic light falloff.',
    order: 2
  },
  {
    id: 'port-aesthetic-3',
    title: 'The Cap Throw',
    category: 'Graduation',
    imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80',
    description: 'Classic emotional candid at the graduation stage exit.',
    order: 3
  },
  {
    id: 'port-aesthetic-4',
    title: 'Stanford Archways',
    category: 'Graduation',
    imageUrl: 'https://images.unsplash.com/photo-1627556704302-624286467c65?auto=format&fit=crop&w=800&q=80',
    description: 'Golden sunlight portraits set against historical stone arches.',
    order: 4
  },
  {
    id: 'port-aesthetic-5',
    title: 'Warm Sunday Picnic',
    category: 'Family',
    imageUrl: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=800&q=80',
    description: 'Golden hour picnic session highlighting genuine family smiles.',
    order: 5
  },
  {
    id: 'port-aesthetic-6',
    title: 'Backyard Laughter',
    category: 'Family',
    imageUrl: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=800&q=80',
    description: 'Pure, unscripted joy in a warm outdoor backyard garden layout.',
    order: 6
  },
  {
    id: 'port-aesthetic-7',
    title: 'Sea Breeze & Sunsets',
    category: 'Couples',
    imageUrl: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=800&q=80',
    description: 'Intimate sunset couple shoot on the rocky shoreline.',
    order: 7
  },
  {
    id: 'port-aesthetic-8',
    title: 'Embracing on Golden Sand',
    category: 'Couples',
    imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
    description: 'Beautiful editorial wedding romance in natural seaside lighting.',
    order: 8
  },
  {
    id: 'port-aesthetic-9',
    title: 'Midnight Fusion Arena',
    category: 'Events',
    imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80',
    description: 'High dynamic range capture of stage fog and magenta neon flares.',
    order: 9
  },
  {
    id: 'port-aesthetic-10',
    title: 'Gala Bokeh Speeches',
    category: 'Events',
    imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
    description: 'Elegant commercial gala keynotes captured under gorgeous background bokeh lights.',
    order: 10
  },
  {
    id: 'port-aesthetic-11',
    title: 'Concrete Brand Identity',
    category: 'Branding',
    imageUrl: 'https://images.unsplash.com/photo-1542744094-3a31f103e35f?auto=format&fit=crop&w=800&q=80',
    description: 'Minimalist workspace asset mockups representing professional branding aesthetics.',
    order: 11
  },
  {
    id: 'port-aesthetic-12',
    title: 'Noir Atelier Workspace',
    category: 'Branding',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    description: 'Sleek design agency brand assets and dynamic desk elements.',
    order: 12
  },
  {
    id: 'port-aesthetic-13',
    title: 'Glow In The Dark',
    category: 'Portraits',
    imageUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=800&q=80',
    description: 'Stunning direct flash studio capture with moody twilight textures.',
    order: 13
  },
  {
    id: 'port-aesthetic-14',
    title: 'Forest Pathway Session',
    category: 'Couples',
    imageUrl: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=800&q=80',
    description: 'Wholesome session deep within pristine misty pine woods.',
    order: 14
  },
  {
    id: 'port-aesthetic-15',
    title: 'The Gown Showcase',
    category: 'Graduation',
    imageUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80',
    description: 'Classic university library portraits honoring high academic standard achievements.',
    order: 15
  },
  {
    id: 'port-aesthetic-16',
    title: 'Corporate Symphony',
    category: 'Branding',
    imageUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80',
    description: 'Professional visual identities detailing premium editorial corporate teams.',
    order: 16
  }
];

const replicatedServices = [
  {
    id: "photography",
    title: "Photography",
    description: "Capturing details, feelings, and frozen moments in time with state-of-the-art sensory lighting and high-definition clarity.",
    iconName: "Camera",
    details: [
      {
        title: "Portrait Photography",
        items: [
          "Editorial & Fashion Portraits",
          "Professional LinkedIn Headshots",
          "Creative Studio Lighting Portraits",
          "Fine-Art Artistic Retouching"
        ]
      },
      {
        title: "Event Photography",
        items: [
          "High-Society Weddings & Receptions",
          "Corporate Galas & Networking Sumits",
          "Concert & Music Festival Coverage",
          "Anniversaries & Private Jubilees"
        ]
      },
      {
        title: "Commercial & Branding",
        items: [
          "Visual Product Spotlights",
          "Luxury Corporate Environment Shoots",
          "Social Media Content Packages",
          "E-commerce Listing Enhancement"
        ]
      }
    ]
  },
  {
    id: "videography",
    title: "Videography",
    description: "Cinematic film production, storytelling, and high-frequency movement capture that conveys deep emotional depth.",
    iconName: "Video",
    details: [
      {
        title: "Event Coverage",
        items: [
          "Complete Wedding Film Packages",
          "Highlight Reels & Sizzle Tapes",
          "Multicamera Live-Stream Setups",
          "Keynote & Corporate Presentation Recap"
        ]
      },
      {
        title: "Promotional & Commercial",
        items: [
          "Cinematic Brand Story Videos",
          "Product Advertisement Loops",
          "High-Impact Social Ad Campaigns",
          "Real Estate Aerial Video Flights"
        ]
      },
      {
        title: "Post-Production Care",
        items: [
          "Premium Hollywood Color Grading",
          "Sound FX Tuning & Master Splicing",
          "Motion Graphics & Dynamic Titles",
          "Social-First Mobile Crops (9:16)"
        ]
      }
    ]
  },
  {
    id: "graphic-design",
    title: "Graphic Design",
    description: "Elite visual identity systems, vector assets, and bespoke layout designs that differentiate your brand globally.",
    iconName: "Palette",
    details: [
      {
        title: "Brand Identity Design",
        items: [
          "Custom Signature Typography & Logos",
          "Comprehensive Brand Guideline Manuals",
          "Palette Calibration & Typographic Pairing",
          "Business Stationery Kits"
        ]
      },
      {
        title: "Marketing & Print Materials",
        items: [
          "Event Flyers & Poster Layouts",
          "Editorial Brochure & Catalog Mockups",
          "Billboard & Large Format Banner Specs",
          "Packaging & Label Engineering"
        ]
      },
      {
        title: "Digital Graphics",
        items: [
          "Interactive Social Media Templates",
          "High-converting Keynote Decks",
          "Newsletter Layout Styling",
          "SVG Icons & Custom Vector Work"
        ]
      }
    ]
  }
];

interface PublicProps {
  db: AppDatabase;
  onRefreshDb: () => void;
  bookingOpen: boolean;
  setBookingOpen: (open: boolean) => void;
}

export default function PublicWebsite({ db, onRefreshDb, bookingOpen, setBookingOpen }: PublicProps) {
  // Page hit logger
  useEffect(() => {
    apiFetch('/api/analytics/visit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ source: 'Local Referral' })
    })
    .then(() => onRefreshDb())
    .catch(err => console.error('Hit logger error:', err));
  }, []);

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedServiceTab, setSelectedServiceTab] = useState<string>('all');
  const [selectedImage, setSelectedImage] = useState<PortfolioItem | null>(null);
  const [readingPost, setReadingPost] = useState<BlogPost | null>(null);

  // Pricing interactive planner states
  const [estService, setEstService] = useState<string>('Portraits');
  const [estDuration, setEstDuration] = useState<number>(2); // hours
  const [estPics, setEstPics] = useState<number>(30); // pic count
  const [estLocation, setEstLocation] = useState<'Studio' | 'Outdoor' | 'Exotic'>('Studio');
  const [estCinema, setEstCinema] = useState<'None' | 'Reel' | 'FullFilm'>('None');

  const estimatedPrice = React.useMemo(() => {
    let base = 150; // Base photographer fee
    base += estDuration * 120; // Hourly base rate
    
    if (estPics === 15) base += 50;
    else if (estPics === 30) base += 100;
    else if (estPics === 60) base += 200;
    else base += 350; // RAW list
    
    if (estLocation === 'Outdoor') base += 50;
    if (estLocation === 'Exotic') base += 150;

    if (estCinema === 'Reel') base += 180;
    if (estCinema === 'FullFilm') base += 450;

    return base;
  }, [estDuration, estPics, estLocation, estCinema]);

  const handleApplyEstimateToBooking = () => {
    const configNotes = `[Estimate Design Selected]\n- Duration: ${estDuration}hr(s)\n- Retouched Photos: ${estPics} deliverables\n- Scene Arena: ${estLocation}\n- Video Clip Option: ${estCinema}\n- Approximate Quote: $${estimatedPrice}.00\n- Let's finalize details!`;
    setBookingForm({
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      serviceRequested: `${estService} Session`,
      preferredDate: '',
      notes: configNotes
    });
    setBookingOpen(true);
  };

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

  // Merge database portfolio items with gorgeous fallback preloads for a highly standard rich gallery
  const mergedPortfolio = React.useMemo(() => {
    const dbUrls = new Set(db.portfolio.map(item => item.imageUrl.toLowerCase()));
    const extras = initialAestheticItems.filter(item => !dbUrls.has(item.imageUrl.toLowerCase()));
    
    // Combine items
    const combined = [...db.portfolio, ...extras];
    
    // Match db order if defined, otherwise category weight
    return combined.sort((a, b) => (a.order || 99) - (b.order || 99));
  }, [db.portfolio]);

  // Filtering portfolio
  const categories = ['All', 'Portraits', 'Graduation', 'Family', 'Couples', 'Events', 'Branding'];
  const filteredPortfolio = activeCategory === 'All'
    ? mergedPortfolio
    : mergedPortfolio.filter(item => item.category === activeCategory);

  // Accent helpers based on Dynamic Settings
  const accentColorClass = db.settings.branding.accentColor === 'emerald' ? 'text-emerald-400' 
    : db.settings.branding.accentColor === 'sky' ? 'text-sky-400'
    : db.settings.branding.accentColor === 'rose' ? 'text-rose-450'
    : db.settings.branding.accentColor === 'purple' ? 'text-purple-400'
    : 'text-[#F4B400]';

  const accentBgClass = db.settings.branding.accentColor === 'emerald' 
    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-450 text-black font-extrabold shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] transition-all' 
    : db.settings.branding.accentColor === 'sky' 
    ? 'bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-400 hover:to-cyan-450 text-black font-extrabold shadow-[0_0_15px_rgba(14,165,233,0.3)] hover:shadow-[0_0_25px_rgba(14,165,233,0.5)] transition-all'
    : db.settings.branding.accentColor === 'rose' 
    ? 'bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-400 hover:to-pink-450 text-white font-extrabold shadow-[0_0_15px_rgba(244,63,94,0.3)] hover:shadow-[0_0_25px_rgba(244,63,94,0.5)] transition-all'
    : db.settings.branding.accentColor === 'purple' 
    ? 'bg-gradient-to-r from-[#8B5CF6] to-[#ED4F99] hover:from-[#7C3AED] hover:to-[#DB2777] text-white font-extrabold shadow-[0_0_15px_rgba(139,92,246,0.3)] hover:shadow-[0_0_25px_rgba(139,92,246,0.5)] transition-all'
    : 'bg-gradient-to-r from-[#F4B400] to-[#E5A500] hover:from-[#FFCA28] hover:to-[#F4B400] text-black font-black shadow-[0_0_20px_rgba(244,180,0,0.35)] hover:shadow-[0_0_35px_rgba(244,180,0,0.55)] transition-all';

  const accentBorderClass = db.settings.branding.accentColor === 'emerald' ? 'border-emerald-500/20 hover:border-emerald-500 text-emerald-400' 
    : db.settings.branding.accentColor === 'sky' ? 'border-sky-500/20 hover:border-sky-500 text-sky-400'
    : db.settings.branding.accentColor === 'rose' ? 'border-rose-500/20 hover:border-rose-500 text-rose-400'
    : db.settings.branding.accentColor === 'purple' ? 'border-purple-500/20 hover:border-purple-500 text-purple-400'
    : 'border-[#F4B400]/30 hover:border-[#F4B400] text-[#F4B400]';

  const accentRingClass = db.settings.branding.accentColor === 'emerald' ? 'focus:ring-emerald-500/30 focus:border-emerald-500' 
    : db.settings.branding.accentColor === 'sky' ? 'focus:ring-sky-500/30 focus:border-sky-500'
    : db.settings.branding.accentColor === 'rose' ? 'focus:ring-rose-500/30 focus:border-rose-500'
    : db.settings.branding.accentColor === 'purple' ? 'focus:ring-purple-500/30 focus:border-purple-500'
    : 'focus:ring-[#F4B400]/30 focus:border-[#F4B400]';

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
      const res = await apiFetch('/api/bookings', {
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
      const res = await apiFetch('/api/enquiries', {
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
    <div className="bg-[#0a0a0a] min-h-screen text-[#fafafa] flex flex-col font-sans selection:bg-[#F5C400]/20 selection:text-white">
      
      {/* FLOATING HEADER NAVIGATION */}
      <nav className="fixed top-0 left-0 w-full z-50 transition-all duration-300 bg-[#0a0a0cd8]/85 backdrop-blur-md border-b border-[#241338]/30">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Monogram styled icon */}
            <div className="w-9 h-9 rounded bg-gradient-to-br from-[#F4B400] to-amber-600 flex items-center justify-center text-black font-serif font-black text-lg shadow-[0_0_15px_rgba(244,180,0,0.3)]">
              E
            </div>
            <span className="font-serif text-xl sm:text-2xl font-bold tracking-widest text-white uppercase leading-none pt-0.5">
              {db.settings.business.companyName || 'EMMYSS'}
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollToSection('#services')} className="text-[10px] uppercase tracking-widest font-mono text-gray-300 hover:text-[#F4B400] transition-colors cursor-pointer bg-transparent border-0">Services</button>
            <button onClick={() => scrollToSection('#portfolio')} className="text-[10px] uppercase tracking-widest font-mono text-gray-300 hover:text-[#F4B400] transition-colors cursor-pointer bg-transparent border-0">Portfolio</button>
            <button onClick={() => scrollToSection('#about')} className="text-[10px] uppercase tracking-widest font-mono text-gray-300 hover:text-[#F4B400] transition-colors cursor-pointer bg-transparent border-0">About</button>
            <button onClick={() => scrollToSection('#blog')} className="text-[10px] uppercase tracking-widest font-mono text-gray-300 hover:text-[#F4B400] transition-colors cursor-pointer bg-transparent border-0">Blog</button>
            <button onClick={() => scrollToSection('#contact')} className="text-[10px] uppercase tracking-widest font-mono text-gray-300 hover:text-[#F4B400] transition-colors cursor-pointer bg-transparent border-0">Contact</button>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setBookingOpen(true)}
              className={`hidden sm:inline-flex py-2.5 px-5 rounded-full text-[10px] uppercase font-mono font-bold tracking-widest transition-all cursor-pointer shadow-lg hover:scale-[1.03] active:scale-[0.97] duration-300 ${accentBgClass}`}
            >
              Book Atelier
            </button>
            
            {/* Simple Hamburger for Mobile */}
            <button 
              onClick={() => scrollToSection('#contact')}
              className="md:hidden w-8 h-8 flex items-center justify-center text-gray-300 hover:text-[#F4B400] border border-[#241338] bg-[#0c0814]/40 rounded hover:bg-[#0c0814]/80 transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"/></svg>
            </button>
          </div>
        </div>
      </nav>

      {/* 1. HERO BANNER */}
      <header className="relative min-h-screen flex items-center justify-center p-6 bg-gradient-to-b from-[#090611] via-[#0E0B14] to-[#0A0A0A] overflow-hidden border-b border-[#241338]/20">
        {/* Extreme Premium Glowing Effects */}
        <div className="absolute top-1/4 left-1/4 w-[450px] h-[450px] rounded-full bg-gradient-to-tr from-[#F4B400]/8 to-purple-600/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] rounded-full bg-[#1e1435]/20 to-[#0A0A0A] blur-[150px] pointer-events-none" />

        {/* Subtle Fine Art Studio Viewfinder brackets */}
        <div className="absolute top-28 left-10 w-8 h-8 border-t border-l border-[#F4B400]/20 pointer-events-none hidden sm:block" />
        <div className="absolute top-28 right-10 w-8 h-8 border-t border-r border-[#F4B400]/20 pointer-events-none hidden sm:block" />
        <div className="absolute bottom-10 left-10 w-8 h-8 border-b border-l border-[#F4B400]/20 pointer-events-none hidden sm:block" />
        <div className="absolute bottom-10 right-10 w-8 h-8 border-b border-r border-[#F4B400]/20 pointer-events-none hidden sm:block" />

        {/* Dynamic Backgrid Image Overlay for Premium Atmosphere */}
        <motion.div 
          animate={{ scale: [1, 1.04, 1], opacity: [0.08, 0.15, 0.08] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 opacity-10 mix-blend-color-dodge bg-cover bg-center pointer-events-none" 
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1600&q=80')` }} 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/75 to-[#0a0a0a]/20 pointer-events-none" />

        <motion.div 
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.12 }
            }
          }}
          className="relative max-w-5xl mx-auto text-center space-y-8 px-4 z-10 flex flex-col items-center pt-16"
        >
          
          {/* Subtle Accent Pill */}
          <motion.div 
            variants={{
              hidden: { opacity: 0, scale: 0.9, y: 10 },
              visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 220 } }
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#241338]/50 bg-[#140E1F]/85 text-[#CCCCCC] text-[10px] font-mono tracking-widest uppercase shadow-xl"
          >
            <Sparkles className={`w-3.5 h-3.5 ${accentColorClass} animate-pulse`} />
            <span className="font-bold tracking-[0.2em]">FINE ART ATELIER</span>
            <span className="text-[#3a2c59]">•</span>
            <span className="font-script text-2xl lowercase tracking-wide text-[#F4B400] pt-1 select-none leading-none">shoot. create. inspire.</span>
          </motion.div>

          <motion.h1 
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
            }}
            className="text-4xl sm:text-6xl md:text-8xl font-serif font-black tracking-tight text-white max-w-5xl text-center leading-[1.05] uppercase"
          >
            {db.hero.title}
          </motion.h1>

          <motion.p 
            variants={{
              hidden: { opacity: 0, y: 18 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
            }}
            className="text-sm sm:text-lg text-gray-300 font-sans max-w-2xl leading-relaxed font-light tracking-wide"
          >
            {db.hero.subtitle}
          </motion.p>

          <motion.div 
            variants={{
              hidden: { opacity: 0, y: 15 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
            }}
            className="flex flex-col sm:flex-row items-center gap-4 pt-4 w-full sm:w-auto"
          >
            <button
              onClick={() => setBookingOpen(true)}
              className={`w-full sm:w-auto px-10 py-5 rounded-full text-xs font-bold tracking-widest uppercase text-white shadow-2xl cursor-pointer hover:scale-[1.03] active:scale-[0.97] transition-all duration-300 ${accentBgClass}`}
            >
              {db.hero.primaryCtaText}
            </button>
            <button
              onClick={() => scrollToSection('#portfolio')}
              className="w-full sm:w-auto px-10 py-5 rounded-full text-xs font-bold tracking-widest uppercase border border-[#241338] hover:border-[#F4B400]/40 text-[#CCCCCC] hover:text-white bg-[#0e0a16]/40 hover:bg-[#130E1F]/70 cursor-pointer transition-all duration-300"
            >
              {db.hero.secondaryCtaText}
            </button>
          </motion.div>

        </motion.div>

        {/* Scroll down hint */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 1 }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer z-10 hover:opacity-100 transition-opacity" 
          onClick={() => scrollToSection('#portfolio')}
        >
          <span className="text-[10px] font-mono tracking-widest uppercase text-neutral-400 text-center">SCROLL ATELIER</span>
          <div className="w-1.5 h-1.5 bg-[#F4B400] rounded-full animate-bounce" />
        </motion.div>
      </header>

      {/* 2. PREMIUM SUMMER PORTRAIT DEALS FEATURE */}
      <section id="promotions" className="bg-[#0a0a0a] py-24 border-t border-[#27272a] relative overflow-hidden text-neutral-200">
        <div className="absolute top-1/2 right-0 w-96 h-96 rounded-full bg-[#F5C400]/5 blur-[120px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          
          <div className="flex flex-col items-center text-center space-y-4 mb-16">
            <span className={`text-xs font-bold tracking-widest uppercase font-mono ${accentColorClass}`}>SEASONAL MASTERPIECE</span>
            <h2 className="text-3xl sm:text-4xl font-display font-black tracking-tight text-white uppercase">Summer Portrait Deals</h2>
            <div className="h-0.5 w-12 bg-[#F5C400]" />
            <p className="text-xs text-[#a1a1aa] max-w-md font-sans">
              This summer deserves more than phone pictures. Professional portraits with expert editing, creative posing, and beautiful outdoor locations.
            </p>
          </div>

          <div className="bg-gradient-to-br from-[#121214] to-[#18181b] border border-[#27272a] rounded-3xl overflow-hidden shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12">
              
              {/* Left Column: Atmospheric Image and Promo Badge */}
              <div className="lg:col-span-5 relative min-h-[300px] lg:min-h-full">
                <img 
                  src="https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1000&q=80" 
                  alt="Summer Outdoor Session Capture" 
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-black/30" />
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="inline-block px-3 py-1 bg-[#F5C400] text-black font-mono font-black text-[10px] tracking-widest uppercase rounded-full shadow-lg mb-2">
                    LIMITED SLOTS AVAILABILITY
                  </span>
                  <p className="text-white text-sm font-serif italic tracking-wide font-medium shadow-sm">
                    "Preserving raw, emotional, sun-lit memories that glow forever."
                  </p>
                </div>
              </div>

              {/* Right Column: Detailed Options and Checklist */}
              <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between">
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                    <div className="space-y-1">
                      <h3 className="text-2xl font-bold tracking-tight text-white font-display">THE COLLECTIVE SUMMER PASS</h3>
                      <p className="text-xs text-[#a1a1aa] font-sans">Choose any lifestyle format below for your custom portrait adventure</p>
                    </div>
                    <div className="bg-[#F5C400]/10 border border-[#F5C400]/20 rounded-2xl px-5 py-3 text-center">
                      <p className="text-[10px] text-neutral-400 uppercase tracking-widest font-mono font-bold">STARTING RATE</p>
                      <p className="text-3xl font-mono font-black text-[#F5C400] tracking-tight mt-0.5">$170</p>
                    </div>
                  </div>

                  <p className="text-xs text-[#d4d4d8] leading-relaxed mb-8">
                    Each session is directed by EMMYSS creative lead, mapping optimal natural light transitions, customized editorial posing layouts, and delivers premium, hand-retouched high-fidelity digital deliverables.
                  </p>

                  {/* Checklist of included deals */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 mb-8">
                    {[
                      { title: 'Birthday Shoots', desc: 'Vibrant candid & celebration capture' },
                      { title: 'Graduation Portraits', desc: 'Prestige classic gowns & arch milestones' },
                      { title: 'Family Sessions', desc: 'Warm structural laughter connection' },
                      { title: 'Couple Portraits', desc: 'Intimate cinematic sunset storytelling' },
                      { title: 'Personal Branding', desc: 'Fast-track executive & industry headshots' },
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-start gap-3 group">
                        <div className="w-5 h-5 rounded-full bg-[#F5C400]/10 flex items-center justify-center border border-[#F5C400]/30 mt-0.5 shrink-0 group-hover:bg-[#F5C400] group-hover:border-[#F5C400] transition-colors">
                          <Check className="w-3.5 h-3.5 text-[#F5C400] group-hover:text-black transition-colors" />
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-xs font-bold text-white tracking-tight">{item.title}</p>
                          <p className="text-[10px] text-neutral-400 font-light font-sans">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-[#27272a] flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-mono">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>8 Booking slots remaining for this week</span>
                  </div>
                  <button 
                    onClick={() => handleBookWithService('Summer Portrait Deal ($170)')}
                    className="w-full sm:w-auto px-8 py-3.5 text-xs font-black tracking-widest font-sans uppercase rounded-full bg-[#F5C400] text-black hover:bg-white hover:text-black transition-all duration-300 shadow-lg cursor-pointer transform active:scale-95 text-center"
                  >
                    Reserve Your Spot
                  </button>
                </div>

              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 3. GALERIE & PORTFOLIO */}
      <section id="portfolio" className="bg-[#0a0a0a] py-24 border-t border-[#27272a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
          >
            <div className="space-y-3">
              <span className={`text-xs font-bold tracking-widest uppercase font-mono ${accentColorClass}`}>CURATED MUSEUM</span>
              <h2 className="text-3xl sm:text-4xl font-display font-black tracking-tight text-white uppercase leading-none">Our Creative Portfolios</h2>
              <p className="text-xs text-[#a1a1aa] max-w-md font-sans">Enjoy a luxurious staggered masonry layout showcasing our raw elegance and bespoke visual captures.</p>
            </div>

            {/* Category selection */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-[#18181b]/60 border border-[#27272a] self-start z-10">
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
          </motion.div>

          {/* Staggered Masonry Flow with layout animations */}
          {filteredPortfolio.length === 0 ? (
            <div className="py-24 text-center border border-dashed border-[#27272a] rounded-xl bg-[#18181b]/35">
              <Camera className="w-8 h-8 text-neutral-600 mx-auto mb-3" />
              <h3 className="text-sm font-semibold text-white">Empty Portfolio Category</h3>
              <p className="text-xs text-neutral-500 mt-1">Log in to /admin to upload and assign magnificent pictures.</p>
            </div>
          ) : (
            <motion.div 
              layout 
              className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6"
            >
              <AnimatePresence mode="popLayout">
                {filteredPortfolio.map((item, idx) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 10 }}
                    transition={{
                      opacity: { duration: 0.3 },
                      layout: { type: 'spring', stiffness: 280, damping: 30 }
                    }}
                    onClick={() => setSelectedImage(item)}
                    className="break-inside-avoid relative rounded-xl overflow-hidden bg-[#18181b] border border-[#27272a] cursor-pointer hover:border-neutral-400 transition-colors group flex flex-col mb-6"
                  >
                    <div className="w-full h-full relative overflow-hidden">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-auto object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        loading="lazy"
                      />
                      {/* Top Action Zoom Indicator */}
                      <div className="absolute top-4 right-4 p-2 rounded-full bg-neutral-950/60 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 border border-neutral-800 pointer-events-none z-10">
                        <Eye className="w-3.5 h-3.5 text-white" />
                      </div>
                    </div>
                    
                    {/* Immersive detailed footer slide-in */}
                    <div className="p-4 sm:p-5 bg-gradient-to-t from-neutral-950 via-neutral-950/95 to-neutral-950/80 border-t border-neutral-900/60">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[9px] font-mono text-[#F5C400] bg-[#F5C400]/10 px-2 py-0.5 rounded-sm uppercase tracking-widest block font-bold">{item.category}</span>
                        <span className="text-[9px] font-mono text-[#71717a] font-medium block">EMMYSS #{idx + 1}</span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-white tracking-tight mt-1.5 group-hover:text-[#F5C400] transition-colors">{item.title}</h4>
                      {item.description && <p className="text-[11px] text-[#a1a1aa] line-clamp-2 mt-1 leading-relaxed font-sans font-light italic">"{item.description}"</p>}
                    </div>

                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}

        </div>
      </section>

      {/* 4. ATELIER SERVICES & PRICES (REPLICATED EMYSS SERVICES CONCEPT) */}
      <section id="services" className="relative py-24 md:py-32 bg-[#0E0B14] overflow-hidden border-y border-[#241338]/30">
        {/* Dynamic purple abstract blur flare */}
        <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#1A1028]/40 blur-[180px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          
          <div className="text-center max-w-2xl mx-auto mb-16 md:mb-20">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="w-6 h-[1px] bg-[#F4B400]" />
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#F4B400] font-bold">What We Orchestrate</span>
              <span className="w-6 h-[1px] bg-[#F4B400]" />
            </div>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white font-bold tracking-tight mb-6">
              Bespoke Creative <span className="italic font-normal">Services</span>
            </h2>
            <p className="font-sans text-sm md:text-base text-gray-300 leading-relaxed">
              Choose a specialized discipline. We offer high-contrast digital imagery, documentary cinema loops, and bespoke modern typography styles customized for your goals.
            </p>

            {/* Interactive Tab Filters */}
            <div className="flex flex-wrap items-center justify-center gap-3 mt-10">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: .97 }}
                onClick={() => setSelectedServiceTab("all")}
                className={`relative px-5 py-2.5 rounded text-[10px] font-mono font-bold uppercase tracking-widest border transition-all duration-300 focus:outline-none cursor-pointer ${
                  selectedServiceTab === "all"
                    ? "bg-[#F4B400] text-[#0C0814] border-[#F4B400] font-extrabold"
                    : "bg-transparent text-[#CCCCCC] border-[#241338] hover:border-[#F4B400]/40"
                }`}
              >
                All Concepts
              </motion.button>
              {replicatedServices.map(c => (
                <motion.button
                  key={c.id}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: .97 }}
                  onClick={() => setSelectedServiceTab(c.id)}
                  className={`relative px-5 py-2.5 rounded text-[10px] font-mono font-bold uppercase tracking-widest border transition-all duration-300 focus:outline-none cursor-pointer ${
                    selectedServiceTab === c.id
                      ? "bg-[#F4B400] text-[#0C0814] border-[#F4B400] font-extrabold"
                      : "bg-transparent text-[#CCCCCC] border-[#241338] hover:border-[#F4B400]/40"
                  }`}
                  children={c.title}
                />
              ))}
            </div>
          </div>

          {/* Grid Layout Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 items-stretch min-h-[300px]">
            <AnimatePresence mode="popLayout">
              {(selectedServiceTab === "all" 
                ? replicatedServices 
                : replicatedServices.filter(c => c.id === selectedServiceTab)
              ).map((categoryItem, cardIndex) => {
                const iconMap = {
                  Camera: Camera,
                  Video: Video,
                  Palette: Palette
                };
                const IconComponent = iconMap[categoryItem.iconName as keyof typeof iconMap] || Camera;

                return (
                  <motion.div
                    key={categoryItem.id}
                    layout
                    initial={{ opacity: 0, scale: .95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: .9, y: 10 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: .5, delay: cardIndex * .05 }}
                    className="group relative flex flex-col justify-between h-full rounded border border-[#241338] bg-[#0B0B0BD0]/90 p-8 hover:border-[#F4B400]/40 hover:bg-[#1A1028]/30 transition-all duration-500 shadow-xl overflow-hidden hover:shadow-[#F4B400]/5"
                  >
                    {/* Artistic gradient blur accent */}
                    <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-gradient-to-br from-[#F4B400]/5 to-transparent rounded-full blur-2xl group-hover:from-[#F4B400]/10 transition-colors pointer-events-none" />

                    <div>
                      {/* Metric Header */}
                      <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center justify-center w-12 h-12 rounded bg-[#1A1028] border border-[#241338] group-hover:border-[#F4B400]/30 transition-colors text-[#F4B400]">
                          <IconComponent className="w-6 h-6 group-hover:scale-110 transition-transform" />
                        </div>
                        <span className="font-mono text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                          [ srv-0{cardIndex + 1} ]
                        </span>
                      </div>

                      {/* Heading & Paragraph */}
                      <h3 className="font-serif text-2xl font-bold tracking-tight text-white mb-4 group-hover:text-[#F4B400] transition-colors">
                        {categoryItem.title}
                      </h3>
                      <p className="font-sans text-xs md:text-sm text-gray-400 leading-relaxed mb-8">
                        {categoryItem.description}
                      </p>

                      {/* Bullet Specifications Details */}
                      <div className="space-y-6 pt-6 border-t border-[#241338]/35">
                        {categoryItem.details.map((subDetail, subIdx) => (
                          <div key={subIdx}>
                            <h4 className="font-sans text-[11px] font-bold uppercase tracking-[0.12em] text-[#F4B400] mb-3 flex items-center gap-1.5">
                              <Sparkles className="w-3 h-3 text-[#F5C242]/70" />
                              {subDetail.title}
                            </h4>
                            <ul className="space-y-2">
                              {subDetail.items.map((bulletItem, itemIdx) => (
                                <li key={itemIdx} className="flex items-start gap-2.5 text-xs text-[#CCCCCC] font-sans">
                                  <Check className="w-3.5 h-3.5 text-[#F4B400] shrink-0 mt-0.5" />
                                  <span>{bulletItem}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Footnotes */}
                    <div className="mt-10 pt-6 border-t border-[#241338]/20 flex items-center justify-between">
                      <a 
                        href="#booking" 
                        className="text-[10px] font-mono font-bold uppercase tracking-wider text-white group-hover:text-[#F4B400] flex items-center gap-1.5 transition-colors"
                      >
                        Configure Package <span>→</span>
                      </a>
                      <span className="text-[9px] font-mono tracking-widest text-[#CCCCCC]/30 uppercase group-hover:text-[#CCCCCC]/60 transition-colors">
                        EMMYSS ORIGINAL
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Bottom Hybrid Proposal Callout */}
          <div className="mt-16 md:mt-24 p-6 rounded bg-[#130E1F] border border-[#241338] max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-5 justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[#F4B400]/10 flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5 text-[#F5C242]" />
              </div>
              <div>
                <h4 className="font-sans text-sm font-semibold text-white">Need a dynamic, multi-disciplinary hybrid package?</h4>
                <p className="font-sans text-xs text-[#CCCCCC] mt-0.5">We synchronize graphic flyers, brand video intros, and professional location photography into single bundled sessions.</p>
              </div>
            </div>
            <a 
              href="#booking" 
              className="px-5 py-2.5 rounded bg-transparent border border-[#F4B400]/30 hover:border-[#F4B400] text-[#F4B400] hover:text-white hover:bg-[#F4B400]/5 text-xs font-mono font-bold uppercase tracking-wider transition-all whitespace-nowrap"
            >
              Request custom brief
            </a>
          </div>

        </div>
      </section>

      {/* DYNAMIC ATELIER QUALITY STANDARDS SHOWCASE */}
      <section className="bg-[#0a0a0a] py-24 border-t border-[#27272a] relative overflow-hidden">
        <div className="absolute top-1/2 left-0 w-80 h-80 rounded-full bg-rose-500/5 blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center text-center space-y-4 mb-16"
          >
            <span className={`text-xs font-bold tracking-widest uppercase font-mono ${accentColorClass}`}>PRODUCTION METRICS</span>
            <h2 className="text-3xl sm:text-4xl font-display font-black tracking-tight text-white uppercase">Atelier Quality Standards</h2>
            <div className="h-0.5 w-12 bg-[#27272a]" />
            <p className="text-xs text-[#a1a1aa] max-w-lg font-sans leading-relaxed">We maintain high-end creative frameworks and raw storytelling metrics to ensure unmatched clarity.</p>
          </motion.div>

          {/* Bento-style Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Card 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ y: -6, borderColor: 'rgba(255, 255, 255, 0.4)' }}
              className="bg-[#18181b]/50 p-8 rounded-2xl border border-[#27272a] flex flex-col justify-between group transition-colors"
            >
              <div className="space-y-4">
                <div className="p-3 bg-neutral-900 w-fit rounded-xl border border-neutral-800 text-[#F5C400]">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white uppercase font-sans tracking-tight">Medium Format Optics</h3>
                <p className="text-xs text-[#a1a1aa] leading-relaxed font-sans">
                  We harness premium Hasselblad and Sony G-Master optical setups to map cinematic resolution, capturing rich detail in every exposure.
                </p>
              </div>
              <span className="text-[10px] font-mono text-[#71717a] mt-6 group-hover:text-[#F5C400] transition-colors">01 / RESOLUTION CORE</span>
            </motion.div>

            {/* Card 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ y: -6, borderColor: 'rgba(255, 255, 255, 0.4)' }}
              className="bg-[#18181b]/50 p-8 rounded-2xl border border-[#27272a] flex flex-col justify-between group transition-colors"
            >
              <div className="space-y-4">
                <div className="p-3 bg-neutral-900 w-fit rounded-xl border border-neutral-800 text-[#F5C400]">
                  <Compass className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white uppercase font-sans tracking-tight">Expert Creative Guidance</h3>
                <p className="text-xs text-[#a1a1aa] leading-relaxed font-sans">
                  Our professional directors pre-scout campuses, select color palettes, and guide posture/angles so you feel elegant, natural, and confident.
                </p>
              </div>
              <span className="text-[10px] font-mono text-[#71717a] mt-6 group-hover:text-[#F5C400] transition-colors">02 / POSING COUTURE</span>
            </motion.div>

            {/* Card 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ y: -6, borderColor: 'rgba(255, 255, 255, 0.4)' }}
              className="bg-[#18181b]/50 p-8 rounded-2xl border border-[#27272a] flex flex-col justify-between group transition-colors"
            >
              <div className="space-y-4">
                <div className="p-3 bg-neutral-900 w-fit rounded-xl border border-neutral-800 text-[#F5C400]">
                  <Brush className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white uppercase font-sans tracking-tight">High-End Retouching</h3>
                <p className="text-xs text-[#a1a1aa] leading-relaxed font-sans">
                  Bespoke frequency separation, micro-contrast enhancement, and atmospheric light grading. We never rely on automated generic filters.
                </p>
              </div>
              <span className="text-[10px] font-mono text-[#71717a] mt-6 group-hover:text-[#F5C400] transition-colors">03 / HAND RETOUCHING</span>
            </motion.div>

            {/* Card 4 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              whileHover={{ y: -6, borderColor: 'rgba(255, 255, 255, 0.4)' }}
              className="bg-[#18181b]/50 p-8 rounded-2xl border border-[#27272a] flex flex-col justify-between group transition-colors"
            >
              <div className="space-y-4">
                <div className="p-3 bg-neutral-900 w-fit rounded-xl border border-neutral-800 text-[#F5C400]">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white uppercase font-sans tracking-tight">Ultra-Fast 48h Deliveries</h3>
                <p className="text-xs text-[#a1a1aa] leading-relaxed font-sans">
                  Receive full pre-curated WebP links of your shoot selections in under 48 hours. No waiting generic months to see master shots.
                </p>
              </div>
              <span className="text-[10px] font-mono text-[#71717a] mt-6 group-hover:text-[#F5C400] transition-colors">04 / VELOCITY DEPLOY</span>
            </motion.div>

            {/* Card 5 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
              whileHover={{ y: -6, borderColor: 'rgba(255, 255, 255, 0.4)' }}
              className="bg-[#18181b]/50 p-8 rounded-2xl border border-[#27272a] flex flex-col justify-between group transition-colors"
            >
              <div className="space-y-4">
                <div className="p-3 bg-neutral-900 w-fit rounded-xl border border-neutral-800 text-[#F5C400]">
                  <Sliders className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white uppercase font-sans tracking-tight">Private Client Lounges</h3>
                <p className="text-xs text-[#a1a1aa] leading-relaxed font-sans">
                  Every booking gains entry to an offline-first private Web dashboard which hosts high-fidelity archives and metadata downloads.
                </p>
              </div>
              <span className="text-[10px] font-mono text-[#71717a] mt-6 group-hover:text-[#F5C400] transition-colors">05 / PRIVATE LOUNGE</span>
            </motion.div>

            {/* Card 6 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.6 }}
              whileHover={{ y: -6, borderColor: 'rgba(255, 255, 255, 0.4)' }}
              className="bg-[#18181b]/50 p-8 rounded-2xl border border-[#27272a] flex flex-col justify-between group transition-colors"
            >
              <div className="space-y-4">
                <div className="p-3 bg-neutral-900 w-fit rounded-xl border border-neutral-800 text-[#F5C400]">
                  <Tv className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white uppercase font-sans tracking-tight">Cinema Drones & Video</h3>
                <p className="text-xs text-[#a1a1aa] leading-relaxed font-sans">
                  Our cinema crew deploys intelligent drone maneuvers and 4K camera gear to deliver high dynamic range reels for matching profiles.
                </p>
              </div>
              <span className="text-[10px] font-mono text-[#71717a] mt-6 group-hover:text-[#F5C400] transition-colors">06 / CINEMATIC EXPANSION</span>
            </motion.div>

          </div>
        </div>
      </section>

      {/* DYNAMIC INTERACTIVE SESSION DESIGNER */}
      <section className="bg-[#0a0a0a] py-24 border-t border-[#27272a] relative overflow-hidden">
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Context Title Info */}
            <div className="lg:col-span-5 space-y-6">
              <span className={`text-xs font-bold tracking-widest uppercase font-mono ${accentColorClass}`}>INTELLIGENT PLANNER</span>
              <h2 className="text-3xl sm:text-5xl font-display font-black tracking-tight text-white uppercase leading-tight">
                Dynamic Session <br />Designer
              </h2>
              <p className="text-xs sm:text-sm text-[#a1a1aa] leading-relaxed font-sans">
                Tweak and customize your session on the fly. Adjust timing, quantity of high-fashion retouched pictures, visual backgrounds, and cinema options to calculate your rate and schedule.
              </p>
              <div className="p-5 rounded-xl bg-[#18181b]/40 border border-[#27272a] space-y-3">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#a1a1aa] block">WHAT IS INCLUDED WITH CHOSEN SLATE:</span>
                <ul className="space-y-1.5 text-xs text-[#a1a1aa] font-sans">
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Professional Studio Lighting / Daylight setups</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> High-Fidelity Unsplash Asset reference map</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Pre-Shoot color mood alignment call</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Secure digital album with private credentials</li>
                </ul>
              </div>
            </div>

            {/* Interactive Calculator Panel */}
            <div className="lg:col-span-7 bg-[#121214] border border-[#27272a] rounded-2.5xl p-8 shadow-2xl space-y-6 relative">
              <div className="absolute top-6 right-8 text-[9px] font-mono bg-amber-500/10 text-amber-400 px-2.5 py-1 border border-amber-500/20 rounded-md font-bold uppercase tracking-wider">
                Custom Estimator
              </div>

              <div className="space-y-5">
                
                {/* 1. Category */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-[#a1a1aa]">1. Select Main Creative Category</label>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {['Portraits', 'Graduation', 'Family', 'Couples', 'Events', 'Branding'].map(cat => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setEstService(cat)}
                        className={`py-2 px-2 text-[10px] font-medium rounded-lg text-center font-sans tracking-tight transition-all cursor-pointer border ${
                          estService === cat 
                            ? `${accentBorderClass} bg-[#18181b] font-semibold border-amber-500` 
                            : 'bg-[#0a0a0a] border-transparent text-[#a1a1aa] hover:text-white hover:bg-neutral-900/60'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Duration Slider/Buttons */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-mono uppercase text-[#a1a1aa]">
                    <span>2. Shoots Duration Setup</span>
                    <span className="text-white font-bold">{estDuration} Hour{estDuration > 1 ? 's' : ''} shooting time</span>
                  </div>
                  <div className="flex gap-2">
                    {[1, 2, 4, 8].map(h => (
                      <button
                        key={h}
                        type="button"
                        onClick={() => setEstDuration(h)}
                        className={`flex-1 py-2.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer border ${
                          estDuration === h 
                            ? 'bg-white text-black border-white' 
                            : 'bg-[#0a0a0a] border-[#27272a] text-[#a1a1aa] hover:text-white'
                        }`}
                      >
                        {h === 8 ? '8H (Full Day)' : `${h}-H Shoot`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Retouches */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-mono uppercase text-[#a1a1aa]">
                    <span>3. Finished Editorial Deliveries</span>
                    <span className="text-white font-bold">{estPics} Retouched deliverables</span>
                  </div>
                  <div className="flex gap-2">
                    {[15, 30, 60, 100].map(p => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setEstPics(p)}
                        className={`flex-1 py-2.5 rounded-lg text-xs font-mono transition-colors cursor-pointer border ${
                          estPics === p 
                            ? 'bg-[#18181b] border-[#27272a] text-white font-bold' 
                            : 'bg-[#0a0a0a] border-[#27272a] text-[#a1a1aa] hover:text-white'
                        }`}
                      >
                        {p === 100 ? 'All RAW + 100' : `${p} Master Retouched`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4. Location and Cinema Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  
                  {/* Location Area Option */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-widest text-[#a1a1aa] block">4. Ambient Background Setup</label>
                    <select
                      value={estLocation}
                      onChange={e => setEstLocation(e.target.value as any)}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#0a0a0a] border border-[#27272a] text-xs text-white focus:outline-hidden"
                    >
                      <option value="Studio">In-Studio (Minimalist Backdrop) (+$0)</option>
                      <option value="Outdoor">Scenic Campus / Forest / Outdoor (+$50)</option>
                      <option value="Exotic">Bespoke Remote Destination Setup (+$150)</option>
                    </select>
                  </div>

                  {/* Cinema Drone Setup */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-widest text-[#a1a1aa] block">5. Cinematic Videography Add-on</label>
                    <select
                      value={estCinema}
                      onChange={e => setEstCinema(e.target.value as any)}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#0a0a0a] border border-[#27272a] text-xs text-white focus:outline-hidden"
                    >
                      <option value="None">No Video capture (Photos Only)</option>
                      <option value="Reel">60-Sec High contrast dynamic Instagram Reel (+$180)</option>
                      <option value="FullFilm">4K Cine-Grade Complete 3-Min Feature Film (+$450)</option>
                    </select>
                  </div>

                </div>

              </div>

              {/* Estimate Calculations display footer */}
              <div className="pt-6 border-t border-[#27272a] flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#0a0a0a]/80 p-6 rounded-xl border border-[#27272a]/60">
                <div className="space-y-1 self-start sm:self-center">
                  <span className="text-[9px] font-mono text-[#a1a1aa] uppercase tracking-widest block font-bold">APPROXIMATE QUOTE</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-display font-black text-white">${estimatedPrice}</span>
                    <span className="text-[10px] text-[#71717a] font-mono">USD NETT</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleApplyEstimateToBooking}
                  className={`w-full sm:w-auto px-6 py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest text-white cursor-pointer shadow-xl transition-all hover:scale-[1.02] flex items-center justify-center gap-2 ${accentBgClass}`}
                >
                  <span>Apply Estimate & Schedule</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 3-STEP COUTURE PRODUCTION FLOW */}
      <section className="bg-[#0a0a0a] py-24 border-t border-[#27272a] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center text-center space-y-4 mb-20"
          >
            <span className={`text-xs font-bold tracking-widest uppercase font-mono ${accentColorClass}`}>PRODUCTION TIMELINE</span>
            <h2 className="text-3xl sm:text-4xl font-display font-black tracking-tight text-white uppercase">The 3-Step Production Flow</h2>
            <div className="h-0.5 w-12 bg-[#27272a]" />
            <p className="text-xs text-[#a1a1aa] max-w-md font-sans">Our signature conceptualizer tracks your photoshoot blocks seamlessly from concept design to museum deliverables.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative">
            
            {/* Visual Connecting Line for desktop */}
            <div className="hidden md:block absolute top-[43px] left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-amber-500/0 via-[#27272a] to-amber-500/0 pointer-events-none -z-0" />

            {/* Step 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex flex-col items-center text-center space-y-4 relative z-10"
            >
              <div className="w-16 h-16 rounded-full bg-[#18181b] border-2 border-[#27272a] flex items-center justify-center text-xl font-mono font-black text-[#F5C400]">
                I
              </div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-sans pt-2">Architectural Blueprint</h3>
              <p className="text-xs text-[#a1a1aa] leading-relaxed max-w-xs font-sans">
                Review references, map locations, finalize desired wardrobe colors, and establish lighting guides tailored for your profile.
              </p>
            </motion.div>

            {/* Step 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col items-center text-center space-y-4 relative z-10"
            >
              <div className="w-16 h-16 rounded-full bg-[#18181b] border-2 border-[#27272a]/60 flex items-center justify-center text-xl font-mono font-black text-[#F5C400]">
                II
              </div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-sans pt-2">Atmospheric Capture</h3>
              <p className="text-xs text-[#a1a1aa] leading-relaxed max-w-xs font-sans">
                Conduct the session on location or in studio. We offer masterclass pacing, posture styling guides, and music mood setups.
              </p>
            </motion.div>

            {/* Step 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col items-center text-center space-y-4 relative z-10"
            >
              <div className="w-16 h-16 rounded-full bg-[#18181b] border-2 border-[#27272a] flex items-center justify-center text-xl font-mono font-black text-[#F5C400]">
                III
              </div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-sans pt-2">Artisanal Curing</h3>
              <p className="text-xs text-[#a1a1aa] leading-relaxed max-w-xs font-sans">
                Curate image selections, retune contrast values via hand frequency processes, and bundle high-res WebP downloads to our client portal.
              </p>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 5. CLIENT TESTIMONIALS */}
      <section className="bg-[#0a0a0a] py-24 border-t border-[#27272a] relative overflow-hidden">
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
        <section id="blog" className="bg-[#0a0a0a] py-24 border-t border-[#27272a]">
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
                    <div className="absolute top-4 left-4 p-1.5 px-3 rounded bg-[#0a0a0a]/85 backdrop-blur-xs text-[10px] text-white tracking-widest uppercase font-mono border border-[#27272a]">
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
      <section id="about" className="bg-[#0a0a0a] py-24 border-t border-[#27272a]">
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
      <section id="contact" className="bg-[#0a0a0a] py-24 border-t border-[#27272a] relative">
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

              {/* Grayscale Google Maps Embed */}
              <div className="w-full h-44 rounded-xl overflow-hidden border border-[#27272a] shadow-xl relative bg-[#0a0a0a] group mt-2">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2983.3323067825006!2d-81.4920875!3d41.6053335!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88310344d56be30b%3A0x6b0931e50882e38c!2s25701%20N%20Lakeland%20Blvd%2C%20Euclid%2C%20OH%2044132!5e0!3m2!1sen!2sus!4v1710000000000!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0, filter: 'grayscale(1) invert(0.9) contrast(1.15) opacity(0.85)' }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  title="EMMYSS Atelier Location"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/40 via-transparent to-transparent pointer-events-none group-hover:opacity-0 transition-opacity" />
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
                          className={`w-full px-4 py-3 rounded-xl bg-[#0a0a0a] border border-[#27272a] text-xs text-white placeholder-neutral-600 focus:outline-hidden transition-all ${accentRingClass}`}
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
                          className={`w-full px-4 py-3 rounded-xl bg-[#0a0a0a] border border-[#27272a] text-xs text-white placeholder-neutral-600 focus:outline-hidden transition-all ${accentRingClass}`}
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
                          className={`w-full px-4 py-3 rounded-xl bg-[#0a0a0a] border border-[#27272a] text-xs text-white placeholder-neutral-600 focus:outline-hidden transition-all ${accentRingClass}`}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono tracking-widest uppercase text-[#a1a1aa] block">Associated Service</label>
                        <select
                          value={enquiryForm.serviceRequested}
                          onChange={e => setEnquiryForm(prev => ({ ...prev, serviceRequested: e.target.value }))}
                          className={`w-full px-4 py-3 rounded-xl bg-[#0a0a0a] border border-[#27272a] text-xs text-white focus:outline-hidden transition-all ${accentRingClass}`}
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
                        className={`w-full px-4 py-3 rounded-xl bg-[#0a0a0a] border border-[#27272a] text-xs text-white placeholder-neutral-600 focus:outline-hidden transition-all resize-none ${accentRingClass}`}
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
                    className={`w-full px-4 py-3 rounded-xl bg-[#0a0a0a] border border-[#27272a] text-xs text-white focus:outline-hidden ${accentRingClass}`}
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
                      className={`w-full px-4 py-3 rounded-xl bg-[#0a0a0a] border border-[#27272a] text-xs text-white focus:outline-hidden ${accentRingClass}`}
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
                      className={`w-full px-4 py-3 rounded-xl bg-[#0a0a0a] border border-[#27272a] text-xs text-white focus:outline-hidden ${accentRingClass}`}
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
                      className={`w-full px-4 py-3 rounded-xl bg-[#0a0a0a] border border-[#27272a] text-xs text-white focus:outline-hidden ${accentRingClass}`}
                    >
                      <option value="">Select Atelier Service</option>
                      {bookingForm.serviceRequested === 'Summer Portrait Deal ($170)' && (
                        <option value="Summer Portrait Deal ($170)">Summer Portrait Deal ($170)</option>
                      )}
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
                      className={`w-full px-4 py-3 rounded-xl bg-[#0a0a0a] border border-[#27272a] text-xs text-white focus:outline-hidden ${accentRingClass}`}
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
                    className={`w-full px-4 py-3 rounded-xl bg-[#0a0a0a] border border-[#27272a] text-xs text-white resize-none focus:outline-hidden ${accentRingClass}`}
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
