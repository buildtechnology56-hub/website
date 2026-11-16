import { useCallback, useEffect, useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Cpu,
  Globe,
  Layers,
  Lightbulb,
  LineChart,
  MessageSquare,
  Rocket,
  Send,
  ShieldCheck,
  TrendingUp,
  Users,
} from 'lucide-react';
import { AgencyDatabase, ProjectItem, ServiceItem } from './types/agency';
import { DEFAULT_PUBLIC_CONTENT } from './lib/defaultContent';
import { resolveProjectImage } from './lib/projectImages';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HeroVisualComposition } from './components/HeroVisualComposition';
import { AboutScene } from './components/three/AboutScene';
import { ServiceVisual3D } from './components/ServiceVisual3D';
import { TECH_STACK, TechBadgeMark } from './components/TechIcons';
import { MarketingDashboardPreview } from './components/MarketingDashboardPreview';
import { ContactSection } from './components/ContactSection';
import { ProjectDetailModal, ServiceDetailModal } from './components/Modals';
import { AdminDashboard } from './components/AdminDashboard';

const PROCESS_STEPS = [
  {
    step: '01',
    title: 'Discover',
    summary: 'We understand your business, goals and requirements.',
    detail:
      'We audit your operational workflows, target markets, competitive landscape, and technical constraints before writing a single line of code or launching an ad.',
  },
  {
    step: '02',
    title: 'Strategize',
    summary: 'We create a clear strategy and project roadmap.',
    detail:
      'Architecture blueprints, user journey maps, milestone schedules, and channel acquisition plans are aligned around measurable commercial outcomes.',
  },
  {
    step: '03',
    title: 'Design & Develop',
    summary: 'We transform ideas into professional digital solutions.',
    detail:
      'Iterative UI/UX crafting, clean full-stack software engineering, and conversion-focused creative production built with transparent weekly reviews.',
  },
  {
    step: '04',
    title: 'Launch',
    summary: 'We deliver, test and launch your project.',
    detail:
      'Rigorous cross-device QA, speed optimization, analytics instrumentation, and seamless production deployment across cloud and marketing channels.',
  },
  {
    step: '05',
    title: 'Grow',
    summary: 'We help you improve, optimize and scale.',
    detail:
      'Continuous performance monitoring, SEO expansion, paid media optimization, and iterative feature releases designed for long-term scalability.',
  },
];

const ADVANTAGES = [
  {
    icon: Layers,
    title: 'Tailored Digital Solutions',
    description:
      'Every architecture, interface, and campaign is engineered around your exact business model rather than rigid off-the-shelf templates.',
  },
  {
    icon: Cpu,
    title: 'Modern Technologies',
    description:
      'We build with proven modern frameworks, cloud databases, and AI-enabled automation designed for reliability and speed.',
  },
  {
    icon: Users,
    title: 'User-Focused Experiences',
    description:
      'Intuitive navigation, accessible typography, and friction-free workflows turn first-time visitors into confident customers.',
  },
  {
    icon: LineChart,
    title: 'Performance-Driven Strategies',
    description:
      'Engineering decisions and marketing budgets are anchored to qualified lead generation, conversion efficiency, and ROI.',
  },
  {
    icon: MessageSquare,
    title: 'Transparent Communication',
    description:
      'Clear milestones, structured reporting, and responsive collaboration across North American, European, and Middle Eastern time zones.',
  },
  {
    icon: TrendingUp,
    title: 'Long-Term Growth Mindset',
    description:
      'We design maintainable systems and compounding acquisition engines built to support your next stage of international expansion.',
  },
];

const HERO_PILLARS = [
  {
    icon: Lightbulb,
    title: 'Innovation First',
    subtitle: 'Modern engineering & AI',
  },
  {
    icon: ShieldCheck,
    title: 'Results Driven',
    subtitle: 'ROI & conversion focus',
  },
  {
    icon: Rocket,
    title: 'Built for Growth',
    subtitle: 'Scalable architecture',
  },
  {
    icon: Globe,
    title: 'Karachi & Global',
    subtitle: 'USA · UK · Canada · UAE',
  },
];

const INDIGO_BAND_PILLARS = [
  {
    icon: Lightbulb,
    title: 'Innovation First',
    subtitle: 'Thoughtful web, software & AI capabilities built for practical business leverage.',
  },
  {
    icon: ShieldCheck,
    title: 'Results Driven',
    subtitle: 'Websites and campaigns structured around clear commercial accountability.',
  },
  {
    icon: Rocket,
    title: 'Built for Growth',
    subtitle: 'Clean codebases and acquisition funnels designed to scale internationally.',
  },
  {
    icon: Globe,
    title: 'Karachi to Worldwide',
    subtitle: 'Dedicated delivery partnering across Pakistan, USA, UK, Canada & UAE.',
  },
];

const PLATFORM_BAR_NAMES = ['React', 'Next.js', 'Node.js', 'Shopify', 'Meta Ads', 'Google Ads'];

function renderHighlightedHeadline(headline: string) {
  const phrase = 'Powerful Digital';
  const idx = headline.indexOf(phrase);
  if (idx !== -1) {
    return (
      <>
        {headline.slice(0, idx)}
        <span className="text-[#5f4eaf]">{phrase}</span>
        {headline.slice(idx + phrase.length)}
      </>
    );
  }
  const words = headline.split(' ');
  if (words.length >= 4) {
    return (
      <>
        {words.slice(0, 2).join(' ')}{' '}
        <span className="text-[#5f4eaf]">{words.slice(2, 4).join(' ')}</span>{' '}
        {words.slice(4).join(' ')}
      </>
    );
  }
  return headline;
}

export default function App() {
  const [content, setContent] = useState<Omit<AgencyDatabase, 'inquiries'>>(DEFAULT_PUBLIC_CONTENT);
  const [isAdminView, setIsAdminView] = useState<boolean>(() => window.location.hash === '#admin');

  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [activePortfolioCategory, setActivePortfolioCategory] = useState<string>('All');
  const [activeAboutTab, setActiveAboutTab] = useState<'mission' | 'vision' | 'approach'>('mission');
  const [activeProcessIdx, setActiveProcessIdx] = useState<number>(0);
  const [activeTestimonialIdx, setActiveTestimonialIdx] = useState<number>(0);
  const [openFaqId, setOpenFaqId] = useState<string | null>('faq-1');
  const [preselectedService, setPreselectedService] = useState<string>('Web Development');
  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});

  const loadPublicContent = useCallback(async () => {
    try {
      const res = await fetch('/api/content');
      if (!res.ok) return;
      const data = (await res.json()) as Omit<AgencyDatabase, 'inquiries'>;
      if (data && data.siteContent) {
        setContent(data);
      }
    } catch {
      // Retain default fallback content if API is momentarily unavailable
    }
  }, []);

  useEffect(() => {
    loadPublicContent();
  }, [loadPublicContent]);

  useEffect(() => {
    const onHashChange = () => {
      if (window.location.hash === '#admin') {
        setIsAdminView(true);
      }
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const openAdmin = () => {
    setIsAdminView(true);
    window.history.replaceState(null, '', '#admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const exitAdmin = () => {
    setIsAdminView(false);
    window.history.replaceState(null, '', '#top');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToContactWithService = (serviceName: string) => {
    setSelectedService(null);
    setSelectedProject(null);
    setPreselectedService(serviceName);
    setTimeout(() => {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    }, 60);
  };

  const categories = ['All', ...Array.from(new Set(content.projects.map((p) => p.category)))];
  const visibleProjects =
    activePortfolioCategory === 'All'
      ? content.projects
      : content.projects.filter((p) => p.category === activePortfolioCategory);

  const testimonials = content.testimonials.length > 0 ? content.testimonials : DEFAULT_PUBLIC_CONTENT.testimonials;
  const safeTestimonialIdx = activeTestimonialIdx % testimonials.length;
  const activeTestimonial = testimonials[safeTestimonialIdx];

  const featuredPlatforms = PLATFORM_BAR_NAMES.map((name) =>
    TECH_STACK.find((item) => item.name === name),
  ).filter((item): item is (typeof TECH_STACK)[number] => Boolean(item));

  const { siteContent } = content;

  return (
    <div id="top" className="min-h-screen bg-white text-[#131129]">
      <Header onNavigateAdmin={openAdmin} isAdminView={isAdminView} onExitAdmin={exitAdmin} />

      {isAdminView ? (
        <AdminDashboard onContentUpdated={loadPublicContent} />
      ) : (
        <main>
          {/* 1. HERO SECTION */}
          <section className="relative overflow-hidden border-b border-[#F0ECFC] bg-hero-atmosphere">
            <div className="mx-auto max-w-[1220px] px-4 pt-8 pb-6 font-[Georgia] italic sm:px-6 sm:pt-12 sm:pb-10 lg:px-8 lg:pt-12 lg:pb-8">
              <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-6">
                {/* Left Copy, CTAs & Inline 4-Pillar Trust Row */}
                <motion.div
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                  className="lg:col-span-6"
                >
                  <h1 className="max-w-[540px] font-[Georgia] text-[38.6px] font-extrabold leading-[1.08] tracking-tight text-[#19192d] [text-wrap:balance]">
                    {renderHighlightedHeadline(siteContent.heroHeadline)}
                  </h1>

                  <p className="mt-5 max-w-[490px] font-['Times_New_Roman',Times,serif] text-[14px] leading-relaxed text-[#110f0f]">
                    {siteContent.heroSupportingText}
                  </p>

                  <div className="mt-7 flex flex-wrap items-center gap-3.5">
                    <a
                      href="#contact"
                      className="inline-flex h-[40px] w-[298.406px] items-center justify-center gap-2 rounded-lg bg-[#694dbf] px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white shadow-[0_10px_24px_-6px_rgba(91,66,243,0.45)] transition-all duration-150 hover:-translate-y-0.5 hover:bg-[#583ea8] hover:shadow-md whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5B42F3]"
                    >
                      <span>{siteContent.heroPrimaryCta}</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </a>

                    <a
                      href="#services"
                      className="inline-flex min-h-[46px] items-center justify-center rounded-lg border border-[#E2DCFA] bg-white px-6 py-3 text-xs font-semibold uppercase tracking-wider text-[#131129] transition-all duration-150 hover:border-[#5B42F3] hover:bg-[#F5F3FF] hover:text-[#5B42F3] whitespace-nowrap"
                    >
                      {siteContent.heroSecondaryCta}
                    </a>
                  </div>

                  {/* 4 Inline Trust Pillars (matching reference layout under hero CTAs) */}
                  <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-4 sm:grid-cols-4">
                    {HERO_PILLARS.map((item) => {
                      const Icon = item.icon;
                      return (
                        <div key={item.title} className="flex items-start gap-2.5">
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#F3EFFF] text-[#5B42F3]">
                            <Icon className="h-3.5 w-3.5" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-display text-xs font-bold text-[#131129] leading-tight">
                              {item.title}
                            </p>
                            <p className="mt-0.5 text-[11px] leading-snug text-[#706C8A]">
                              {item.subtitle}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>

                {/* Right Studio Portrait + Lavender Halo + Floating UI Metric Cards */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="lg:col-span-6"
                >
                  <HeroVisualComposition />
                </motion.div>
              </div>
            </div>
          </section>

          {/* 2. HORIZONTAL PLATFORMS & TECHNOLOGIES BAR */}
          <section className="flex h-[123.667px] items-center border-b border-[#ECE8FA] bg-white py-5 font-[Georgia] italic text-[#1e1a37]">
            <div className="mx-auto flex w-full max-w-[1220px] flex-col items-start justify-between gap-5 px-4 sm:px-6 lg:flex-row lg:items-center lg:px-8">
              <div className="grid w-full grid-cols-2 gap-4 sm:grid-cols-3 lg:flex lg:w-full lg:items-center lg:justify-between">
                {featuredPlatforms.map((tech) => (
                  <div key={tech.name} className="flex items-center gap-2.5">
                    <TechBadgeMark item={tech} />
                    <span className="font-display text-sm font-bold text-[#2F2B4A]">{tech.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 3. OUR SERVICES SECTION (WHAT WE DO) */}
          <section id="services" className="bg-white py-20 font-[Georgia] italic lg:py-24">
            <div className="mx-auto max-w-[1220px] px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
                <div className="max-w-2xl">
                  <h2 className="font-[Georgia] text-[38px] font-bold leading-tight tracking-tight text-[#131129] [text-wrap:balance]">
                    Digital Services That Make an <span className="text-[#365484]">Impact</span>
                  </h2>
                  <p className="mt-2.5 font-['Times_New_Roman',Times,serif] text-[15px] leading-relaxed text-[#56536E]">
                    Six specialized engineering and performance marketing practices built to launch digital products and accelerate customer acquisition.
                  </p>
                </div>

                <a
                  href="#contact"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider text-[#5B42F3] transition-colors hover:text-[#4932D0] whitespace-nowrap shrink-0"
                >
                  <span className="text-[#594d9c]">START A PROJECT</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>

              <div className="mt-12 grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
                {content.services.map((svc, idx) => (
                  <motion.article
                    key={svc.id}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.4, delay: (idx % 3) * 0.07 }}
                    className="group flex flex-col justify-between rounded-2xl border border-[#E7E2FA] bg-white p-6 transition-all duration-200 hover:-translate-y-1 hover:border-[#5B42F3] hover:shadow-[0_20px_44px_-18px_rgba(91,66,243,0.18)]"
                  >
                    <div>
                      <ServiceVisual3D type={svc.visualType} />

                      <div className="mt-5 flex items-baseline gap-2.5">
                        <span className="font-mono-tabular text-xs font-semibold text-[#5B42F3]">
                          {svc.number}.
                        </span>
                        <h3 className="font-display text-xl font-bold text-[#131129]">{svc.title}</h3>
                      </div>

                      <p className="mt-2.5 text-sm leading-relaxed text-[#56536E]">{svc.description}</p>

                      <ul className="mt-4 space-y-1.5 border-t border-[#F0ECFB] pt-4 text-xs text-[#3C3954]">
                        {svc.deliverables.map((item) => (
                          <li key={item} className="flex items-center gap-2">
                            <span className="h-1 w-1 shrink-0 rounded-full bg-[#5B42F3]" aria-hidden="true" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-6 pt-2">
                      <button
                        type="button"
                        onClick={() => setSelectedService(svc)}
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#5B42F3] transition-colors hover:text-[#4932D0] cursor-pointer"
                      >
                        <span>Learn More</span>
                        <ArrowRight className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-1" />
                      </button>
                    </div>
                  </motion.article>
                ))}
              </div>
            </div>
          </section>

          {/* 4. SIGNATURE DARK INDIGO TRUST & VALUE SHOWCASE BAND */}
          <section className="bg-indigo-showcase py-16 font-[Georgia] italic text-white lg:py-20">
            <div className="mx-auto max-w-[1220px] px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
                <div className="lg:col-span-5">
                  <h2 className="font-[Georgia] text-[38px] font-bold leading-tight tracking-tight text-[#fcf0f0] [text-wrap:balance]">
                    {siteContent.trustHeading}
                  </h2>
                  <p className="mt-3.5 font-['Times_New_Roman',Times,serif] text-[14px] leading-relaxed text-[#D6D2EF]">
                    {siteContent.trustDescription}
                  </p>
                  <div className="mt-7">
                    <a
                      href="#portfolio"
                      className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-white/30 bg-white/5 px-6 py-2.5 text-xs font-semibold tracking-wider text-white transition-all duration-150 hover:border-white hover:bg-white hover:text-[#19104A] whitespace-nowrap"
                    >
                      <span>EXPLORE OUR WORK</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>

                <div className="grid grid-cols-1 divide-y divide-white/15 sm:grid-cols-2 sm:divide-y-0 lg:col-span-7 lg:grid-cols-4 lg:divide-x">
                  {INDIGO_BAND_PILLARS.map((pillar) => {
                    const Icon = pillar.icon;
                    return (
                      <div key={pillar.title} className="px-0 py-5 sm:px-5 lg:py-2 first:lg:pl-0 last:lg:pr-0">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-white/5 text-[#C4B7FC]">
                          <Icon className="h-5 w-5" />
                        </div>
                        <h3 className="mt-4 font-display text-base font-bold text-white">
                          {pillar.title}
                        </h3>
                        <p className="mt-1.5 text-xs leading-relaxed text-[#C9C3E8]">
                          {pillar.subtitle}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          {/* 5. CLIENT PERSPECTIVES / TESTIMONIAL CAROUSEL BAR */}
          <section className="border-b border-[#ECE8FA] bg-white py-12 font-[Georgia] italic lg:py-16">
            <div className="mx-auto max-w-[1220px] px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
                <div className="lg:w-48 shrink-0">
                  <button
                    type="button"
                    onClick={openAdmin}
                    className="text-xs font-semibold text-[#706C8A] underline-offset-4 hover:text-[#5B42F3] hover:underline cursor-pointer"
                  >
                    Manage Reviews in Admin
                  </button>
                </div>

                <div className="flex flex-1 items-start gap-5">
                  <span
                    aria-hidden="true"
                    className="hidden select-none font-display text-6xl font-extrabold leading-none text-[#E5DFFF] sm:block"
                  >
                    &ldquo;
                  </span>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-[#706C8A]">
                      {activeTestimonial.isPlaceholder
                        ? 'Editable Placeholder Slot · Replace with Verified Endorsement in Admin'
                        : 'Verified Client Endorsement'}
                    </p>
                    <blockquote className="mt-2 font-[Georgia] text-[16px] font-medium leading-relaxed text-[#131129]">
                      &ldquo;{activeTestimonial.quote}&rdquo;
                    </blockquote>
                    <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                      <span className="font-display font-bold text-[#131129]">
                        {activeTestimonial.authorName}
                      </span>
                      <span className="text-[#8C87A6]">·</span>
                      <span className="text-[#56536E]">
                        {activeTestimonial.authorRole} — {activeTestimonial.companyName}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex h-[35px] items-center gap-3 shrink-0">
                  <span className="font-mono-tabular text-xs font-medium text-[#706C8A]">
                    {String(safeTestimonialIdx + 1).padStart(2, '0')} /{' '}
                    {String(testimonials.length).padStart(2, '0')}
                  </span>
                  <button
                    type="button"
                    aria-label="Previous testimonial"
                    onClick={() =>
                      setActiveTestimonialIdx((prev) => (prev - 1 + testimonials.length) % testimonials.length)
                    }
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E2DCFA] bg-white text-[#56536E] transition-colors hover:border-[#5B42F3] hover:bg-[#F5F3FF] hover:text-[#5B42F3] cursor-pointer"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    aria-label="Next testimonial"
                    onClick={() => setActiveTestimonialIdx((prev) => (prev + 1) % testimonials.length)}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E2DCFA] bg-white text-[#56536E] transition-colors hover:border-[#5B42F3] hover:bg-[#F5F3FF] hover:text-[#5B42F3] cursor-pointer"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* 6. FEATURED PROJECTS / OUR PORTFOLIO */}
          <section id="portfolio" className="border-b border-[#ECE8FA] bg-[#FAF8FF] py-20 lg:py-24">
            <div className="mx-auto max-w-[1220px] px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
                <div className="max-w-2xl">
                  <h2 className="font-[Georgia] text-[32px] font-bold italic leading-tight tracking-tight text-[#2f2d47] [text-wrap:balance]">
                    Interactive Demos &amp; Digital Solution Blueprints
                  </h2>
                  <p className="mt-3 font-['Times_New_Roman',Times,serif] text-[13px] text-[#56536E]">
                    Explore illustrative demo builds showcasing our engineering and campaign design capabilities. All projects are manageable from the Admin Dashboard.
                  </p>
                </div>

                <div className="flex h-[108.333px] w-[329.531px] flex-wrap items-center gap-1.5 rounded-full border border-[#E7E2FA] bg-white p-1 font-[Georgia] text-[15px] italic">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setActivePortfolioCategory(cat)}
                      className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                        activePortfolioCategory === cat
                          ? 'bg-[#5B42F3] text-white'
                          : 'text-[#56536E] hover:text-[#131129]'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2">
                {visibleProjects.map((project) => (
                  <article
                    key={project.id}
                    className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-[#E7E2FA] bg-white transition-all duration-200 hover:-translate-y-1 hover:border-[#5B42F3] hover:shadow-[0_20px_44px_-18px_rgba(91,66,243,0.18)]"
                  >
                    <div>
                      <div className="overflow-hidden border-b border-[#EFEBFB] bg-[#F5F3FF]">
                        {brokenImages[project.id] ? (
                          <div className="flex aspect-[4/3] w-full flex-col items-center justify-center bg-gradient-to-br from-[#FAF9FF] to-[#EDE9FE] p-6 text-center">
                            <Layers className="h-8 w-8 text-[#5B42F3]" />
                            <p className="mt-2 font-display text-sm font-semibold text-[#131129]">
                              {project.title}
                            </p>
                          </div>
                        ) : (
                          <img
                            src={resolveProjectImage(project.imageUrl)}
                            alt={project.title}
                            loading="lazy"
                            referrerPolicy="no-referrer"
                            onError={() => setBrokenImages((prev) => ({ ...prev, [project.id]: true }))}
                            className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                          />
                        )}
                      </div>

                      <div className="p-6">
                        <p className="text-xs font-semibold text-[#5B42F3]">
                          {project.isDemo ? 'Demo Project' : 'Client Project'} · {project.category}
                        </p>
                        <h3 className="mt-2 font-display text-xl font-bold text-[#131129]">
                          {project.title}
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-[#56536E]">
                          {project.shortDescription}
                        </p>
                        <p className="mt-4 text-xs font-medium text-[#706C8A]">
                          {project.technologies.join(' · ')}
                        </p>
                      </div>
                    </div>

                    <div className="px-6 pb-6">
                      <button
                        type="button"
                        onClick={() => setSelectedProject(project)}
                        className="inline-flex min-h-[40px] items-center gap-2 rounded-full border border-[#DDD6FE] bg-[#FAF9FF] px-5 py-2 text-xs font-semibold text-[#5B42F3] transition-colors hover:bg-[#5B42F3] hover:text-white cursor-pointer"
                      >
                        <span>View Project</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          {/* 7. ABOUT OUR AGENCY */}
          <section id="about" className="bg-white py-20 font-[Georgia] italic lg:py-24">
            <div className="mx-auto max-w-[1220px] px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 items-stretch gap-12 lg:grid-cols-12">
                <div className="flex flex-col justify-center lg:col-span-6">
                  <h2 className="font-[Georgia] text-[37px] font-bold leading-tight tracking-tight text-[#1d1b33] [text-wrap:balance]">
                    {siteContent.aboutHeading}
                  </h2>
                  <p className="mt-4 font-['Times_New_Roman',Times,serif] text-[13px] leading-relaxed text-[#56536E]">
                    {siteContent.aboutDescription}
                  </p>

                  <div className="mt-8">
                    <div className="inline-flex rounded-lg border border-[#E7E2FA] bg-[#F5F3FF] p-1 font-['Times_New_Roman',Times,serif] text-[15px]">
                      {(
                        [
                          { id: 'mission', label: 'Our Mission' },
                          { id: 'vision', label: 'Our Vision' },
                          { id: 'approach', label: 'Our Approach' },
                        ] as const
                      ).map((tab) => (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setActiveAboutTab(tab.id)}
                          className={`rounded-md px-3.5 py-2 text-xs font-semibold transition-all duration-150 whitespace-nowrap cursor-pointer ${
                            activeAboutTab === tab.id
                              ? 'bg-white text-[#5B42F3] shadow-sm'
                              : 'text-[#56536E] hover:text-[#131129]'
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>

                    <div className="mt-4 rounded-2xl border border-[#E7E2FA] bg-[#FAF9FF] p-6">
                      <h3 className="font-display text-base font-bold text-[#131129]">
                        {activeAboutTab === 'mission'
                          ? 'Our Mission'
                          : activeAboutTab === 'vision'
                            ? 'Our Vision'
                            : 'Our Approach'}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-[#56536E]">
                        {activeAboutTab === 'mission'
                          ? siteContent.aboutMission
                          : activeAboutTab === 'vision'
                            ? siteContent.aboutVision
                            : siteContent.aboutApproach}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-center rounded-3xl border border-[#E7E2FA] bg-gradient-to-br from-[#FAF9FF] to-[#EDE9FE] p-4 lg:col-span-6">
                  <AboutScene />
                </div>
              </div>
            </div>
          </section>

          {/* 8. WHY CHOOSE BUILD TECHNOLOGY */}
          <section className="border-y border-[#ECE8FA] bg-[#FAF8FF] py-20 font-[Georgia] italic lg:py-24">
            <div className="mx-auto max-w-[1220px] px-4 sm:px-6 lg:px-8">
              <div className="max-w-2xl">
                <h2 className="font-[Georgia] text-[37px] font-bold italic leading-tight tracking-tight text-[#343355] [text-wrap:balance]">
                  Engineered for Reliability, Clarity, and Commercial Impact
                </h2>
              </div>

              <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {ADVANTAGES.map((adv, idx) => {
                  const Icon = adv.icon;
                  return (
                    <motion.div
                      key={adv.title}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-60px' }}
                      transition={{ duration: 0.35, delay: (idx % 3) * 0.06 }}
                      className="group rounded-2xl border border-[#E7E2FA] bg-white p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#5B42F3] hover:shadow-[0_14px_34px_-14px_rgba(91,66,243,0.16)]"
                    >
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#E7E2FA] bg-[#F5F3FF] text-[#5B42F3] transition-colors duration-200 group-hover:bg-[#5B42F3] group-hover:text-white">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="mt-5 font-display text-lg font-bold text-[#131129]">{adv.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-[#56536E]">{adv.description}</p>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* 9. OUR DEVELOPMENT PROCESS */}
          <section id="process" className="bg-white py-20 font-[Georgia] italic lg:py-24">
            <div className="mx-auto max-w-[1220px] px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
                <div className="max-w-2xl">
                  <h2 className="font-[Georgia] text-[37px] font-normal italic leading-tight tracking-tight text-[#322f52] [text-wrap:balance]">
                    A Structured Five-Stage Path From Concept to Scale
                  </h2>
                </div>
                <p className="h-[30px] font-['Times_New_Roman',Times,serif] text-[11px] italic text-[#56536E]">
                  Select any stage below to inspect deliverables.
                </p>
              </div>

              <div className="relative mt-12">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                  {PROCESS_STEPS.map((item, idx) => {
                    const isActive = activeProcessIdx === idx;
                    return (
                      <button
                        key={item.step}
                        type="button"
                        onClick={() => setActiveProcessIdx(idx)}
                        className={`relative flex flex-col items-start rounded-2xl border p-5 text-left transition-all duration-200 cursor-pointer ${
                          isActive
                            ? 'border-[#5B42F3] bg-[#F5F3FF] shadow-sm'
                            : 'border-[#E7E2FA] bg-white hover:border-[#8B75FF]'
                        }`}
                      >
                        <h3 className="font-display text-lg font-bold text-[#131129]">{item.title}</h3>
                        <p className="mt-1.5 text-sm leading-relaxed text-[#56536E]">{item.summary}</p>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-6 rounded-2xl border border-[#E7E2FA] bg-[#FAF9FF] p-6">
                  <p className="text-sm leading-relaxed text-[#3C3954]">
                    {PROCESS_STEPS[activeProcessIdx].detail}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 10. TECHNOLOGIES WE USE */}
          <section className="border-t border-[#ECE8FA] bg-[#FAF8FF] py-20 font-[Georgia] italic lg:py-24">
            <div className="mx-auto max-w-[1220px] px-4 sm:px-6 lg:px-8">
              <div className="max-w-2xl">
                <h2 className="font-[Georgia] text-[37px] font-bold leading-tight tracking-tight text-[#131129]">
                  Proven Engineering &amp; Platform Stack
                </h2>
                <p className="mt-3 font-['Times_New_Roman',Times,serif] text-[14px] text-[#56536E]">
                  Every platform we deliver is built on battle-tested web, database, commerce, and AI technologies we actively support.
                </p>
              </div>

              <div className="mt-10 grid grid-cols-2 gap-4 font-['Times_New_Roman',Times,serif] text-[15px] sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {TECH_STACK.map((tech) => (
                  <div
                    key={tech.name}
                    className="group flex items-center gap-3.5 rounded-xl border border-[#E7E2FA] bg-white p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#5B42F3] hover:shadow-sm"
                  >
                    <TechBadgeMark item={tech} />
                    <div className="min-w-0">
                      <p className="truncate font-display text-sm font-bold text-[#131129]">{tech.name}</p>
                      <p className="truncate text-xs text-[#706C8A]">{tech.category}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 11. DEDICATED DIGITAL MARKETING SECTION */}
          <MarketingDashboardPreview
            siteContent={siteContent}
            onSelectMarketingCta={() => scrollToContactWithService('Digital Marketing')}
          />

          {/* 12. SOFT LAVENDER STRATEGY CALLOUT STRIP (matching reference banner above FAQ/Contact) */}
          <section className="bg-white pt-16 lg:pt-20">
            <div className="mx-auto max-w-[1220px] px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col items-start justify-between gap-6 rounded-2xl border border-[#DFD8FA] bg-[#ECE7FE] px-6 py-8 font-[Georgia] italic sm:flex-row sm:items-center sm:px-10 sm:py-10">
                <div className="flex items-start gap-4 sm:items-center">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-[#5B42F3] shadow-sm">
                    <Send className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="font-display text-xl font-bold text-[#131129] sm:text-2xl">
                      Ready to Accelerate Your Digital Growth?
                    </h2>
                    <p className="mt-1 text-sm text-[#4A4663]">
                      Request a tailored software architecture or digital marketing roadmap for your business.
                    </p>
                  </div>
                </div>

                <a
                  href="#contact"
                  className="inline-flex min-h-[46px] shrink-0 items-center gap-2 rounded-full bg-[#5B42F3] px-7 py-3 text-xs font-semibold tracking-wider text-white shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:bg-[#4932D0] hover:shadow-md whitespace-nowrap"
                >
                  <span>START A PROJECT</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </section>

          {/* 13. FAQ SECTION */}
          <section id="faq" className="bg-white pt-16 pb-4 font-[Georgia] italic lg:pt-20">
            <div className="mx-auto max-w-[920px] px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <h2 className="font-[Georgia] text-[38px] font-bold italic leading-tight tracking-tight text-[#1f1d33]">
                  Answers Before We Begin
                </h2>
              </div>

              <div className="mt-10 space-y-3">
                {content.faqs.map((faq) => {
                  const isOpen = openFaqId === faq.id;
                  return (
                    <div
                      key={faq.id}
                      className="rounded-xl border border-[#E7E2FA] bg-[#FAF9FF] transition-colors duration-150 hover:border-[#C4B7FC]"
                    >
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                        className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left cursor-pointer"
                      >
                        <span className="font-display text-base font-semibold text-[#131129]">
                          {faq.question}
                        </span>
                        <ChevronDown
                          className={`h-4 w-4 shrink-0 text-[#5B42F3] transition-transform duration-200 ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      {isOpen && (
                        <div className="border-t border-[#ECE8FA] bg-white px-6 py-4 text-sm leading-relaxed text-[#56536E]">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* 14. CONTACT SECTION */}
          <ContactSection siteContent={siteContent} preselectedService={preselectedService} />
        </main>
      )}

      <Footer siteContent={siteContent} services={content.services} onOpenAdmin={openAdmin} />

      <ServiceDetailModal
        service={selectedService}
        onClose={() => setSelectedService(null)}
        onRequestService={scrollToContactWithService}
      />

      <ProjectDetailModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onStartSimilar={() => scrollToContactWithService('Web Development')}
      />
    </div>
  );
}
