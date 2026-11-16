import express, { type Request, type Response, type NextFunction } from 'express';
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import dotenv from 'dotenv';

dotenv.config();

const PORT = Number(process.env.PORT || 3000);
const IS_PROD = process.env.NODE_ENV === 'production';
const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_PATH = path.join(DATA_DIR, 'agency-db.json');
const ADMIN_PASSCODE = process.env.ADMIN_PASSCODE || 'buildtech-admin-2026';
const SESSION_SECRET = process.env.SESSION_SECRET || 'bt-session-secret-key-2026';

interface ServiceItem {
  id: string;
  number: string;
  title: string;
  description: string;
  deliverables: string[];
  visualType: 'web' | 'software' | 'marketing' | 'meta' | 'google' | 'branding';
  highlights: string;
}

interface ProjectItem {
  id: string;
  title: string;
  category: string;
  shortDescription: string;
  fullSummary: string;
  technologies: string[];
  imageUrl: string;
  projectUrl: string;
  isDemo: boolean;
}

interface TestimonialItem {
  id: string;
  quote: string;
  authorName: string;
  authorRole: string;
  companyName: string;
  isPlaceholder: boolean;
}

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

interface InquiryItem {
  id: string;
  fullName: string;
  businessEmail: string;
  companyName: string;
  country: string;
  serviceRequired: string;
  projectBudget: string;
  projectDetails: string;
  status: 'new' | 'reviewed' | 'archived';
  createdAt: string;
}

interface SiteContent {
  heroHeadline: string;
  heroSupportingText: string;
  heroPrimaryCta: string;
  heroSecondaryCta: string;
  trustHeading: string;
  trustDescription: string;
  aboutHeading: string;
  aboutDescription: string;
  aboutMission: string;
  aboutVision: string;
  aboutApproach: string;
  marketingHeadline: string;
  marketingDescription: string;
  marketingCta: string;
  contactHeadline: string;
  contactDescription: string;
  contactEmail: string;
  phoneNumber: string;
  footerTagline: string;
  footerDescription: string;
  socialLinks: {
    linkedin: string;
    twitter: string;
    instagram: string;
    facebook: string;
    github: string;
  };
}

interface AgencyDatabase {
  siteContent: SiteContent;
  services: ServiceItem[];
  projects: ProjectItem[];
  testimonials: TestimonialItem[];
  faqs: FaqItem[];
  inquiries: InquiryItem[];
}

const DEFAULT_DB: AgencyDatabase = {
  siteContent: {
    heroHeadline: 'Transforming Ideas Into Powerful Digital Experiences.',
    heroSupportingText:
      'We build innovative websites, intelligent software solutions, and result-driven digital marketing strategies that help businesses grow, scale and succeed in the digital world.',
    heroPrimaryCta: "Let's Build Something Great",
    heroSecondaryCta: 'Explore Our Services',
    trustHeading: 'Your Technology Partner for Digital Growth',
    trustDescription:
      'From building powerful digital products to generating measurable business growth, we help brands turn their vision into reality through technology and innovation.',
    aboutHeading: 'Technology, Creativity & Strategy. All Under One Roof.',
    aboutDescription:
      'Build Technology is a digital solutions agency focused on helping businesses establish a powerful online presence. We combine modern development, creative thinking and performance-driven marketing to deliver digital solutions that create real business value.',
    aboutMission:
      'To engineer reliable, scalable digital products and performance marketing engines that turn complex business objectives into measurable commercial momentum.',
    aboutVision:
      'To serve as a trusted international technology partner for ambitious organizations across North America, Europe, the Middle East, and global growth markets.',
    aboutApproach:
      'Every engagement starts with operational clarity—aligning software architecture, intuitive user experience, and full-funnel customer acquisition from day one.',
    marketingHeadline: 'More Visibility. More Customers. More Growth.',
    marketingDescription:
      'We connect engineering precision with full-funnel acquisition across Meta Advertising, Google Advertising, technical SEO, social media growth, lead generation, and conversion rate optimization.',
    marketingCta: 'Grow Your Business',
    contactHeadline: "Let's Turn Your Ideas Into Reality.",
    contactDescription:
      'Have a project in mind? Let’s discuss how Build Technology can help your business grow.',
    contactEmail: 'buildtechnology56@gmail.com',
    phoneNumber: '+92 3322846238 Syed Mahdi Kazmi, +92 3112713755 Syed Haider Rizvi',
    footerTagline: 'Building Digital Experiences. Empowering Business Growth.',
    footerDescription:
      'International software engineering, custom web platforms, and performance digital marketing studio partnering with forward-thinking companies.',
    socialLinks: {
      linkedin: '',
      twitter: '',
      instagram: 'https://www.instagram.com/buildtechnology35?xtok=cWllOWJ2YmtucDJt',
      facebook: '',
      github: '',
    },
  },
  services: [
    {
      id: 'svc-web',
      number: '01',
      title: 'Web Development',
      description:
        'Modern, scalable and high-performance websites designed to turn visitors into customers.',
      deliverables: [
        'Business Websites',
        'Corporate Websites',
        'E-commerce Development',
        'Custom Web Applications',
        'Landing Pages',
        'Website Redesign',
        'Responsive Development',
      ],
      visualType: 'web',
      highlights:
        'Engineered for fast global load times, clean semantic SEO architecture, and conversion-ready user journeys across desktop and mobile.',
    },
    {
      id: 'svc-software',
      number: '02',
      title: 'Software Development',
      description:
        'Custom software solutions that simplify operations, automate workflows and improve business efficiency.',
      deliverables: [
        'Custom Software Development',
        'CRM Systems',
        'ERP Solutions',
        'Business Management Systems',
        'Automation Solutions',
        'Dashboard Development',
        'AI-Powered Applications',
      ],
      visualType: 'software',
      highlights:
        'Modular cloud-ready architectures, role-based internal portals, real-time analytics dashboards, and intelligent workflow automation.',
    },
    {
      id: 'svc-marketing',
      number: '03',
      title: 'Digital Marketing',
      description:
        'Strategic digital marketing solutions that increase brand awareness, reach the right audience and generate business opportunities.',
      deliverables: [
        'Social Media Marketing',
        'Facebook Marketing',
        'Instagram Marketing',
        'Content Strategy',
        'Social Media Management',
        'Brand Growth Strategy',
      ],
      visualType: 'marketing',
      highlights:
        'Cohesive editorial calendars, channel positioning, and audience nurturing built to compound brand equity across international markets.',
    },
    {
      id: 'svc-meta',
      number: '04',
      title: 'Meta Ads',
      description:
        'Performance-focused advertising campaigns designed to generate qualified leads, increase sales and maximize advertising returns.',
      deliverables: [
        'Facebook Ads',
        'Instagram Ads',
        'Lead Generation Campaigns',
        'E-commerce Advertising',
        'Retargeting Campaigns',
        'Campaign Optimization',
        'Audience Targeting',
      ],
      visualType: 'meta',
      highlights:
        'Structured creative testing, server-side conversion tracking, multi-stage retargeting funnels, and disciplined return-on-ad-spend optimization.',
    },
    {
      id: 'svc-google-seo',
      number: '05',
      title: 'Google Ads & SEO',
      description:
        'Improve your search visibility, reach high-intent customers and grow your business through data-driven search marketing.',
      deliverables: [
        'Google Search Ads',
        'YouTube Ads',
        'Performance Max Campaigns',
        'Search Engine Optimization',
        'Local SEO',
        'Google Business Profile Optimization',
        'Keyword Research',
      ],
      visualType: 'google',
      highlights:
        'High-intent search capture pairing technical on-page SEO and regional visibility with precision Google Search and Performance Max bidding.',
    },
    {
      id: 'svc-branding',
      number: '06',
      title: 'Branding & Creative Design',
      description:
        'Build a memorable brand identity with professional visual experiences that communicate your business value.',
      deliverables: [
        'Logo Design',
        'Brand Identity',
        'Graphic Design',
        'Social Media Creatives',
        'Marketing Designs',
        'Creative Campaign Assets',
      ],
      visualType: 'branding',
      highlights:
        'Distinctive visual identities, typography systems, and campaign creative toolkits built to command authority across every customer touchpoint.',
    },
  ],
  projects: [
    {
      id: 'proj-commerce',
      title: 'International Multi-Currency Storefront Architecture',
      category: 'Web & E-Commerce',
      shortDescription:
        'Demo storefront concept featuring regional currency localization, fast filterable product discovery, and streamlined checkout architecture.',
      fullSummary:
        'A conceptual demonstration of an international retail web platform engineered for rapid page transitions, multi-region currency handling, and clean editorial product merchandising. Created as an illustrative demo showcasing Build Technology e-commerce engineering standards.',
      technologies: ['Next.js', 'React', 'Node.js', 'Shopify', 'CSS3'],
      imageUrl: 'demo:commerce',
      projectUrl: '#contact',
      isDemo: true,
    },
    {
      id: 'proj-erp',
      title: 'Unified Operations & Resource ERP Workspace',
      category: 'Software & ERP',
      shortDescription:
        'Demo enterprise management portal integrating project pipelines, resource allocation views, and automated executive reporting.',
      fullSummary:
        'An illustrative custom software demonstration designed to unify cross-departmental workflows, task pipelines, and live operational reporting inside a single responsive web workspace.',
      technologies: ['React', 'Node.js', 'Python', 'MySQL', 'AI Technologies'],
      imageUrl: 'demo:erp',
      projectUrl: '#contact',
      isDemo: true,
    },
    {
      id: 'proj-marketing',
      title: 'Cross-Channel Acquisition & Creative Studio System',
      category: 'Digital Marketing',
      shortDescription:
        'Demo performance marketing framework combining Meta & Google attribution analytics with modular ad creative testing boards.',
      fullSummary:
        'An illustrative campaign architecture demonstrating how Build Technology pairs structured ad creative testing with regional audience attribution across Meta Ads, Google Search, and SEO landing pages.',
      technologies: ['Meta Ads', 'Google Ads', 'SEO', 'JavaScript', 'Next.js'],
      imageUrl: 'demo:marketing',
      projectUrl: '#contact',
      isDemo: true,
    },
    {
      id: 'proj-branding',
      title: 'Modular Corporate Identity & Digital Design System',
      category: 'Branding & Design',
      shortDescription:
        'Demo brand system unifying executive print collateral, responsive web typography, and digital campaign guidelines.',
      fullSummary:
        'An illustrative branding showcase displaying cohesive identity systems across corporate stationery, web interfaces, and mobile experiences.',
      technologies: ['Brand Identity', 'UI Architecture', 'HTML5', 'CSS3'],
      imageUrl: 'demo:branding',
      projectUrl: '#contact',
      isDemo: true,
    },
  ],
  testimonials: [
    {
      id: 'test-1',
      quote:
        'Placeholder slot reserved for a verified client review. Replace this entry with a genuine client endorsement, role, and company name from the Admin Dashboard once published.',
      authorName: 'Client Review Placeholder 01',
      authorRole: 'Editable Executive Role',
      companyName: 'Verified Client Organization (Pending)',
      isPlaceholder: true,
    },
    {
      id: 'test-2',
      quote:
        'Placeholder slot reserved for a verified software engineering client testimonial. Easily update or replace with authentic feedback inside the Build Technology Admin Portal.',
      authorName: 'Client Review Placeholder 02',
      authorRole: 'Editable Operations Lead',
      companyName: 'Verified Client Organization (Pending)',
      isPlaceholder: true,
    },
    {
      id: 'test-3',
      quote:
        'Placeholder slot reserved for a verified digital marketing partner story. Manage, publish, or remove testimonial entries anytime through the Admin Dashboard.',
      authorName: 'Client Review Placeholder 03',
      authorRole: 'Editable Growth Director',
      companyName: 'Verified Client Organization (Pending)',
      isPlaceholder: true,
    },
  ],
  faqs: [
    {
      id: 'faq-1',
      question: 'What services does Build Technology provide?',
      answer:
        'Build Technology delivers end-to-end digital capabilities across Web Development, Custom Software Development (CRM, ERP, automation, and AI-powered applications), Digital Marketing, Meta Ads, Google Ads & SEO, and Branding & Creative Design.',
    },
    {
      id: 'faq-2',
      question: 'Do you work with international clients?',
      answer:
        'Yes. We partner remotely and asynchronously with companies across the USA, UK, Canada, UAE, and other international markets, aligning communication and delivery milestones to your time zone.',
    },
    {
      id: 'faq-3',
      question: 'Can you build custom websites and software?',
      answer:
        'Yes. Every website, web application, CRM, ERP, or workflow automation tool we build is tailored around your exact operational requirements, user workflows, and scalability roadmap.',
    },
    {
      id: 'faq-4',
      question: 'Do you provide e-commerce solutions?',
      answer:
        'Yes. We design and engineer high-converting online stores using Shopify, WordPress/WooCommerce, and custom headless React or Next.js storefronts with multi-currency and conversion-focused checkout flows.',
    },
    {
      id: 'faq-5',
      question: 'Do you manage Facebook and Instagram advertising?',
      answer:
        'Yes. Our performance marketing team plans, designs, launches, and optimizes full-funnel Facebook and Instagram campaigns covering lead generation, e-commerce sales, audience targeting, and retargeting.',
    },
    {
      id: 'faq-6',
      question: 'Do you offer Google Ads and SEO?',
      answer:
        'Yes. We manage Google Search Ads, YouTube Ads, and Performance Max campaigns alongside technical Search Engine Optimization, Local SEO, keyword research, and Google Business Profile optimization.',
    },
    {
      id: 'faq-7',
      question: 'How can I start a project?',
      answer:
        'Complete the project inquiry form in our Contact section with your goals, required service, and timeline. Our team reviews every submission and responds promptly to schedule an initial discovery discussion.',
    },
    {
      id: 'faq-8',
      question: 'How can I request a quotation?',
      answer:
        'Submit your project scope and estimated budget range through the inquiry form below. Following a brief discovery call to clarify technical or campaign requirements, we prepare a transparent, itemized proposal.',
    },
  ],
  inquiries: [],
};

let dbWriteChain = Promise.resolve();

async function ensureDb(): Promise<AgencyDatabase> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    const raw = await fs.readFile(DB_PATH, 'utf-8');
    const parsed = JSON.parse(raw) as Partial<AgencyDatabase>;
    return {
      siteContent: {
        ...DEFAULT_DB.siteContent,
        ...(parsed.siteContent || {}),
        socialLinks: {
          ...DEFAULT_DB.siteContent.socialLinks,
          ...(parsed.siteContent?.socialLinks || {}),
        },
      },
      services: Array.isArray(parsed.services) && parsed.services.length > 0 ? parsed.services : DEFAULT_DB.services,
      projects: Array.isArray(parsed.projects) ? parsed.projects : DEFAULT_DB.projects,
      testimonials: Array.isArray(parsed.testimonials) ? parsed.testimonials : DEFAULT_DB.testimonials,
      faqs: Array.isArray(parsed.faqs) ? parsed.faqs : DEFAULT_DB.faqs,
      inquiries: Array.isArray(parsed.inquiries) ? parsed.inquiries : [],
    };
  } catch {
    await saveDb(DEFAULT_DB);
    return structuredClone(DEFAULT_DB);
  }
}

async function saveDb(nextDb: AgencyDatabase): Promise<void> {
  dbWriteChain = dbWriteChain.then(async () => {
    await fs.mkdir(DATA_DIR, { recursive: true });
    const tmpPath = `${DB_PATH}.tmp`;
    await fs.writeFile(tmpPath, JSON.stringify(nextDb, null, 2), 'utf-8');
    await fs.rename(tmpPath, DB_PATH);
  });
  return dbWriteChain;
}

function createSessionToken(): string {
  const payload = Buffer.from(
    JSON.stringify({
      role: 'admin',
      exp: Date.now() + 1000 * 60 * 60 * 24 * 7,
    }),
  ).toString('base64url');
  const signature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(payload)
    .digest('base64url');
  return `${payload}.${signature}`;
}

function verifySessionToken(token: string | undefined): boolean {
  if (!token) return false;
  const parts = token.split('.');
  if (parts.length !== 2) return false;
  const [payload, signature] = parts;
  const expected = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(payload)
    .digest('base64url');
  if (signature.length !== expected.length) return false;
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
    return false;
  }
  try {
    const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf-8')) as {
      role?: string;
      exp?: number;
    };
    return decoded.role === 'admin' && typeof decoded.exp === 'number' && decoded.exp > Date.now();
  } catch {
    return false;
  }
}

function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7).trim() : undefined;
  if (!verifySessionToken(token)) {
    res.status(401).json({ error: 'Unauthorized admin session.' });
    return;
  }
  next();
}

function sanitizeString(value: unknown, maxLen: number): string {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, maxLen);
}

async function startServer() {
  await ensureDb();

  const app = express();
  app.use(express.json({ limit: '1mb' }));

  // SEO endpoints
  app.get('/robots.txt', (_req, res) => {
    const baseUrl = process.env.APP_URL || '';
    const sitemapLine = baseUrl ? `\nSitemap: ${baseUrl.replace(/\/$/, '')}/sitemap.xml` : '';
    res.type('text/plain').send(`User-agent: *\nAllow: /${sitemapLine}\n`);
  });

  app.get('/sitemap.xml', (req, res) => {
    const origin = (process.env.APP_URL || `${req.protocol}://${req.get('host')}`).replace(/\/$/, '');
    const now = new Date().toISOString().split('T')[0];
    res.type('application/xml').send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${origin}/</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`);
  });

  // Public content endpoint (never leaks inquiries)
  app.get('/api/content', async (_req, res) => {
    try {
      const db = await ensureDb();
      res.json({
        siteContent: db.siteContent,
        services: db.services,
        projects: db.projects,
        testimonials: db.testimonials,
        faqs: db.faqs,
      });
    } catch {
      res.status(500).json({ error: 'Unable to load website content.' });
    }
  });

  // Public inquiry submission endpoint
  app.post('/api/inquiries', async (req, res) => {
    try {
      const fullName = sanitizeString(req.body?.fullName, 120);
      const businessEmail = sanitizeString(req.body?.businessEmail, 160);
      const companyName = sanitizeString(req.body?.companyName, 140);
      const country = sanitizeString(req.body?.country, 100);
      const serviceRequired = sanitizeString(req.body?.serviceRequired, 100);
      const projectBudget = sanitizeString(req.body?.projectBudget, 100);
      const projectDetails = sanitizeString(req.body?.projectDetails, 4000);

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!fullName || fullName.length < 2) {
        res.status(400).json({ error: 'Please enter your full name.' });
        return;
      }
      if (!emailRegex.test(businessEmail)) {
        res.status(400).json({ error: 'Please enter a valid business email address.' });
        return;
      }
      if (!country) {
        res.status(400).json({ error: 'Please specify your country or region.' });
        return;
      }
      if (!serviceRequired) {
        res.status(400).json({ error: 'Please select a required service.' });
        return;
      }
      if (!projectDetails || projectDetails.length < 10) {
        res.status(400).json({ error: 'Please share a brief overview of your project details.' });
        return;
      }

      const db = await ensureDb();
      const inquiry: InquiryItem = {
        id: `inq-${crypto.randomUUID().slice(0, 8)}`,
        fullName,
        businessEmail,
        companyName,
        country,
        serviceRequired,
        projectBudget: projectBudget || 'To be discussed',
        projectDetails,
        status: 'new',
        createdAt: new Date().toISOString(),
      };
      db.inquiries.unshift(inquiry);
      await saveDb(db);

      res.status(201).json({
        success: true,
        inquiryId: inquiry.id,
        message: 'Thank you. Your project inquiry has been securely received by Build Technology.',
      });
    } catch {
      res.status(500).json({ error: 'Failed to submit project inquiry.' });
    }
  });

  // Admin auth
  app.post('/api/admin/login', (req, res) => {
    const passcode = typeof req.body?.passcode === 'string' ? req.body.passcode : '';
    if (!passcode || passcode !== ADMIN_PASSCODE) {
      res.status(401).json({ error: 'Invalid admin passcode.' });
      return;
    }
    const token = createSessionToken();
    res.json({ token });
  });

  app.get('/api/admin/verify', requireAdmin, (_req, res) => {
    res.json({ authenticated: true });
  });

  // Full admin state
  app.get('/api/admin/data', requireAdmin, async (_req, res) => {
    try {
      const db = await ensureDb();
      res.json(db);
    } catch {
      res.status(500).json({ error: 'Unable to load admin data.' });
    }
  });

  app.put('/api/admin/site-content', requireAdmin, async (req, res) => {
    try {
      const db = await ensureDb();
      const body = req.body || {};
      const next: SiteContent = {
        heroHeadline: sanitizeString(body.heroHeadline, 200) || db.siteContent.heroHeadline,
        heroSupportingText: sanitizeString(body.heroSupportingText, 600) || db.siteContent.heroSupportingText,
        heroPrimaryCta: sanitizeString(body.heroPrimaryCta, 80) || db.siteContent.heroPrimaryCta,
        heroSecondaryCta: sanitizeString(body.heroSecondaryCta, 80) || db.siteContent.heroSecondaryCta,
        trustHeading: sanitizeString(body.trustHeading, 200) || db.siteContent.trustHeading,
        trustDescription: sanitizeString(body.trustDescription, 600) || db.siteContent.trustDescription,
        aboutHeading: sanitizeString(body.aboutHeading, 200) || db.siteContent.aboutHeading,
        aboutDescription: sanitizeString(body.aboutDescription, 800) || db.siteContent.aboutDescription,
        aboutMission: sanitizeString(body.aboutMission, 500) || db.siteContent.aboutMission,
        aboutVision: sanitizeString(body.aboutVision, 500) || db.siteContent.aboutVision,
        aboutApproach: sanitizeString(body.aboutApproach, 500) || db.siteContent.aboutApproach,
        marketingHeadline: sanitizeString(body.marketingHeadline, 200) || db.siteContent.marketingHeadline,
        marketingDescription: sanitizeString(body.marketingDescription, 600) || db.siteContent.marketingDescription,
        marketingCta: sanitizeString(body.marketingCta, 80) || db.siteContent.marketingCta,
        contactHeadline: sanitizeString(body.contactHeadline, 200) || db.siteContent.contactHeadline,
        contactDescription: sanitizeString(body.contactDescription, 500) || db.siteContent.contactDescription,
        contactEmail: sanitizeString(body.contactEmail, 160) || db.siteContent.contactEmail,
        phoneNumber: sanitizeString(body.phoneNumber, 240),
        footerTagline: sanitizeString(body.footerTagline, 200) || db.siteContent.footerTagline,
        footerDescription: sanitizeString(body.footerDescription, 500) || db.siteContent.footerDescription,
        socialLinks: {
          linkedin: sanitizeString(body.socialLinks?.linkedin, 300),
          twitter: sanitizeString(body.socialLinks?.twitter, 300),
          instagram: sanitizeString(body.socialLinks?.instagram, 300),
          facebook: sanitizeString(body.socialLinks?.facebook, 300),
          github: sanitizeString(body.socialLinks?.github, 300),
        },
      };
      db.siteContent = next;
      await saveDb(db);
      res.json(db.siteContent);
    } catch {
      res.status(500).json({ error: 'Failed to update site content.' });
    }
  });

  app.put('/api/admin/services', requireAdmin, async (req, res) => {
    try {
      const items = Array.isArray(req.body?.services) ? req.body.services : null;
      if (!items) {
        res.status(400).json({ error: 'Invalid services payload.' });
        return;
      }
      const db = await ensureDb();
      db.services = items.map((s: Partial<ServiceItem>, idx: number) => ({
        id: sanitizeString(s.id, 60) || `svc-${idx + 1}`,
        number: sanitizeString(s.number, 10) || String(idx + 1).padStart(2, '0'),
        title: sanitizeString(s.title, 120) || 'Service',
        description: sanitizeString(s.description, 500),
        deliverables: Array.isArray(s.deliverables)
          ? s.deliverables.map((d) => sanitizeString(d, 100)).filter(Boolean)
          : [],
        visualType: s.visualType || 'web',
        highlights: sanitizeString(s.highlights, 500),
      }));
      await saveDb(db);
      res.json(db.services);
    } catch {
      res.status(500).json({ error: 'Failed to update services.' });
    }
  });

  app.put('/api/admin/projects', requireAdmin, async (req, res) => {
    try {
      const items = Array.isArray(req.body?.projects) ? req.body.projects : null;
      if (!items) {
        res.status(400).json({ error: 'Invalid projects payload.' });
        return;
      }
      const db = await ensureDb();
      db.projects = items.map((p: Partial<ProjectItem>, idx: number) => ({
        id: sanitizeString(p.id, 60) || `proj-${crypto.randomUUID().slice(0, 6)}-${idx}`,
        title: sanitizeString(p.title, 140) || 'Untitled Project',
        category: sanitizeString(p.category, 80) || 'Web & E-Commerce',
        shortDescription: sanitizeString(p.shortDescription, 350),
        fullSummary: sanitizeString(p.fullSummary, 1200),
        technologies: Array.isArray(p.technologies)
          ? p.technologies.map((t) => sanitizeString(t, 60)).filter(Boolean)
          : [],
        imageUrl: sanitizeString(p.imageUrl, 500) || 'demo:commerce',
        projectUrl: sanitizeString(p.projectUrl, 500) || '#contact',
        isDemo: Boolean(p.isDemo),
      }));
      await saveDb(db);
      res.json(db.projects);
    } catch {
      res.status(500).json({ error: 'Failed to update projects.' });
    }
  });

  app.put('/api/admin/testimonials', requireAdmin, async (req, res) => {
    try {
      const items = Array.isArray(req.body?.testimonials) ? req.body.testimonials : null;
      if (!items) {
        res.status(400).json({ error: 'Invalid testimonials payload.' });
        return;
      }
      const db = await ensureDb();
      db.testimonials = items.map((t: Partial<TestimonialItem>, idx: number) => ({
        id: sanitizeString(t.id, 60) || `test-${crypto.randomUUID().slice(0, 6)}-${idx}`,
        quote: sanitizeString(t.quote, 800),
        authorName: sanitizeString(t.authorName, 120),
        authorRole: sanitizeString(t.authorRole, 120),
        companyName: sanitizeString(t.companyName, 120),
        isPlaceholder: Boolean(t.isPlaceholder),
      }));
      await saveDb(db);
      res.json(db.testimonials);
    } catch {
      res.status(500).json({ error: 'Failed to update testimonials.' });
    }
  });

  app.put('/api/admin/faqs', requireAdmin, async (req, res) => {
    try {
      const items = Array.isArray(req.body?.faqs) ? req.body.faqs : null;
      if (!items) {
        res.status(400).json({ error: 'Invalid FAQs payload.' });
        return;
      }
      const db = await ensureDb();
      db.faqs = items.map((f: Partial<FaqItem>, idx: number) => ({
        id: sanitizeString(f.id, 60) || `faq-${crypto.randomUUID().slice(0, 6)}-${idx}`,
        question: sanitizeString(f.question, 240),
        answer: sanitizeString(f.answer, 1500),
      }));
      await saveDb(db);
      res.json(db.faqs);
    } catch {
      res.status(500).json({ error: 'Failed to update FAQs.' });
    }
  });

  app.patch('/api/admin/inquiries/:id', requireAdmin, async (req, res) => {
    try {
      const db = await ensureDb();
      const target = db.inquiries.find((i) => i.id === req.params.id);
      if (!target) {
        res.status(404).json({ error: 'Inquiry not found.' });
        return;
      }
      const status = req.body?.status;
      if (status === 'new' || status === 'reviewed' || status === 'archived') {
        target.status = status;
        await saveDb(db);
      }
      res.json(target);
    } catch {
      res.status(500).json({ error: 'Failed to update inquiry.' });
    }
  });

  app.delete('/api/admin/inquiries/:id', requireAdmin, async (req, res) => {
    try {
      const db = await ensureDb();
      db.inquiries = db.inquiries.filter((i) => i.id !== req.params.id);
      await saveDb(db);
      res.json({ success: true });
    } catch {
      res.status(500).json({ error: 'Failed to delete inquiry.' });
    }
  });

  if (IS_PROD) {
    const distDir = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Build Technology server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Server startup failure:', err);
  process.exit(1);
});
