import { motion } from 'motion/react';
import { MessageSquare, TrendingUp } from 'lucide-react';
import heroStrategistImg from '../assets/images/hero_strategist_laptop_1794807535109.jpg';

const BAR_HEIGHTS = [24, 38, 30, 48, 36, 56, 46, 66, 76];

export function HeroVisualComposition() {
  return (
    <div className="relative mx-auto flex h-[430px] w-full max-w-[580px] items-end justify-center sm:h-[490px] lg:h-[520px]">
      {/* Soft Lavender Circular Halo Backdrop (matches reference geometry) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[8%] top-[10%] h-[300px] w-[300px] rounded-full bg-gradient-to-br from-[#EFEAFF] via-[#E6DDFE] to-[#DDD2FC] sm:h-[370px] sm:w-[370px]"
      />

      {/* Subtle Dashed Arc & Floating Chat Badge (lower-left accent from reference) */}
      <svg
        aria-hidden="true"
        viewBox="0 0 220 220"
        className="pointer-events-none absolute left-[10%] top-[24%] hidden h-44 w-44 text-[#D9D0FA] sm:block"
        fill="none"
      >
        <path
          d="M 48 16 C 12 68, 18 140, 74 186"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeDasharray="5 6"
          strokeLinecap="round"
        />
      </svg>

      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45, delay: 0.35 }}
        className="absolute bottom-[36%] left-[21%] z-10 hidden h-10 w-10 items-center justify-center rounded-xl border border-[#EAE4FC] bg-white text-[#7C63FF] shadow-[0_12px_28px_-10px_rgba(91,66,243,0.22)] sm:flex"
      >
        <MessageSquare className="h-4 w-4" />
      </motion.div>

      {/* Center Strategist + Laptop Studio Portrait (pure white backdrop blends seamlessly) */}
      <div className="relative z-10 flex h-full w-full items-end justify-center overflow-hidden">
        <img
          src={heroStrategistImg}
          alt="Build Technology digital strategist and engineer working on a laptop"
          referrerPolicy="no-referrer"
          className="h-[95%] w-auto max-w-none object-contain object-bottom mix-blend-multiply select-none"
        />
      </div>

      {/* Floating Card 1: Top-Left Website Traffic Line Chart */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="animate-float-slow absolute left-0 top-[20%] z-20 w-[168px] rounded-2xl border border-[#ECE7FC] bg-white p-3.5 shadow-[0_20px_44px_-14px_rgba(30,20,84,0.14)] sm:left-[2%] sm:w-[196px] sm:p-4"
      >
        <div className="flex items-center justify-between gap-2">
          <p className="text-[11px] font-medium text-[#706C8A]">Website Traffic</p>
          <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-[#10B981]">
            <TrendingUp className="h-3 w-3" />
            Live UI
          </span>
        </div>
        <p className="mt-1 font-display text-sm font-bold text-[#131129] sm:text-base">
          Organic Reach
        </p>

        <svg viewBox="0 0 160 56" className="mt-2.5 h-12 w-full overflow-visible" aria-hidden="true">
          <defs>
            <linearGradient id="heroTrafficGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7C63FF" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#7C63FF" stopOpacity="0.02" />
            </linearGradient>
          </defs>
          <path
            d="M 4 46 C 22 42, 34 32, 48 34 C 64 36, 74 18, 92 22 C 110 26, 126 10, 156 6 L 156 54 L 4 54 Z"
            fill="url(#heroTrafficGrad)"
          />
          <path
            d="M 4 46 C 22 42, 34 32, 48 34 C 64 36, 74 18, 92 22 C 110 26, 126 10, 156 6"
            fill="none"
            stroke="#5B42F3"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          <circle cx="156" cy="6" r="3.5" fill="#FFFFFF" stroke="#5B42F3" strokeWidth="2.2" />
        </svg>
      </motion.div>

      {/* Floating Card 2: Top-Right Conversions Bar Chart */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="absolute right-0 top-[5%] z-20 w-[162px] rounded-2xl border border-[#ECE7FC] bg-white p-3.5 shadow-[0_20px_44px_-14px_rgba(30,20,84,0.14)] sm:right-[1%] sm:w-[186px] sm:p-4"
      >
        <div className="flex items-center justify-between gap-2">
          <p className="text-[11px] font-medium text-[#706C8A]">Conversions</p>
          <span className="text-[10px] font-semibold text-[#5B42F3]">Funnel</span>
        </div>
        <p className="mt-1 font-display text-sm font-bold text-[#131129] sm:text-base">
          Lead Velocity
        </p>

        <div className="mt-3 flex h-14 items-end justify-between gap-1.5" aria-hidden="true">
          {BAR_HEIGHTS.map((height, idx) => (
            <span
              key={idx}
              style={{ height: `${height}%` }}
              className={`w-full rounded-t-[3px] ${
                idx >= BAR_HEIGHTS.length - 2
                  ? 'bg-[#5B42F3]'
                  : idx >= BAR_HEIGHTS.length - 4
                    ? 'bg-[#8B75FF]'
                    : 'bg-[#DDD5FD]'
              }`}
            />
          ))}
        </div>
      </motion.div>

      {/* Floating Card 3: Bottom-Right Channel Attribution Donut */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="absolute bottom-[8%] right-0 z-20 w-[166px] rounded-2xl border border-[#ECE7FC] bg-white p-3.5 shadow-[0_20px_44px_-14px_rgba(30,20,84,0.14)] sm:right-[1%] sm:w-[192px] sm:p-4"
      >
        <div className="flex items-center justify-between gap-2">
          <p className="text-[11px] font-medium text-[#706C8A]">Campaign Growth</p>
          <span className="text-[10px] font-semibold text-[#10B981]">Active</span>
        </div>
        <p className="mt-1 font-display text-sm font-bold text-[#131129] sm:text-base">
          Channel Mix
        </p>

        <div className="mt-2.5 flex items-center justify-center" aria-hidden="true">
          <svg viewBox="0 0 80 80" className="h-16 w-16 -rotate-90">
            <circle cx="40" cy="40" r="28" fill="none" stroke="#EDE9FE" strokeWidth="12" />
            <circle
              cx="40"
              cy="40"
              r="28"
              fill="none"
              stroke="#5B42F3"
              strokeWidth="12"
              strokeDasharray="116 176"
              strokeLinecap="round"
            />
            <circle
              cx="40"
              cy="40"
              r="28"
              fill="none"
              stroke="#9C87FF"
              strokeWidth="12"
              strokeDasharray="44 176"
              strokeDashoffset="-122"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </motion.div>
    </div>
  );
}
