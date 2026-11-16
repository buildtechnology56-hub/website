import { useState } from 'react';
import { ArrowRight, Megaphone, Menu, X } from 'lucide-react';

interface HeaderProps {
  onNavigateAdmin: () => void;
  isAdminView: boolean;
  onExitAdmin: () => void;
}

const NAV_LINKS = [
  { label: 'Home', href: '#top', active: true },
  { label: 'Services', href: '#services', active: false },
  { label: 'Work', href: '#portfolio', active: false },
  { label: 'About Us', href: '#about', active: false },
  { label: 'Process', href: '#process', active: false },
  { label: 'FAQ', href: '#faq', active: false },
];

export function Header({ onNavigateAdmin, isAdminView, onExitAdmin }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLinkClick = (href: string) => {
    setMobileOpen(false);
    if (isAdminView) {
      onExitAdmin();
      setTimeout(() => {
        document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
      }, 60);
    }
  };

  return (
    <>
      {/* Top Indigo Offer Bar */}
      {!isAdminView && (
        <div className="bg-[#342191] text-white">
          <div className="mx-auto flex h-[28px] max-w-[1220px] items-center justify-between gap-4 bg-[#6565c0] px-4 font-[Georgia] text-xs italic sm:px-6 lg:px-8">
            <p className="flex items-center gap-2 truncate font-medium text-[#ECE9FD]">
              <Megaphone className="h-3.5 w-3.5 shrink-0 text-[#C4B7FC]" aria-hidden="true" />
              <span className="truncate">
                Free Digital Strategy &amp; Technical Audit for Your Business — Karachi &amp; Worldwide
              </span>
            </p>
            <a
              href="#contact"
              className="inline-flex items-center gap-1 font-semibold tracking-wide text-white transition-colors hover:text-[#C4B7FC] whitespace-nowrap shrink-0"
            >
              <span>GET YOUR FREE AUDIT</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      )}

      <header className="sticky top-0 z-40 border-b border-[#F0ECFC] bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1220px] items-center justify-between gap-8 px-4 font-['Times_New_Roman',Times,serif] italic sm:px-6 lg:px-8">
          {/* Zone 1: Official Build Technology Logo (Unchanged) */}
          <a
            href="#top"
            onClick={(e) => {
              if (isAdminView) {
                e.preventDefault();
                onExitAdmin();
              }
            }}
            aria-label="Build Technology Home"
            className="flex items-center whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#5B42F3]"
          >
            <img
              src="/assets/aistudio/Build_Technology_Blue_Corporate_Logo_7d6f52b3.png"
              alt="Build Technology"
              referrerPolicy="no-referrer"
              className="h-12 w-auto object-contain sm:h-13"
            />
          </a>

          {/* Zone 2: Clean Single-Line Navigation Links */}
          {!isAdminView ? (
            <nav aria-label="Primary navigation" className="hidden items-center gap-7 md:flex">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className={`relative py-1 text-sm font-medium transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#5B42F3] ${
                    link.active
                      ? 'text-[#5B42F3] after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:bg-[#5B42F3]'
                      : 'text-[#3C3954] hover:text-[#5B42F3] after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:origin-left after:scale-x-0 after:bg-[#5B42F3] after:transition-transform after:duration-200 hover:after:scale-x-100'
                  }`}
                >
                  {link.label}
                </a>
              ))}
            </nav>
          ) : (
            <div className="hidden items-center text-sm font-medium text-[#56536E] md:flex">
              Admin Workspace
            </div>
          )}

          {/* Zone 3: Primary Royal Indigo CTA */}
          <div className="flex items-center gap-3 shrink-0">
            {isAdminView ? (
              <button
                type="button"
                onClick={onExitAdmin}
                className="inline-flex min-h-[40px] items-center justify-center rounded-full border border-[#D4CBFA] bg-[#F5F3FF] px-5 py-2 text-sm font-semibold text-[#5B42F3] transition-colors duration-150 hover:bg-[#EDE9FE] whitespace-nowrap shrink-0 cursor-pointer"
              >
                Return to Website
              </button>
            ) : (
              <a
                href="#contact"
                className="hidden sm:inline-flex min-h-[40px] items-center justify-center rounded-full bg-[#604fdb] px-7 py-2 text-xs font-semibold tracking-wider text-white shadow-[0_6px_18px_-4px_rgba(91,66,243,0.45)] transition-all duration-150 hover:-translate-y-0.5 hover:bg-[#4932D0] hover:shadow-md whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5B42F3]"
              >
                LET&apos;S TALK
              </a>
            )}

            {!isAdminView && (
              <button
                type="button"
                onClick={() => setMobileOpen((prev) => !prev)}
                aria-expanded={mobileOpen}
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border border-[#E2DCFA] text-[#131129] transition-colors hover:bg-[#F4F0FF] md:hidden cursor-pointer"
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileOpen && !isAdminView && (
          <div className="border-t border-[#ECE8FA] bg-white px-4 py-4 md:hidden">
            <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => handleLinkClick(link.href)}
                  className="flex min-h-[44px] items-center rounded-lg px-3 text-base font-medium text-[#131129] transition-colors hover:bg-[#F4F0FF] hover:text-[#5B42F3]"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#contact"
                onClick={() => handleLinkClick('#contact')}
                className="mt-2 flex min-h-[44px] items-center justify-center rounded-full bg-[#5B42F3] px-4 py-2.5 text-sm font-semibold text-white"
              >
                LET&apos;S TALK
              </a>
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  onNavigateAdmin();
                }}
                className="mt-1 flex min-h-[44px] items-center justify-center rounded-lg border border-[#E2DCFA] px-4 py-2 text-sm font-medium text-[#56536E]"
              >
                Admin Dashboard
              </button>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
