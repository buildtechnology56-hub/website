import { Mail, Phone, ArrowUpRight, Lock, Instagram, MapPin } from 'lucide-react';
import { ServiceItem, SiteContent } from '../types/agency';

interface FooterProps {
  siteContent: SiteContent;
  services: ServiceItem[];
  onOpenAdmin: () => void;
}

export function Footer({ siteContent, services, onOpenAdmin }: FooterProps) {
  const socialEntries = [
    { label: 'Instagram', url: siteContent.socialLinks.instagram, isInstagram: true },
    { label: 'LinkedIn', url: siteContent.socialLinks.linkedin, isInstagram: false },
    { label: 'X / Twitter', url: siteContent.socialLinks.twitter, isInstagram: false },
    { label: 'Facebook', url: siteContent.socialLinks.facebook, isInstagram: false },
    { label: 'GitHub', url: siteContent.socialLinks.github, isInstagram: false },
  ].filter((item) => item.url && item.url.trim().length > 0);

  const phoneNumbers = (siteContent.phoneNumber || '')
    .split(/[,|\n·]+/)
    .map((n) => n.trim())
    .filter(Boolean);

  return (
    <footer className="bg-[#120B38] text-white">
      <div className="mx-auto max-w-[1220px] px-4 py-16 font-[Georgia] italic sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          {/* Brand Column (Official Logo preserved on crisp white container) */}
          <div className="md:col-span-4">
            <a
              href="#top"
              aria-label="Build Technology Home"
              className="inline-flex items-center rounded-xl bg-white px-3.5 py-2 shadow-sm"
            >
              <img
                src={`${import.meta.env.BASE_URL}assets/aistudio/Build_Technology_Blue_Corporate_Logo_7d6f52b3.png`}
                alt="Build Technology"
                referrerPolicy="no-referrer"
                className="h-11 w-auto object-contain"
              />
            </a>
            <p className="mt-5 font-display text-sm font-semibold text-[#C4B7FC]">
              {siteContent.footerTagline}
            </p>
            <p className="mt-2.5 max-w-sm font-['Times_New_Roman',Times,serif] text-[14px] leading-relaxed text-[#B4AED8]">
              {siteContent.footerDescription}
            </p>

            {socialEntries.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2.5">
                {socialEntries.map((item) => (
                  <a
                    key={item.label}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-white transition-colors hover:border-[#8B75FF] hover:bg-[#5B42F3]"
                  >
                    {item.isInstagram && <Instagram className="h-3.5 w-3.5 shrink-0" />}
                    <span>{item.label}</span>
                    <ArrowUpRight className="h-3 w-3" />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Services Links */}
          <div className="text-center font-['Times_New_Roman',Times,serif] text-[16px] md:col-span-3">
            <h3 className="font-display text-xs font-semibold tracking-wider text-[#9A92C8]">
              SERVICES
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-[#D6D2EF]">
              {services.map((svc) => (
                <li key={svc.id}>
                  <a href="#services" className="transition-colors hover:text-white">
                    {svc.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div className="text-center md:col-span-2">
            <h3 className="font-display text-xs font-semibold tracking-wider text-[#9A92C8]">
              COMPANY
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-[#D6D2EF]">
              <li>
                <a href="#about" className="transition-colors hover:text-white">
                  About Us
                </a>
              </li>
              <li>
                <a href="#portfolio" className="transition-colors hover:text-white">
                  Our Work
                </a>
              </li>
              <li>
                <a href="#process" className="transition-colors hover:text-white">
                  Process
                </a>
              </li>
              <li>
                <a href="#faq" className="transition-colors hover:text-white">
                  FAQs
                </a>
              </li>
              <li>
                <a href="#contact" className="transition-colors hover:text-white">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Let's Connect */}
          <div className="text-center font-['Times_New_Roman',Times,serif] md:col-span-3">
            <h3 className="font-display text-xs font-semibold tracking-wider text-[#9A92C8]">
              LET&apos;S CONNECT
            </h3>
            <div className="mt-4 space-y-3 text-sm text-[#D6D2EF]">
              <a
                href={`mailto:${siteContent.contactEmail}`}
                className="flex items-center gap-2.5 transition-colors hover:text-white"
              >
                <Mail className="h-4 w-4 shrink-0 text-[#9B86FF]" />
                <span className="truncate">{siteContent.contactEmail}</span>
              </a>

              {phoneNumbers.map((entry) => {
                const match = entry.match(/^(\+?\d[\d\s\-()]{5,}\d)(?:\s+(.*))?$/);
                const numberPart = match ? match[1].trim() : entry;
                const namePart = match && match[2] ? match[2].trim() : '';
                return (
                  <a
                    key={entry}
                    href={`tel:${numberPart.replace(/[^\d+]/g, '')}`}
                    className="flex items-start gap-2.5 transition-colors hover:text-white"
                  >
                    <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[#9B86FF]" />
                    <span className="leading-snug">
                      <span className="font-mono-tabular font-medium text-white">{numberPart}</span>
                      {namePart && <span className="block text-xs text-[#A9A2D4]">{namePart}</span>}
                    </span>
                  </a>
                );
              })}

              <div className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#9B86FF]" />
                <span className="leading-snug text-[#D6D2EF]">
                  Karachi, Pakistan
                  <span className="block text-xs text-[#A9A2D4]">
                    Serving USA · UK · Canada · UAE · Worldwide
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14 flex h-[39.6667px] flex-col items-start justify-between gap-4 border-t border-white/10 pt-6 font-['Times_New_Roman',Times,serif] sm:flex-row sm:items-center">
          <p className="text-xs text-[#9A92C8]">
            © {new Date().getFullYear()} Build Technology. All rights reserved.
          </p>
          <button
            type="button"
            onClick={onOpenAdmin}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#C4B7FC] transition-colors hover:text-white cursor-pointer"
          >
            <Lock className="h-3.5 w-3.5" />
            Admin Dashboard
          </button>
        </div>
      </div>
    </footer>
  );
}
