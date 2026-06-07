import { AppDatabase, ServiceItem, PortfolioItem, TestimonialItem, Booking, Enquiry, BlogPost, Promotion, EmailLog, AdminRole } from '../types';

const LOCAL_STORAGE_KEY = 'emmyss_local_db';

export function getInitialDbState(): AppDatabase {
  return {
    users: [
      {
        id: 'usr-1',
        email: 'admin@emmyss.com',
        name: 'Gideon Superadmin',
        passwordHash: 'c7ad44cbad762a5da0a452f9e854fdc1e0e69a02a3a0ced82f1702d3393b0a99', // sha256 for adminpassword, but on client we did a raw fallback
        role: 'Super Admin'
      },
      {
        id: 'usr-2',
        email: 'manager@emmyss.com',
        name: 'Sarah ContentManager',
        passwordHash: '', // checked on client
        role: 'Content Manager'
      },
      {
        id: 'usr-3',
        email: 'staff@emmyss.com',
        name: 'James Staff',
        passwordHash: '',
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
        testimonial: 'Outstanding birthday session! They captured candid laughter and made me feel incredibly professional, artistic, and relaxed during the studio lights portion.',
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
        accentColor: 'gold'
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

export function getLocalDb(): AppDatabase {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      const initial = getInitialDbState();
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch (e) {
    return getInitialDbState();
  }
}

export function saveLocalDb(db: AppDatabase) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(db));
  } catch (e) {
    console.error('Failed to save state to localStorage:', e);
  }
}

function mockResponse(data: any, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

export async function simulateApi(url: string, init?: RequestInit): Promise<Response> {
  // Extract path and clean queries
  const cleanUrl = url.split('?')[0];
  const urlParts = cleanUrl.split('/').filter(Boolean);
  
  // Reconstruct path inside router format (e.g. /api/db -> pathname '/api/db')
  const pathname = '/' + urlParts.join('/');
  const method = (init?.method || 'GET').toUpperCase();

  console.log(`[Local Interceptor Mock API] Match hit: ${method} ${pathname}`);

  // Base endpoints
  if (pathname === '/api/db') {
    const db = getLocalDb();
    const sanitizedUsers = db.users.map(({ id, email, name, role }) => ({ id, email, name, role }));
    return mockResponse({
      ...db,
      users: sanitizedUsers
    });
  }

  if (pathname === '/api/db/reset' && method === 'POST') {
    const initial = getInitialDbState();
    saveLocalDb(initial);
    return mockResponse({ message: 'Database reset and fully re-seeded successfully.' });
  }

  if (pathname === '/api/auth/login' && method === 'POST') {
    const body = JSON.parse(init?.body as string || '{}');
    const { email, password } = body;
    if (!email || !password) {
      return mockResponse({ error: 'Email and password are required.' }, 400);
    }
    const db = getLocalDb();
    const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return mockResponse({ error: 'Invalid credentials. Check email and password.' }, 401);
    }
    
    // Support default credential match for client testing
    const validPasswords: Record<string, string> = {
      'admin@emmyss.com': 'adminpassword',
      'manager@emmyss.com': 'managerpassword',
      'staff@emmyss.com': 'staffpassword'
    };

    const targetPass = validPasswords[user.email.toLowerCase()];
    if (targetPass && password === targetPass) {
      const mockToken = `emmyss-token-${btoa(JSON.stringify({ id: user.id, role: user.role }))}`;
      return mockResponse({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        token: mockToken
      });
    }

    return mockResponse({ error: 'Invalid credentials. Check email and password.' }, 401);
  }

  if (pathname === '/api/hero' && method === 'PUT') {
    const body = JSON.parse(init?.body as string || '{}');
    const db = getLocalDb();
    db.hero = { ...db.hero, ...body };
    saveLocalDb(db);
    return mockResponse({ message: 'Hero content updated successfully.', hero: db.hero });
  }

  if (pathname === '/api/about' && method === 'PUT') {
    const body = JSON.parse(init?.body as string || '{}');
    const db = getLocalDb();
    db.about = { ...db.about, ...body };
    saveLocalDb(db);
    return mockResponse({ message: 'About content updated successfully.', about: db.about });
  }

  if (pathname === '/api/services' && method === 'POST') {
    const body = JSON.parse(init?.body as string || '{}');
    if (!body.name || !body.category) {
      return mockResponse({ error: 'Service Name and Category are required.' }, 400);
    }
    const db = getLocalDb();
    const newService: ServiceItem = {
      id: `srv-${Date.now()}`,
      name: body.name,
      category: body.category,
      description: body.description || '',
      price: body.price || '',
      imageUrl: body.imageUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
      featured: !!body.featured,
      status: body.status || 'Active'
    };
    db.services.unshift(newService);
    saveLocalDb(db);
    return mockResponse({ message: 'Service added successfully.', service: newService });
  }

  if (pathname === '/api/portfolio' && method === 'POST') {
    const body = JSON.parse(init?.body as string || '{}');
    if (!body.title || !body.category || !body.imageUrl) {
      return mockResponse({ error: 'Title, Category, and Image are required.' }, 400);
    }
    const db = getLocalDb();
    const maxOrder = db.portfolio.reduce((acc, current) => Math.max(acc, current.order || 0), 0);
    const newItem: PortfolioItem = {
      id: `port-${Date.now()}`,
      title: body.title,
      category: body.category,
      imageUrl: body.imageUrl,
      description: body.description || '',
      order: maxOrder + 1
    };
    db.portfolio.push(newItem);
    saveLocalDb(db);
    return mockResponse({ message: 'Portfolio image uploaded successfully.', item: newItem });
  }

  if (pathname === '/api/portfolio/bulk' && method === 'PUT') {
    const body = JSON.parse(init?.body as string || '{}');
    const { orders } = body;
    if (!Array.isArray(orders)) return mockResponse({ error: 'Invalid orders format.' }, 400);
    const db = getLocalDb();
    orders.forEach(({ id, order }) => {
      const p = db.portfolio.find(item => item.id === id);
      if (p) p.order = order;
    });
    db.portfolio.sort((a, b) => a.order - b.order);
    saveLocalDb(db);
    return mockResponse({ message: 'Portfolio ordered updated successfully.', portfolio: db.portfolio });
  }

  if (pathname === '/api/testimonials' && method === 'POST') {
    const body = JSON.parse(init?.body as string || '{}');
    if (!body.name || !body.testimonial) {
      return mockResponse({ error: 'Name and testimonial statement are required.' }, 400);
    }
    const db = getLocalDb();
    const newItem: TestimonialItem = {
      id: `test-${Date.now()}`,
      name: body.name,
      position: body.position || 'Customer',
      testimonial: body.testimonial,
      rating: body.rating || 5,
      imageUrl: body.imageUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80'
    };
    db.testimonials.unshift(newItem);
    saveLocalDb(db);
    return mockResponse({ message: 'Testimonial added successfully.', testimonial: newItem });
  }

  if (pathname === '/api/bookings' && method === 'POST') {
    const body = JSON.parse(init?.body as string || '{}');
    if (!body.customerName || !body.customerEmail || !body.customerPhone || !body.serviceRequested || !body.preferredDate) {
      return mockResponse({ error: 'Missing required booking parameters. Ensure Name, Email, Phone, Service, and Date are supplied.' }, 400);
    }
    const db = getLocalDb();
    const newBooking: Booking = {
      id: `bk-${Date.now()}`,
      customerName: body.customerName,
      customerEmail: body.customerEmail,
      customerPhone: body.customerPhone,
      serviceRequested: body.serviceRequested,
      preferredDate: body.preferredDate,
      notes: body.notes || '',
      status: 'New',
      createdAt: new Date().toISOString()
    };
    db.bookings.unshift(newBooking);

    // Dynamic Notifications logic inside fallback storage
    const businessEmail = db.settings.business.email || 'info@emmyss.com';
    const companyName = db.settings.business.companyName || 'EMMYSS Studio';

    const alerts: EmailLog[] = [
      {
        id: `msg-admin-${Date.now()}`,
        recipient: businessEmail,
        subject: `[Alert] New Booking Request from ${newBooking.customerName}`,
        body: `Dear Admin,\n\nA new booking has been submitted by ${newBooking.customerName} (${newBooking.customerEmail}) for the service: ${newBooking.serviceRequested} scheduled on ${newBooking.preferredDate}.\n\nNotes: "${newBooking.notes || 'None'}"\n\nLog in to your Admin portal to approve or reject this booking layout.`,
        timestamp: new Date().toISOString(),
        type: 'Admin Alerts'
      },
      {
        id: `msg-cust-${Date.now()}`,
        recipient: newBooking.customerEmail,
        subject: `Your Booking Request has been received! - ${companyName}`,
        body: `Hi ${newBooking.customerName},\n\nThank you for booking with ${companyName}! We have received your booking request for the "${newBooking.serviceRequested}" on ${newBooking.preferredDate}.\n\nOur creative staff are verifying availability for this slot. We will update you via email as soon as your booking status is confirmed.\n\nWarm regards,\nEMMYSS Creative Coordinators`,
        timestamp: new Date().toISOString(),
        type: 'Customer Updates'
      }
    ];

    db.emailLogs = [...alerts, ...(db.emailLogs || [])];
    saveLocalDb(db);
    return mockResponse({ message: 'Booking submitted and pending verification!', booking: newBooking });
  }

  if (pathname === '/api/enquiries' && method === 'POST') {
    const body = JSON.parse(init?.body as string || '{}');
    if (!body.name || !body.email || !body.phone || !body.message) {
      return mockResponse({ error: 'Name, Email, Phone, and Enquiry Message are required.' }, 400);
    }
    const db = getLocalDb();
    const newEnq: Enquiry = {
      id: `enq-${Date.now()}`,
      name: body.name,
      email: body.email,
      phone: body.phone,
      serviceRequested: body.serviceRequested || 'General Discussion',
      message: body.message,
      status: 'New',
      replies: [],
      createdAt: new Date().toISOString()
    };
    db.enquiries.unshift(newEnq);

    // Notify Admin of contact Submission
    const businessEmail = db.settings.business.email || 'info@emmyss.com';
    const alert: EmailLog = {
      id: `msg-enq-${Date.now()}`,
      recipient: businessEmail,
      subject: `[Contact Submission] Enquiry from ${newEnq.name}`,
      body: `Dear Team,\n\nYou have received a new customer contact enquiry from ${newEnq.name} (${newEnq.email}).\n\nRequested Service: "${newEnq.serviceRequested}"\nMessage: "${newEnq.message}"\n\nPlease view your admin portal to reply to this lead and assign a staff member.`,
      timestamp: new Date().toISOString(),
      type: 'Admin Alerts'
    };

    db.emailLogs = [alert, ...(db.emailLogs || [])];
    saveLocalDb(db);
    return mockResponse({ message: 'Enquiry received. Thank you for reaching out!', enquiry: newEnq });
  }

  if (pathname === '/api/blog' && method === 'POST') {
    const body = JSON.parse(init?.body as string || '{}');
    if (!body.title || !body.content) {
      return mockResponse({ error: 'Title and content are required.' }, 400);
    }
    const db = getLocalDb();
    const slug = (body.title || '')
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');
    const newPost: BlogPost = {
      id: `post-${Date.now()}`,
      title: body.title,
      slug,
      content: body.content,
      excerpt: body.excerpt || (body.content.slice(0, 150) + '...'),
      category: body.category || 'Creative',
      tags: body.tags || [],
      status: body.status || 'Draft',
      publishedDate: body.status === 'Published' ? new Date().toISOString().split('T')[0] : undefined,
      createdAt: new Date().toISOString(),
      metaTitle: body.metaTitle || body.title,
      metaDescription: body.metaDescription || body.excerpt,
      keywords: body.keywords || '',
      bannerUrl: body.bannerUrl || 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=600&q=80'
    };
    db.blog.unshift(newPost);
    saveLocalDb(db);
    return mockResponse({ message: 'Blog post created successfully.', post: newPost });
  }

  if (pathname === '/api/blog/generate-ai' && method === 'POST') {
    const body = JSON.parse(init?.body as string || '{}');
    const { prompt, topic, category } = body;
    if (!prompt) {
      return mockResponse({ error: 'A quick guiding prompt is required for AI writing.' }, 400);
    }
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

    return mockResponse({ text: responseText, note: 'Simulated preview generation (Client-side fallback)' });
  }

  if (pathname === '/api/promotions' && method === 'POST') {
    const body = JSON.parse(init?.body as string || '{}');
    if (!body.title || !body.description) {
      return mockResponse({ error: 'Promotion Title and Description are required.' }, 400);
    }
    const db = getLocalDb();
    const newPromo: Promotion = {
      id: `promo-${Date.now()}`,
      title: body.title,
      description: body.description,
      bannerUrl: body.bannerUrl || 'https://images.unsplash.com/photo-1542744094-3a31f103e35f?auto=format&fit=crop&w=600&q=80',
      startDate: body.startDate || new Date().toISOString().split('T')[0],
      endDate: body.endDate || new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0],
      status: body.status || 'Active'
    };
    db.promotions.push(newPromo);
    saveLocalDb(db);
    return mockResponse({ message: 'Promo package configured.', promotion: newPromo });
  }

  if (pathname === '/api/settings' && method === 'PUT') {
    const body = JSON.parse(init?.body as string || '{}');
    const db = getLocalDb();
    db.settings = {
      ...db.settings,
      ...body
    };
    saveLocalDb(db);
    return mockResponse({ message: 'Site global parameters synchronized successfully.', settings: db.settings });
  }

  if (pathname === '/api/email-logs') {
    const db = getLocalDb();
    return mockResponse(db.emailLogs || []);
  }

  if (pathname === '/api/analytics/visit' && method === 'POST') {
    const body = JSON.parse(init?.body as string || '{}');
    const { source } = body;
    const db = getLocalDb();
    db.visitorStats.totalViews = (db.visitorStats.totalViews || 0) + 1;

    const todayLabel = 'Jun 07';
    const dayStat = db.visitorStats.viewsHistory.find(d => d.date === todayLabel);
    if (dayStat) {
      dayStat.views += 1;
    } else {
      db.visitorStats.viewsHistory.push({ date: todayLabel, views: 1, bookings: 0 });
    }

    if (source) {
      const srcStat = db.visitorStats.sources.find(s => s.name.toLowerCase().includes(source.toLowerCase()));
      if (srcStat) {
        srcStat.count += 1;
      } else {
        db.visitorStats.sources.push({ name: `${source} Direct`, count: 1 });
      }
    }

    saveLocalDb(db);
    return mockResponse({ totalViews: db.visitorStats.totalViews });
  }

  if (pathname === '/api/analytics') {
    const db = getLocalDb();
    const totalBookings = db.bookings.length;
    const pendingCount = db.bookings.filter(b => b.status === 'New' || b.status === 'Pending').length;
    const completedCount = db.bookings.filter(b => b.status === 'Completed').length;
    const totalEnquiries = db.enquiries.length;
    
    const conversionRate = db.visitorStats.totalViews ? ((totalBookings / db.visitorStats.totalViews) * 100).toFixed(1) : '0';

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

    activities.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return mockResponse({
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
  }

  // --- Regex ID Matchers for Entity Updates & Deletes ---

  // Services
  const srvIdMatch = CleanAndGetId(pathname, 'services');
  if (srvIdMatch) {
    const db = getLocalDb();
    const id = srvIdMatch;
    if (method === 'PUT') {
      const body = JSON.parse(init?.body as string || '{}');
      const idx = db.services.findIndex(s => s.id === id);
      if (idx !== -1) {
        db.services[idx] = { ...db.services[idx], ...body };
        saveLocalDb(db);
        return mockResponse({ message: 'Service updated', service: db.services[idx] });
      }
      return mockResponse({ error: 'Service not found.' }, 404);
    } else if (method === 'DELETE') {
      db.services = db.services.filter(s => s.id !== id);
      saveLocalDb(db);
      return mockResponse({ message: 'Service deleted.' });
    }
  }

  // Portfolio Selection
  const portIdMatch = CleanAndGetId(pathname, 'portfolio');
  if (portIdMatch) {
    const db = getLocalDb();
    const id = portIdMatch;
    if (method === 'PUT') {
      const body = JSON.parse(init?.body as string || '{}');
      const idx = db.portfolio.findIndex(p => p.id === id);
      if (idx !== -1) {
        db.portfolio[idx] = { ...db.portfolio[idx], ...body };
        saveLocalDb(db);
        return mockResponse({ message: 'Portfolio updated', item: db.portfolio[idx] });
      }
      return mockResponse({ error: 'Portfolio not found.' }, 404);
    } else if (method === 'DELETE') {
      db.portfolio = db.portfolio.filter(p => p.id !== id);
      saveLocalDb(db);
      return mockResponse({ message: 'Portfolio item deleted.' });
    }
  }

  // Testimonials
  const testIdMatch = CleanAndGetId(pathname, 'testimonials');
  if (testIdMatch) {
    const db = getLocalDb();
    const id = testIdMatch;
    if (method === 'PUT') {
      const body = JSON.parse(init?.body as string || '{}');
      const idx = db.testimonials.findIndex(t => t.id === id);
      if (idx !== -1) {
        db.testimonials[idx] = { ...db.testimonials[idx], ...body };
        saveLocalDb(db);
        return mockResponse({ message: 'Testimonial updated', testimonial: db.testimonials[idx] });
      }
      return mockResponse({ error: 'Testimonial not found.' }, 404);
    } else if (method === 'DELETE') {
      db.testimonials = db.testimonials.filter(t => t.id !== id);
      saveLocalDb(db);
      return mockResponse({ message: 'Testimonial deleted.' });
    }
  }

  // Bookings
  const bkIdMatch = CleanAndGetId(pathname, 'bookings');
  if (bkIdMatch) {
    const db = getLocalDb();
    const id = bkIdMatch;
    if (method === 'PUT') {
      const body = JSON.parse(init?.body as string || '{}');
      const idx = db.bookings.findIndex(b => b.id === id);
      if (idx !== -1) {
        const prevStatus = db.bookings[idx].status;
        db.bookings[idx] = { ...db.bookings[idx], ...body };
        const b = db.bookings[idx];

        if (body.status && body.status !== prevStatus) {
          const alert: EmailLog = {
            id: `msg-bkupdate-${Date.now()}`,
            recipient: b.customerEmail,
            subject: `Booking ${body.status}! - ${db.settings.business.companyName}`,
            body: `Dear ${b.customerName},\n\nWe have updated your booking ID: ${b.id} to: ${body.status}.`,
            timestamp: new Date().toISOString(),
            type: 'Customer Updates'
          };
          db.emailLogs = [alert, ...(db.emailLogs || [])];
        }

        saveLocalDb(db);
        return mockResponse({ message: 'Booking updated', booking: b });
      }
      return mockResponse({ error: 'Booking not found.' }, 404);
    } else if (method === 'DELETE') {
      db.bookings = db.bookings.filter(b => b.id !== id);
      saveLocalDb(db);
      return mockResponse({ message: 'Booking deleted.' });
    }
  }

  // Enquiries Replies
  const replyMatch = pathname.match(/^\/api\/enquiries\/([^\/]+)\/reply$/);
  if (replyMatch && method === 'POST') {
    const id = replyMatch[1];
    const body = JSON.parse(init?.body as string || '{}');
    if (!body.message || !body.sender) {
      return mockResponse({ error: 'Reply Message and sender author are required.' }, 400);
    }
    const db = getLocalDb();
    const idx = db.enquiries.findIndex(e => e.id === id);
    if (idx !== -1) {
      const e = db.enquiries[idx];
      if (!e.replies) e.replies = [];
      const newReply = {
        id: `rep-${Date.now()}`,
        sender: body.sender,
        message: body.message,
        date: new Date().toISOString()
      };
      e.replies.push(newReply);
      e.status = 'Replied';

      const alert: EmailLog = {
        id: `msg-enqrep-${Date.now()}`,
        recipient: e.email,
        subject: `Re: Your Enquiry at ${db.settings.business.companyName}`,
        body: `Dear ${e.name},\n\nOur team has responded to your enquiry:\n\n"${body.message}"`,
        timestamp: new Date().toISOString(),
        type: 'Customer Updates'
      };
      db.emailLogs = [alert, ...(db.emailLogs || [])];

      saveLocalDb(db);
      return mockResponse({ message: 'Response registered and dispatched.', enquiry: e });
    }
    return mockResponse({ error: 'Enquiry not found.' }, 404);
  }

  // Enquiries Base
  const enqIdMatch = CleanAndGetId(pathname, 'enquiries');
  if (enqIdMatch) {
    const db = getLocalDb();
    const id = enqIdMatch;
    if (method === 'PUT') {
      const body = JSON.parse(init?.body as string || '{}');
      const idx = db.enquiries.findIndex(e => e.id === id);
      if (idx !== -1) {
        db.enquiries[idx] = { ...db.enquiries[idx], ...body };
        saveLocalDb(db);
        return mockResponse({ message: 'Enquiry updated', enquiry: db.enquiries[idx] });
      }
      return mockResponse({ error: 'Enquiry not found.' }, 404);
    } else if (method === 'DELETE') {
      db.enquiries = db.enquiries.filter(e => e.id !== id);
      saveLocalDb(db);
      return mockResponse({ message: 'Enquiry deleted.' });
    }
  }

  // Editorial Blogs
  const blogIdMatch = CleanAndGetId(pathname, 'blog');
  if (blogIdMatch) {
    const db = getLocalDb();
    const id = blogIdMatch;
    if (method === 'PUT') {
      const body = JSON.parse(init?.body as string || '{}');
      const idx = db.blog.findIndex(b => b.id === id);
      if (idx !== -1) {
        const prevS = db.blog[idx].status;
        db.blog[idx] = { ...db.blog[idx], ...body };
        if (body.status === 'Published' && prevS !== 'Published') {
          db.blog[idx].publishedDate = new Date().toISOString().split('T')[0];
        }
        saveLocalDb(db);
        return mockResponse({ message: 'Blog post updated successfully.', post: db.blog[idx] });
      }
      return mockResponse({ error: 'Post not found.' }, 404);
    } else if (method === 'DELETE') {
      db.blog = db.blog.filter(b => b.id !== id);
      saveLocalDb(db);
      return mockResponse({ message: 'Blog post deleted.' });
    }
  }

  // Campaigns / Promotions
  const promoIdMatch = CleanAndGetId(pathname, 'promotions');
  if (promoIdMatch) {
    const db = getLocalDb();
    const id = promoIdMatch;
    if (method === 'PUT') {
      const body = JSON.parse(init?.body as string || '{}');
      const idx = db.promotions.findIndex(p => p.id === id);
      if (idx !== -1) {
        db.promotions[idx] = { ...db.promotions[idx], ...body };
        saveLocalDb(db);
        return mockResponse({ message: 'Promotion updated', promotion: db.promotions[idx] });
      }
      return mockResponse({ error: 'Promo not found.' }, 404);
    } else if (method === 'DELETE') {
      db.promotions = db.promotions.filter(p => p.id !== id);
      saveLocalDb(db);
      return mockResponse({ message: 'Promotion deleted.' });
    }
  }

  // Default fallback response
  return mockResponse({ error: 'Endpoint simulated fallback map failed.' }, 404);
}

// Utility to match slugs or resource IDs cleanly
function CleanAndGetId(pathname: string, collectionName: string): string | null {
  const prefix = `/api/${collectionName}/`;
  if (pathname.startsWith(prefix)) {
    const id = pathname.slice(prefix.length);
    if (id && !id.includes('/')) return id;
  }
  return null;
}
