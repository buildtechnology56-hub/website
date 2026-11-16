import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, BarChart3, Globe2, Layers, MousePointerClick, Search, Share2 } from 'lucide-react';
import { SiteContent } from '../types/agency';

interface MarketingProps {
  siteContent: SiteContent;
  onSelectMarketingCta: () => void;
}

type ChannelKey = 'meta' | 'google' | 'seo';

const CHANNEL_VIEWS: Record<
  ChannelKey,
  {
    label: string;
    subtitle: string;
    points: number[];
    stages: Array<{ name: string; share: number }>;
    cards: Array<{ title: string; detail: string }>;
  }
> = {
  meta: {
    label: 'Meta Advertising',
    subtitle: 'Illustrative Facebook & Instagram Funnel View',
    points: [22, 34, 31, 48, 57, 68, 84],
    stages: [
      { name: 'Audience Discovery', share: 92 },
      { name: 'Creative Engagement', share: 68 },
      { name: 'Qualified Lead Capture', share: 44 },
    ],
    cards: [
      { title: 'Lead Generation Funnel', detail: 'Dynamic creative testing & instant lead forms' },
      { title: 'Retargeting Sequences', detail: 'High-intent site & catalog audience recovery' },
    ],
  },
  google: {
    label: 'Google Advertising',
    subtitle: 'Illustrative Search & Performance Max View',
    points: [28, 36, 44, 52, 63, 76, 89],
    stages: [
      { name: 'High-Intent Search Capture', share: 88 },
      { name: 'Landing Page Relevance', share: 74 },
      { name: 'Conversion Attribution', share: 52 },
    ],
    cards: [
      { title: 'Search Intent Campaigns', detail: 'Exact & phrase match high-intent keyword groups' },
      { title: 'Performance Max', detail: 'Cross-channel placement across Search & YouTube' },
    ],
  },
  seo: {
    label: 'SEO & Organic Growth',
    subtitle: 'Illustrative Search Visibility Trajectory',
    points: [18, 24, 33, 45, 59, 72, 86],
    stages: [
      { name: 'Technical Crawl Health', share: 95 },
      { name: 'Topic Authority Indexing', share: 72 },
      { name: 'Organic Inbound Pipeline', share: 56 },
    ],
    cards: [
      { title: 'Technical & Local SEO', detail: 'Structured schema, Core Web Vitals & regional rankings' },
      { title: 'Content Architecture', detail: 'Search-backed landing pages built for conversion' },
    ],
  },
};

const CAPABILITIES = [
  { icon: Share2, title: 'Meta Advertising', desc: 'Targeted Facebook & Instagram acquisition funnels.' },
  { icon: Search, title: 'Google Advertising', desc: 'High-intent Search, YouTube & Performance Max.' },
  { icon: Globe2, title: 'Search Engine Optimization', desc: 'Technical SEO, local visibility & organic authority.' },
  { icon: Layers, title: 'Social Media Growth', desc: 'Consistent editorial strategy & brand presence.' },
  { icon: BarChart3, title: 'Lead Generation', desc: 'Qualified pipeline capture tailored to your market.' },
  { icon: MousePointerClick, title: 'Conversion Optimization', desc: 'Landing experience tuning to turn traffic into revenue.' },
];

export function MarketingDashboardPreview({ siteContent, onSelectMarketingCta }: MarketingProps) {
  const [channel, setChannel] = useState<ChannelKey>('meta');
  const active = CHANNEL_VIEWS[channel];

  const stepX = 420 / (active.points.length - 1);
  const coords = active.points.map((val, idx) => ({
    x: idx * stepX,
    y: 140 - (val / 100) * 115,
  }));
  const linePath = coords.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
  const areaPath = `${linePath} L 420 146 L 0 146 Z`;

  return (
    <section className="relative overflow-hidden border-y border-[#E7E2FA] bg-section-lavender py-20 font-['Times_New_Roman',Times,serif] italic lg:py-28">
      <div className="mx-auto max-w-[1220px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.45 }}
            className="lg:col-span-5"
          >
            <h2 className="font-[Georgia] text-[38px] font-normal leading-tight tracking-tight text-[#131129] [text-wrap:balance]">
              {siteContent.marketingHeadline}
            </h2>
            <p className="mt-4 text-[13px] leading-relaxed text-[#56536E]">
              {siteContent.marketingDescription}
            </p>

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {CAPABILITIES.map((cap) => {
                const Icon = cap.icon;
                return (
                  <div
                    key={cap.title}
                    className="rounded-xl border border-[#E7E2FA] bg-white p-4 transition-colors duration-200 hover:border-[#5B42F3]"
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="h-4 w-4 shrink-0 text-[#5B42F3]" />
                      <h3 className="font-display text-sm font-semibold text-[#131129]">{cap.title}</h3>
                    </div>
                    <p className="mt-1.5 text-xs leading-relaxed text-[#56536E]">{cap.desc}</p>
                  </div>
                );
              })}
            </div>

            <div className="mt-8">
              <button
                type="button"
                onClick={onSelectMarketingCta}
                className="inline-flex min-h-[46px] items-center gap-2 rounded-full bg-[#5B42F3] px-7 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:bg-[#4932D0] hover:shadow-md cursor-pointer whitespace-nowrap"
              >
                {siteContent.marketingCta}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-7"
          >
            <div className="rounded-2xl border border-[#DFD8FA] bg-white p-5 shadow-[0_24px_60px_-18px_rgba(34,22,98,0.12)] sm:p-7">
              <div className="flex flex-col justify-between gap-4 border-b border-[#EFEBFB] pb-4 sm:flex-row sm:items-center">
                <div>
                  <p className="text-xs font-medium text-[#706C8A]">
                    Illustrative Campaign Interface Preview · Sample Visualization
                  </p>
                  <h3 className="mt-0.5 font-display text-lg font-bold text-[#131129]">
                    {active.subtitle}
                  </h3>
                </div>

                <div className="inline-flex rounded-lg bg-[#F4F0FF] p-1">
                  {(['meta', 'google', 'seo'] as ChannelKey[]).map((key) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setChannel(key)}
                      className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-all duration-150 whitespace-nowrap cursor-pointer ${
                        channel === key
                          ? 'bg-[#5B42F3] text-white shadow-sm'
                          : 'text-[#56536E] hover:text-[#131129]'
                      }`}
                    >
                      {key === 'meta' ? 'Meta Ads' : key === 'google' ? 'Google Ads' : 'SEO'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-5 rounded-xl border border-[#EFEBFB] bg-[#FAF9FF] p-4">
                <div className="mb-3 flex items-center justify-between text-xs text-[#56536E]">
                  <span className="font-medium text-[#131129]">Channel Momentum Curve (Illustrative Index)</span>
                  <span className="font-mono-tabular text-[#5B42F3]">Phase 01 → Phase 07</span>
                </div>
                <svg viewBox="0 0 420 150" className="h-40 w-full overflow-visible" aria-hidden="true">
                  <defs>
                    <linearGradient id="marketingAreaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#7C63FF" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="#7C63FF" stopOpacity="0.02" />
                    </linearGradient>
                  </defs>
                  {[30, 65, 100, 135].map((y) => (
                    <line key={y} x1="0" y1={y} x2="420" y2={y} stroke="#ECE8FA" strokeWidth="1" />
                  ))}
                  <motion.path
                    key={`area-${channel}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.35 }}
                    d={areaPath}
                    fill="url(#marketingAreaGrad)"
                  />
                  <motion.path
                    key={`line-${channel}`}
                    initial={{ pathLength: 0.2, opacity: 0.6 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 0.55, ease: 'easeOut' }}
                    d={linePath}
                    fill="none"
                    stroke="#5B42F3"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {coords.map((pt, idx) => (
                    <circle
                      key={idx}
                      cx={pt.x}
                      cy={pt.y}
                      r="4.5"
                      fill="#FFFFFF"
                      stroke="#5B42F3"
                      strokeWidth="2.5"
                    />
                  ))}
                </svg>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-12">
                <div className="space-y-3 sm:col-span-6">
                  <p className="text-xs font-semibold text-[#131129]">Illustrative Funnel Architecture</p>
                  {active.stages.map((stage) => (
                    <div key={stage.name} className="space-y-1">
                      <div className="flex justify-between text-xs text-[#56536E]">
                        <span>{stage.name}</span>
                        <span className="font-mono-tabular text-[#5B42F3]">Active Layer</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-[#EDE9FE]">
                        <motion.div
                          key={`${channel}-${stage.name}`}
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: stage.share / 100 }}
                          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                          className="h-full origin-left rounded-full bg-gradient-to-r from-[#5B42F3] to-[#8B75FF]"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 sm:col-span-6">
                  <p className="text-xs font-semibold text-[#131129]">Campaign Modules</p>
                  {active.cards.map((card) => (
                    <div
                      key={card.title}
                      className="rounded-xl border border-[#ECE8FA] bg-[#FAF9FF] p-3.5"
                    >
                      <p className="font-display text-xs font-semibold text-[#5B42F3]">{card.title}</p>
                      <p className="mt-1 text-xs leading-relaxed text-[#56536E]">{card.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
