/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { AppDatabase, AdminRole, Booking, Enquiry, BlogPost, ServiceItem, PortfolioItem, TestimonialItem, Promotion, SiteSettings, EmailLog } from './src/types';

// Initialize Gemini SDK if API key is provided
let aiClient: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  aiClient = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
}

const DB_FILE = path.join(process.cwd(), 'db.json');

// Preseeded Data Helper
function getInitialDbState(): AppDatabase {
  return {
    users: [
      {
        id: 'usr-1',
        email: 'admin@emmyss.com',
        name: 'Gideon Superadmin',
        passwordHash: crypto.createHash('sha256').update('adminpassword').digest('hex'),
        role: 'Super Admin'
      },
      {
        id: 'usr-2',
        email: 'manager@emmyss.com',
        name: 'Sarah ContentManager',
        passwordHash: crypto.createHash('sha256').update('managerpassword').digest('hex'),
        role: 'Content Manager'
      },
      {
        id: 'usr-3',
        email: 'staff@emmyss.com',
        name: 'James Staff',
        passwordHash: crypto.createHash('sha256').update('staffpassword').digest('hex'),
        role: 'Staff'
      }
    ],
    hero: {
      title: "Capture Life's Best Moments",
      subtitle: 'Professional Photography, Videography & Creative Design Services that bring your story to life.',
      primaryCtaText: 'Book a Session',
      secondaryCtaText: 'View Portfolio'
    },
    about: {
      description: 'EMMYSS helps individuals, families, graduates, brands, and businesses preserve memories and create powerful visual stories through professional photography, videography, and creative design. We combine creativity, technical expertise, and modern editing techniques to deliver exceptional results that exceed expectations.',
      mission: 'To preserve raw elegance and human connection through immaculate visual masterpieces, ensuring every client feels elevated, seen, and remembered.',
      story: 'Founded in 2018 with a single camera and a relentless obsession with natural light, EMMYSS has grown into a premier creative agency. Our work has been featured in top-tier lifestyle editorials and branding campaigns. We continually push the boundary of visual art.'
    },
    services: [
      {
        id: 'srv-1',
        name: 'Editorial Portrait Session',
        category: 'Photography',
        description: 'Elite portrait capture with professional studio lighting, custom artistic styling direction, high-fashion retouches, and 25 flawless digital deliverables.',
        price: '$450',
        imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
        featured: true,
        status: 'Active'
      },
      {
        id: 'srv-2',
        name: 'Deluxe Graduation Elite',
        category: 'Photography',
        description: 'Vibrant external campus shoot capturing your milestone. Includes high-fidelity graduation gown capture, individual headshots, family group combinations, and 40 dynamic WebP deliverables.',
        price: '$350',
        imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=400&q=80',
        featured: true,
        status: 'Active'
      },
      {
        id: 'srv-3',
        name: 'Premium Cinema Videography',
        category: 'Videography',
        description: 'Cinematic commercial or event highlight film. Includes full multi-angle capture, ultra-clear acoustic sound record, drone cinematic sweeps, color grading, and a curated 3-minute reel.',
        price: '$1200',
        imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=400&q=80',
        featured: true,
        status: 'Active'
      },
      {
        id: 'srv-4',
        name: 'Visual Brand Identity Design',
        category: 'Graphic Design',
        description: 'Complete brand assets suite including dynamic typography logo system, creative direction guides, social media templates, and customized brand aesthetic kit.',
        price: '$750',
        imageUrl: 'https://images.unsplash.com/photo-1542744094-3a31f103e35f?auto=format&fit=crop&w=400&q=80',
        featured: false,
        status: 'Active'
      }
    ],
    portfolio: [
      {
        id: 'port-1',
        title: 'Amber Studio Serenity',
        category: 'Portraits',
        imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
        description: 'Minimalist editorial studio portrait capturing soft gold lighting.',
        order: 1
      },
      {
        id: 'port-2',
        title: 'The Cap Throw',
        category: 'Graduation',
        imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80',
        description: 'Classic emotional candid at the graduation stage exit.',
        order: 2
      },
      {
        id: 'port-3',
        title: 'Warm Sunday Picnic',
        category: 'Family',
        imageUrl: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=800&q=80',
        description: 'Golden hour picnic session highlighting genuine family smiles.',
        order: 3
      },
      {
        id: 'port-4',
        title: 'Sea breeze & Sunsets',
        category: 'Couples',
        imageUrl: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=800&q=80',
        description: 'Intimate sunset couple shoot on the rocky shoreline.',
        order: 4
      },
      {
        id: 'port-5',
        title: 'Midnight Fusion Arena',
        category: 'Events',
        imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80',
        description: 'High dynamic range capture of stage fog and magenta neon flares.',
        order: 5
      },
      {
        id: 'port-6',
        title: 'Concrete Brand Identity',
        category: 'Branding',
        imageUrl: 'https://images.unsplash.com/photo-1542744094-3a31f103e35f?auto=format&fit=crop&w=800&q=80',
        description: 'Minimalist workspace asset mockups representing professional branding aesthetics.',
        order: 6
      }
    ],
    testimonials: [
      {
        id: 'test-1',
        name: 'Elizabeth Vance',
        position: 'Founder of VESTIGE Label',
        testimonial: 'EMMYSS completely transformed how potential buyers perceive our luxury brand. Their mastery of micro-expressions and natural daylight is singular. Our conversions multiplied immediately.',
        rating: 5,
        imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80'
      },
      {
        id: 'test-2',
        name: 'Dr. Michael Chang',
        position: 'Stanford MBA Graduate',
        testimonial: 'I booked the Deluxe Graduation Elite package and was blown away. The photographers made me feel incredibly comfortable, mapped out the perfect locations, and delivered breathtaking pictures.',
        rating: 5,
        imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
      },
      {
        id: 'test-3',
        name: 'Samantha Reynolds',
        position: 'Couple Art Session Client',
        testimonial: 'The outdoor couple session with EMMYSS was an absolute dream. Elegant lighting, professional direction, and warm cinematic edits. Cannot recommend them enough!',
        rating: 5,
        imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80'
      },
      {
        id: 'test-4',
        name: 'David K. Lawson',
        position: 'Birthday Portrait Client',
        testimonial: 'Outstanding birthday session! They captured candid laughter and made me look incredibly professional, artistic, and relaxed during the studio lights portion.',
        rating: 5,
        imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80'
      },
      {
        id: 'test-5',
        name: 'Elena Rostova',
        position: 'Elite Family Portraits',
        testimonial: 'Finding a photographer who can keep three young children smiling is a miracle. EMMYSS is extremely patient, friendly, and incredibly creative with lighting.',
        rating: 5,
        imageUrl: 'https://images.unsplash.com/photo-1534751516642-a131fed10495?auto=format&fit=crop&w=150&q=80'
      },
      {
        id: 'test-6',
        name: 'Marcus Brody',
        position: 'Creative Director at Summit Inc',
        testimonial: 'Impeccable. High-end editing standards, extremely professional equipment, and incredibly fast turnaround. Best creative studio in Ohio.',
        rating: 5,
        imageUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80'
      }
    ],
    bookings: [
      {
        id: 'bk-1',
        customerName: 'Aria Montgomery',
        customerEmail: 'aria@example.com',
        customerPhone: '+1-555-0199',
        serviceRequested: 'Editorial Portrait Session',
        preferredDate: '2026-06-15',
        notes: 'Would love a highly contrasted, high-editorial studio vibe with black backgrounds.',
        status: 'New',
        createdAt: new Date('2026-06-05T10:00:00Z').toISOString()
      },
      {
        id: 'bk-2',
        customerName: 'Marcus Aurelius',
        customerEmail: 'marcus@example.com',
        customerPhone: '+1-555-0212',
        serviceRequested: 'Deluxe Graduation Elite',
        preferredDate: '2026-06-20',
        notes: 'Requesting group pictures with supportive parents on the main arch.',
        status: 'Confirmed',
        createdAt: new Date('2026-06-06T14:30:00Z').toISOString()
      }
    ],
    enquiries: [
      {
        id: 'enq-1',
        name: 'Devon Lee',
        email: 'devon.l@brandco.com',
        phone: '+1-555-8833',
        serviceRequested: 'Premium Cinema Videography',
        message: 'Looking to hire EMMYSS for our upcoming autumn fashion campaign. We require scenic drone shots and rapid sequence cuts. Can you send details of availability?',
        status: 'New',
        createdAt: new Date('2026-06-06T09:15:00Z').toISOString()
      }
    ],
    blog: [
      {
        id: 'post-1',
        title: 'Mastering the Golden Hour: Art of Natural Lighting',
        slug: 'mastering-golden-hour',
        excerpt: 'Deconstructing the exact mathematical and visual techniques to frame subjects during the magical natural twilight sunset transition.',
        content: `### Why Golden Hour is Unparalleled

Golden Hour represents the premier window for photography. Occurring during the final hour of daylight before sunset, it yields a luxurious, soft, warm ambiance that wraps subjects in high-contrast yet flattering golden glimmers.

#### Practical Studio Tips:
1. **Dynamic Rim Lighting**: Place your subject directly between your camera lens and the descending sun. This paints a magical radiant halo around their hair shoulders—creating ultimate editorial separation.
2. **The Lens Flare Secret**: Allow minor shards of natural light to graze the edge of your optical lens element for organic atmospheric flares.
3. **White Balance Calibration**: Fix your white balance preset manually to 'Cloudy' or 'Shade' (around 5600K-6000K) to locks in the warm natural tones instead of letting camera logic neutralize the sun's gorgeous color shifts.`,
        category: 'Education',
        tags: ['Lighting', 'Portraits', 'Outdoor'],
        status: 'Published',
        publishedDate: '2026-06-01',
        createdAt: new Date('2026-06-01T08:00:00Z').toISOString(),
        metaTitle: 'Mastering Golden Hour Photography | Natural Portrait Tips',
        metaDescription: 'Learn historical and technical secrets to framing portraits beautifully during sunset golden hour. Dynamic rim lighting, exposure tips, and manual White Balance guidance.',
        keywords: 'golden hour, portrait lighting, photography tips, sunset shoot',
        bannerUrl: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=600&q=80'
      }
    ],
    promotions: [
      {
        id: 'promo-1',
        title: 'Graduation Summer Celebration',
        description: 'Book any Graduation elite package before June 30th and receive 5 extra physical retouched metallic prints plus 1 cinematic TikTok video edit absolutely free!',
        bannerUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=600&q=80',
        startDate: '2026-06-01',
        endDate: '2026-06-30',
        status: 'Active'
      },
      {
        id: 'promo-2',
        title: 'Corporate Brand Kickstart Portfolio',
        description: 'Take 15% off complete Branding Identity design portfolios when combined with our corporate executive portraits package during this campaign weeks.',
        bannerUrl: 'https://images.unsplash.com/photo-1542744094-3a31f103e35f?auto=format&fit=crop&w=600&q=80',
        startDate: '2026-07-01',
        endDate: '2026-07-15',
        status: 'Inactive'
      }
    ],
    settings: {
      business: {
        companyName: 'EMMYSS Studio',
        phone: '216-440-0155',
        email: 'info@emmyss.com',
        address: '25701 N Lakeland Blvd, Suite 312, Euclid, OH 44132, United States',
        socials: {
          facebook: 'https://facebook.com/emmyssstudio',
          instagram: 'https://instagram.com/emmyssstudio',
          twitter: 'https://twitter.com/emmyssstudio',
          youtube: 'https://youtube.com/emmyssstudio'
        }
      },
      seo: {
        metaTitle: 'EMMYSS Studio | Premium Professional Photography & Videography',
        metaDescription: 'Luxury editorial portraiture, cinematic graduation highlights, events documentation, and corporate branding visual asset strategies designed to elevate your narrative.',
        keywords: 'luxury photography studio, graduation portraits, branding videographer, graphic design agency, emmyss portrait, wedding filmmaker',
        ogImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80'
      },
      branding: {
        logoText: 'EMMYSS',
        accentColor: 'gold' // gold, emerald, sky, rose, purple
      }
    },
    emailLogs: [
      {
        id: 'msg-1',
        recipient: 'info@emmyss.com',
        subject: '[Alert] New Booking Request from Aria Montgomery',
        body: 'Aria Montgomery has requested a booking for Editorial Portrait Session on 2026-06-15. Check the EMMYSS Admin dashboard to review, approve, or reschedule.',
        timestamp: new Date('2026-06-05T10:01:00Z').toISOString(),
        type: 'Admin Alerts'
      },
      {
        id: 'msg-2',
        recipient: 'aria@example.com',
        subject: 'We have received your Booking Request! - EMMYSS Studio',
        body: 'Hi Aria, thank you for booking of "Editorial Portrait Session". Our creative coordinators are reviewing your date request (2026-06-15). We will contact you soon with a confirmation.',
        timestamp: new Date('2026-06-05T10:02:00Z').toISOString(),
        type: 'Customer Updates'
      }
    ],
    visitorStats: {
      totalViews: 1420,
      viewsHistory: [
        { date: 'Jun 01', views: 120, bookings: 1 },
        { date: 'Jun 02', views: 165, bookings: 0 },
        { date: 'Jun 03', views: 240, bookings: 2 },
        { date: 'Jun 04', views: 190, bookings: 0 },
        { date: 'Jun 05', views: 280, bookings: 1 },
        { date: 'Jun 06', views: 310, bookings: 2 },
        { date: 'Jun 07', views: 115, bookings: 0 }
      ],
      sources: [
        { name: 'Instagram Referral', count: 680 },
        { name: 'Google Organic Search', count: 410 },
        { name: 'Direct Links', count: 180 },
        { name: 'Fiverr & Creative Networks', count: 150 }
      ]
    }
  };
}

// Database JSON Read & Write Helpers
function readDb(): AppDatabase {
  try {
    if (!fs.existsSync(DB_FILE)) {
      const initial = getInitialDbState();
      fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf-8');
      return initial;
    }
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to read db.json, returning default initial state:', err);
    return getInitialDbState();
  }
}

function writeDb(data: AppDatabase) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write db.json:', err);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware for parsing requests (including larger base64 payloads)
  app.use(express.json({ limit: '15mb' }));
  app.use(express.urlencoded({ extended: true, limit: '15mb' }));

  // Helper: log simulated email dispatches
  const logSimulatedEmail = (recipient: string, subject: string, body: string, type: 'Admin Alerts' | 'Customer Updates') => {
    const db = readDb();
    const newLog: EmailLog = {
      id: `msg-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      recipient,
      subject,
      body,
      timestamp: new Date().toISOString(),
      type
    };
    db.emailLogs.unshift(newLog);
    writeDb(db);
  };

  // --- API Authentication API ---
  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req?.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const db = readDb();
    const hash = crypto.createHash('sha256').update(password).digest('hex');
    const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.passwordHash === hash);

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials. Check email and password.' });
    }

    // Generate a simple token (mock string)
    const token = `emmyss-token-${Buffer.from(JSON.stringify({ id: user.id, role: user.role })).toString('base64')}`;
    
    return res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      token
    });
  });

  // --- API GET Whole DB (Sanitized and only for authenticating users) ---
  app.get('/api/db', (req, res) => {
    // Return sanitized data
    const db = readDb();
    const sanitizedUsers = db.users.map(({ id, email, name, role }) => ({ id, email, name, role }));
    res.json({
      ...db,
      users: sanitizedUsers
    });
  });

  // Reset DB
  app.post('/api/db/reset', (req, res) => {
    const initial = getInitialDbState();
    writeDb(initial);
    res.json({ message: 'Database reset and fully re-seeded successfully.' });
  });

  // --- Landing Contents update APIs ---
  app.put('/api/hero', (req, res) => {
    const { title, subtitle, primaryCtaText, secondaryCtaText } = req.body;
    const db = readDb();
    db.hero = { title, subtitle, primaryCtaText, secondaryCtaText };
    writeDb(db);
    res.json({ message: 'Hero content updated successfully.', hero: db.hero });
  });

  app.put('/api/about', (req, res) => {
    const { description, mission, story } = req.body;
    const db = readDb();
    db.about = { description, mission, story };
    writeDb(db);
    res.json({ message: 'About content updated successfully.', about: db.about });
  });

  // --- Services Management ---
  app.post('/api/services', (req, res) => {
    const service: Partial<ServiceItem> = req.body;
    if (!service.name || !service.category) {
      return res.status(400).json({ error: 'Service Name and Category are required.' });
    }
    const db = readDb();
    const newService: ServiceItem = {
      id: `srv-${Date.now()}`,
      name: service.name,
      category: service.category as any,
      description: service.description || '',
      price: service.price || '',
      imageUrl: service.imageUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
      featured: !!service.featured,
      status: (service.status as any) || 'Active'
    };
    db.services.unshift(newService);
    writeDb(db);
    res.json({ message: 'Service added successfully.', service: newService });
  });

  app.put('/api/services/:id', (req, res) => {
    const { id } = req.params;
    const body = req.body;
    const db = readDb();
    const idx = db.services.findIndex(s => s.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Service not found.' });

    db.services[idx] = {
      ...db.services[idx],
      ...body
    };
    writeDb(db);
    res.json({ message: 'Service updated successfully.', service: db.services[idx] });
  });

  app.delete('/api/services/:id', (req, res) => {
    const { id } = req.params;
    const db = readDb();
    db.services = db.services.filter(s => s.id !== id);
    writeDb(db);
    res.json({ message: 'Service deleted successfully.' });
  });

  // --- Portfolio & Gallery Management ---
  app.post('/api/portfolio', (req, res) => {
    const item: Partial<PortfolioItem> = req.body;
    if (!item.title || !item.category || !item.imageUrl) {
      return res.status(400).json({ error: 'Title, Category, and Image are required.' });
    }
    const db = readDb();
    const maxOrder = db.portfolio.reduce((acc, current) => Math.max(acc, current.order || 0), 0);
    const newItem: PortfolioItem = {
      id: `port-${Date.now()}`,
      title: item.title,
      category: item.category as any,
      imageUrl: item.imageUrl, // WebP dynamic conversions already pre-compressed on Client for speed!
      description: item.description || '',
      order: maxOrder + 1
    };
    db.portfolio.push(newItem);
    writeDb(db);
    res.json({ message: 'Portfolio image uploaded successfully.', item: newItem });
  });

  // Bulk reordering
  app.put('/api/portfolio/bulk', (req, res) => {
    const { orders } = req.body; // Array of { id, order }
    if (!Array.isArray(orders)) return res.status(400).json({ error: 'Invalid orders format.' });

    const db = readDb();
    orders.forEach(({ id, order }) => {
      const p = db.portfolio.find(item => item.id === id);
      if (p) p.order = order;
    });
    // Sort portfolio array by order asc
    db.portfolio.sort((a, b) => a.order - b.order);
    writeDb(db);
    res.json({ message: 'Portfolio ordered updated successfully.', portfolio: db.portfolio });
  });

  app.put('/api/portfolio/:id', (req, res) => {
    const { id } = req.params;
    const { title, category, description } = req.body;
    const db = readDb();
    const idx = db.portfolio.findIndex(item => item.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Portfolio item not found.' });

    db.portfolio[idx] = {
      ...db.portfolio[idx],
      title,
      category,
      description
    };
    writeDb(db);
    res.json({ message: 'Portfolio metadata updated successfully.', item: db.portfolio[idx] });
  });

  app.delete('/api/portfolio/:id', (req, res) => {
    const { id } = req.params;
    const db = readDb();
    db.portfolio = db.portfolio.filter(item => item.id !== id);
    writeDb(db);
    res.json({ message: 'Portfolio image deleted.' });
  });

  // --- Testimonials Management ---
  app.post('/api/testimonials', (req, res) => {
    const testimonial: Partial<TestimonialItem> = req.body;
    if (!testimonial.name || !testimonial.testimonial) {
      return res.status(400).json({ error: 'Name and testimonial statement are required.' });
    }
    const db = readDb();
    const newItem: TestimonialItem = {
      id: `test-${Date.now()}`,
      name: testimonial.name,
      position: testimonial.position || 'Customer',
      testimonial: testimonial.testimonial,
      rating: testimonial.rating || 5,
      imageUrl: testimonial.imageUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80'
    };
    db.testimonials.unshift(newItem);
    writeDb(db);
    res.json({ message: 'Testimonial added successfully.', testimonial: newItem });
  });

  app.put('/api/testimonials/:id', (req, res) => {
    const { id } = req.params;
    const body = req.body;
    const db = readDb();
    const idx = db.testimonials.findIndex(t => t.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Testimonial not found.' });

    db.testimonials[idx] = {
      ...db.testimonials[idx],
      ...body
    };
    writeDb(db);
    res.json({ message: 'Testimonial updated successfully.', testimonial: db.testimonials[idx] });
  });

  app.delete('/api/testimonials/:id', (req, res) => {
    const { id } = req.params;
    const db = readDb();
    db.testimonials = db.testimonials.filter(t => t.id !== id);
    writeDb(db);
    res.json({ message: 'Testimonial deleted.' });
  });

  // --- Bookings Management ---
  app.post('/api/bookings', (req, res) => {
    const booking: Partial<Booking> = req.body;
    if (!booking.customerName || !booking.customerEmail || !booking.customerPhone || !booking.serviceRequested || !booking.preferredDate) {
      return res.status(400).json({ error: 'Missing required booking parameters. Ensure Name, Email, Phone, Service, and Date are supplied.' });
    }

    const db = readDb();
    const newBooking: Booking = {
      id: `bk-${Date.now()}`,
      customerName: booking.customerName,
      customerEmail: booking.customerEmail,
      customerPhone: booking.customerPhone,
      serviceRequested: booking.serviceRequested,
      preferredDate: booking.preferredDate,
      notes: booking.notes || '',
      status: 'New',
      createdAt: new Date().toISOString()
    };
    db.bookings.unshift(newBooking);
    writeDb(db);

    // Dynamic Notifications logic - Simulate Resend / SendGrid API and log actual sent outputs
    const businessEmail = db.settings.business.email || 'info@emmyss.com';
    const companyName = db.settings.business.companyName || 'EMMYSS Studio';

    logSimulatedEmail(
      businessEmail,
      `[Alert] New Booking Request from ${newBooking.customerName}`,
      `Dear Admin,\n\nA new booking has been submitted by ${newBooking.customerName} (${newBooking.customerEmail}) for the service: ${newBooking.serviceRequested} scheduled on ${newBooking.preferredDate}.\n\nNotes: "${newBooking.notes || 'None'}"\n\nLog in to your Admin portal to approve or reject this booking layout.`,
      'Admin Alerts'
    );

    logSimulatedEmail(
      newBooking.customerEmail,
      `Your Booking Request has been received! - ${companyName}`,
      `Hi ${newBooking.customerName},\n\nThank you for booking with ${companyName}! We have received your booking request for the "${newBooking.serviceRequested}" on ${newBooking.preferredDate}.\n\nOur creative staff are verifying availability for this slot. We will update you via email as soon as your booking status is confirmed.\n\nWarm regards,\nEMMYSS Creative Coordinators`,
      'Customer Updates'
    );

    res.json({ message: 'Booking submitted and pending verification!', booking: newBooking });
  });

  app.put('/api/bookings/:id', (req, res) => {
    const { id } = req.params;
    const { status, preferredDate } = req.body;
    const db = readDb();
    const idx = db.bookings.findIndex(b => b.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Booking booking not found.' });

    const prevStatus = db.bookings[idx].status;
    db.bookings[idx] = {
      ...db.bookings[idx],
      ...(status && { status }),
      ...(preferredDate && { preferredDate })
    };
    const b = db.bookings[idx];
    writeDb(db);

    // Notify user of status update
    if (status && status !== prevStatus) {
      const companyName = db.settings.business.companyName || 'EMMYSS Studio';
      logSimulatedEmail(
        b.customerEmail,
        `Booking ${status}! - ${companyName}`,
        `Dear ${b.customerName},\n\nWe have updated your booking ID: ${b.id} to: ${status}.\n\nEvent details:\n- Service: ${b.serviceRequested}\n- Target Date: ${b.preferredDate}\n\nThank you for collaborating with ${companyName}! For custom assistance, reply to this email or contact us at ${db.settings.business.phone}.\n\nSincerely,\nEMMYSS Creative Crew`,
        'Customer Updates'
      );
    }

    res.json({ message: 'Booking updated successfully.', booking: b });
  });

  app.delete('/api/bookings/:id', (req, res) => {
    const { id } = req.params;
    const db = readDb();
    db.bookings = db.bookings.filter(b => b.id !== id);
    writeDb(db);
    res.json({ message: 'Booking entry removed.' });
  });

  // --- Customer Enquiry Management ---
  app.post('/api/enquiries', (req, res) => {
    const enq: Partial<Enquiry> = req.body;
    if (!enq.name || !enq.email || !enq.phone || !enq.message) {
      return res.status(400).json({ error: 'Name, Email, Phone, and Enquiry Message are required.' });
    }

    const db = readDb();
    const newEnq: Enquiry = {
      id: `enq-${Date.now()}`,
      name: enq.name,
      email: enq.email,
      phone: enq.phone,
      serviceRequested: enq.serviceRequested || 'General Discussion',
      message: enq.message,
      status: 'New',
      replies: [],
      createdAt: new Date().toISOString()
    };
    db.enquiries.unshift(newEnq);
    writeDb(db);

    // Notify Admin of contact Submission
    const businessEmail = db.settings.business.email || 'info@emmyss.com';
    logSimulatedEmail(
      businessEmail,
      `[Contact Submission] Enquiry from ${newEnq.name}`,
      `Dear Team,\n\nYou have received a new customer contact enquiry from ${newEnq.name} (${newEnq.email}).\n\nRequested Service: "${newEnq.serviceRequested}"\nMessage: "${newEnq.message}"\n\nPlease view your admin portal to reply to this lead and assign a staff member.`,
      'Admin Alerts'
    );

    res.json({ message: 'Enquiry received. Thank you for reaching out!', enquiry: newEnq });
  });

  // Reply to enquiry
  app.post('/api/enquiries/:id/reply', (req, res) => {
    const { id } = req.params;
    const { message, sender } = req.body;
    if (!message || !sender) {
      return res.status(400).json({ error: 'Reply Message and sender author are required.' });
    }

    const db = readDb();
    const idx = db.enquiries.findIndex(e => e.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Enquiry not found.' });

    const e = db.enquiries[idx];
    if (!e.replies) e.replies = [];

    const newReply = {
      id: `rep-${Date.now()}`,
      sender,
      message,
      date: new Date().toISOString()
    };
    e.replies.push(newReply);
    e.status = 'Replied';
    writeDb(db);

    // Email update to Customer with reply message
    const companyName = db.settings.business.companyName || 'EMMYSS Studio';
    logSimulatedEmail(
      e.email,
      `Re: Your Enquiry at ${companyName}`,
      `Dear ${e.name},\n\nOur team has responded to your enquiry:\n\n"${message}"\n\n---\nAssigned Representative: ${sender}\n${companyName} Support Portal\nPhone: ${db.settings.business.phone}`,
      'Customer Updates'
    );

    res.json({ message: 'Response registered and dispatched to customer.', enquiry: e });
  });

  app.put('/api/enquiries/:id', (req, res) => {
    const { id } = req.params;
    const { status, assignedStaff } = req.body;
    const db = readDb();
    const idx = db.enquiries.findIndex(e => e.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Enquiry not found.' });

    db.enquiries[idx] = {
      ...db.enquiries[idx],
      ...(status && { status }),
      ...(assignedStaff !== undefined && { assignedStaff })
    };
    writeDb(db);
    res.json({ message: 'Enquiry updated.', enquiry: db.enquiries[idx] });
  });

  app.delete('/api/enquiries/:id', (req, res) => {
    const { id } = req.params;
    const db = readDb();
    db.enquiries = db.enquiries.filter(e => e.id !== id);
    writeDb(db);
    res.json({ message: 'Enquiry deleted.' });
  });

  // --- Blog Management ---
  app.post('/api/blog', (req, res) => {
    const post: Partial<BlogPost> = req.body;
    if (!post.title || !post.content) {
      return res.status(400).json({ error: 'Title and content are required.' });
    }
    const db = readDb();
    const slug = (post.title || '')
      .toLowerCase()
      .replace(/[^a-z0-p\s-]/g, '')
      .replace(/\s+/g, '-');
    const newPost: BlogPost = {
      id: `post-${Date.now()}`,
      title: post.title,
      slug,
      content: post.content,
      excerpt: post.excerpt || (post.content.slice(0, 150) + '...'),
      category: post.category || 'Creative',
      tags: post.tags || [],
      status: post.status || 'Draft',
      publishedDate: post.status === 'Published' ? new Date().toISOString().split('T')[0] : undefined,
      createdAt: new Date().toISOString(),
      metaTitle: post.metaTitle || post.title,
      metaDescription: post.metaDescription || post.excerpt,
      keywords: post.keywords || '',
      bannerUrl: post.bannerUrl || 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=600&q=80'
    };
    db.blog.unshift(newPost);
    writeDb(db);
    res.json({ message: 'Blog post created successfully.', post: newPost });
  });

  app.put('/api/blog/:id', (req, res) => {
    const { id } = req.params;
    const body = req.body;
    const db = readDb();
    const idx = db.blog.findIndex(post => post.id === id);
    if (idx === -1) return res.status(444).json({ error: 'Blog post not found.' });

    const prevS = db.blog[idx].status;
    db.blog[idx] = {
      ...db.blog[idx],
      ...body
    };

    if (body.status === 'Published' && prevS !== 'Published') {
      db.blog[idx].publishedDate = new Date().toISOString().split('T')[0];
    }
    writeDb(db);
    res.json({ message: 'Post updated successfully.', post: db.blog[idx] });
  });

  app.delete('/api/blog/:id', (req, res) => {
    const { id } = req.params;
    const db = readDb();
    db.blog = db.blog.filter(p => p.id !== id);
    writeDb(db);
    res.json({ message: 'Blog post removed.' });
  });

  // --- AI Co-Pilot content generator (Gemini 3.5 Flash) ---
  app.post('/api/blog/generate-ai', async (req, res) => {
    const { prompt, topic, category } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'A quick guiding prompt is required for AI writing.' });
    }

    if (!aiClient) {
      // Return beautiful simulated AI response if key is missing, ensuring app preview NEVER breaks!
      const mockOutline = `### Creative Guide to: ${topic || 'Artistic Capture'}

This article details practical steps about ${topic || 'editorial composition'} based on: "${prompt}".

#### Quick Tips:
1. **Define the Focus Contour**: Harness high contrasts and geometric rules of thirds.
2. **Control Negative Space**: Ensure negative space guides the focal eye.
3. **Calibrate Soft Elements**: Match shadows gracefully with warm background filters.`;
      
      const responseText = JSON.stringify({
        title: `Dynamic Insights on: ${topic || 'Visual Art'}`,
        content: mockOutline,
        excerpt: `A professional creative guide exploring modern design and photographic aesthetics related to ${topic || 'artistic elements'}.`,
        metaTitle: `Insights into ${topic || 'Visual Aesthetics'} | EMMYSS Media`,
        metaDescription: `Discover professional secrets and layout theories detailing ${prompt.slice(0, 80)}.`,
        keywords: `${category || 'Creative'}, photography design, composition guides`
      });

      return res.json({ text: responseText, note: 'Simulated preview generation (Provide GEMINI_API_KEY in Secrets panel for real-time generative output).' });
    }

    try {
      const response = await aiClient.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: `You are the lead AI copywriter for EMMYSS Studio, a luxury visual agency.
Write an optimized, beautifully written, professional and creative business-focused blog post layout based on this request:
Topic: ${topic || 'Modern Artistry'}
Category: ${category || 'Education'}
Guiding prompt: ${prompt}

Return absolute valid parsable JSON object with the exact keys:
{
  "title": "A highly punchy, SEO-optimized title",
  "content": "Complete, structured blog article content formatted in clean elegant Markdown with several realistic headers",
  "excerpt": "A short, engaging single-sentence hook to draw in website readers (approx 150 chars)",
  "metaTitle": "Perfect SEO meta-title (under 60 chars)",
  "metaDescription": "Perfect SEO metadescription (under 155 chars)",
  "keywords": "comma, separated, relevant, seo, search, phrases"
}

Respond ONLY with this raw json, no markdown wrappers (no \`\`\`json blocks). Just the pure data.`
      });

      const responseText = response.text || '';
      // Clean potential JSON markdown blocks if Gemini added them despite strict guidelines
      const cleaned = responseText
        .replace(/^```json\s*/i, '')
        .replace(/```\s*$/, '')
        .trim();
        
      try {
        const data = JSON.parse(cleaned);
        return res.json({ text: JSON.stringify(data) });
      } catch (e) {
        // Fallback if parsing fails
        return res.json({ text: responseText });
      }
    } catch (err: any) {
      console.error('Gemini call failed:', err);
      return res.status(500).json({ error: `Gemini copywriting failed: ${err.message || err}` });
    }
  });

  // --- Promotions Management ---
  app.post('/api/promotions', (req, res) => {
    const promo: Partial<Promotion> = req.body;
    if (!promo.title || !promo.description) {
      return res.status(400).json({ error: 'Promotion Title and Description are required.' });
    }
    const db = readDb();
    const newPromo: Promotion = {
      id: `promo-${Date.now()}`,
      title: promo.title,
      description: promo.description,
      bannerUrl: promo.bannerUrl || 'https://images.unsplash.com/photo-1542744094-3a31f103e35f?auto=format&fit=crop&w=600&q=80',
      startDate: promo.startDate || new Date().toISOString().split('T')[0],
      endDate: promo.endDate || new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0],
      status: promo.status || 'Active'
    };
    db.promotions.push(newPromo);
    writeDb(db);
    res.json({ message: 'Promo package configured.', promotion: newPromo });
  });

  app.put('/api/promotions/:id', (req, res) => {
    const { id } = req.params;
    const body = req.body;
    const db = readDb();
    const idx = db.promotions.findIndex(p => p.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Promotion not found.' });

    db.promotions[idx] = {
      ...db.promotions[idx],
      ...body
    };
    writeDb(db);
    res.json({ message: 'Promo updated.', promotion: db.promotions[idx] });
  });

  app.delete('/api/promotions/:id', (req, res) => {
    const { id } = req.params;
    const db = readDb();
    db.promotions = db.promotions.filter(p => p.id !== id);
    writeDb(db);
    res.json({ message: 'Promotion removed.' });
  });

  // --- Site Settings Management ---
  app.put('/api/settings', (req, res) => {
    const body = req.body as SiteSettings;
    const db = readDb();
    db.settings = {
      ...db.settings,
      ...body
    };
    writeDb(db);
    res.json({ message: 'Site global parameters synchronized successfully.', settings: db.settings });
  });

  // --- Email Logs viewing (For CMS Simulation & transparency) ---
  app.get('/api/email-logs', (req, res) => {
    const db = readDb();
    res.json(db.emailLogs || []);
  });

  // --- Visitor Hit logger ---
  app.post('/api/analytics/visit', (req, res) => {
    const { source } = req.body;
    const db = readDb();
    db.visitorStats.totalViews = (db.visitorStats.totalViews || 0) + 1;

    // Track views history on the current day (Jun 07 represents today)
    const todayLabel = 'Jun 07';
    const dayStat = db.visitorStats.viewsHistory.find(d => d.date === todayLabel);
    if (dayStat) {
      dayStat.views += 1;
    } else {
      db.visitorStats.viewsHistory.push({ date: todayLabel, views: 1, bookings: 0 });
    }

    // Accumulate link source views
    if (source) {
      const srcStat = db.visitorStats.sources.find(s => s.name.toLowerCase().includes(source.toLowerCase()));
      if (srcStat) {
        srcStat.count += 1;
      } else {
        db.visitorStats.sources.push({ name: `${source} Direct`, count: 1 });
      }
    }

    writeDb(db);
    res.json({ totalViews: db.visitorStats.totalViews });
  });

  // Fetch full live metrics
  app.get('/api/analytics', (req, res) => {
    const db = readDb();
    const totalBookings = db.bookings.length;
    const pendingCount = db.bookings.filter(b => b.status === 'New' || b.status === 'Pending').length;
    const completedCount = db.bookings.filter(b => b.status === 'Completed').length;
    const totalEnquiries = db.enquiries.length;
    
    // Auto calculate conversion rate (completed/confirmed bookings vs overall views)
    const conversionRate = db.visitorStats.totalViews ? ((totalBookings / db.visitorStats.totalViews) * 100).toFixed(1) : '0';

    // Collect 10 recent activities dynamically
    const activities: Array<{ text: string; date: string; category: string }> = [];
    
    db.bookings.slice(0, 5).forEach(b => {
      activities.push({
        text: `New Booking Request from ${b.customerName} for ${b.serviceRequested}`,
        date: b.createdAt,
        category: 'bookings'
      });
    });

    db.enquiries.slice(0, 5).forEach(e => {
      activities.push({
        text: `New Contact Submission from ${e.name} (${e.serviceRequested})`,
        date: e.createdAt,
        category: 'enquiries'
      });
    });

    db.emailLogs.slice(0, 5).forEach(l => {
      activities.push({
        text: `Dispatched: "${l.subject}" to ${l.recipient}`,
        date: l.timestamp,
        category: 'notifications'
      });
    });

    // Sort active timeline by date payload desc
    activities.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    res.json({
      summary: {
        totalViews: db.visitorStats.totalViews,
        totalBookings,
        pendingBookings: pendingCount,
        completedBookings: completedCount,
        totalEnquiries,
        conversionRate: `${conversionRate}%`,
        totalGalleries: db.portfolio.length,
        totalServices: db.services.length
      },
      viewsHistory: db.visitorStats.viewsHistory,
      sources: db.visitorStats.sources,
      recentActivities: activities.slice(0, 10)
    });
  });

  // --- Serve Client ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`EMMYSS Studio CMS Server booted securely on port ${PORT}`);
  });
}

startServer();
