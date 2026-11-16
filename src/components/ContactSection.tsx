import { FormEvent, useEffect, useState } from 'react';
import {
  ArrowUpRight,
  CheckCircle2,
  Globe,
  Instagram,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Send,
} from 'lucide-react';
import { SiteContent } from '../types/agency';

interface ContactSectionProps {
  siteContent: SiteContent;
  preselectedService: string;
}

const SERVICE_OPTIONS = [
  'Web Development',
  'Software Development',
  'Digital Marketing',
  'Meta Ads',
  'Google Ads',
  'SEO',
  'Branding & Design',
  'Other',
];

const BUDGET_OPTIONS_BY_CURRENCY = {
  USD: [
    'Under $1,000',
    '$1,000 – $5,000',
    '$5,000 – $15,000',
    '$15,000 – $35,000',
    '$35,000+',
    'Monthly Retainer / Ongoing Growth',
    'To be discussed',
  ],
  PKR: [
    'Under PKR 150,000',
    'PKR 150,000 – 500,000',
    'PKR 500,000 – 1,500,000',
    'PKR 1,500,000 – 3,500,000',
    'PKR 3,500,000+',
    'Monthly Retainer / Ongoing Growth',
    'To be discussed',
  ],
} as const;

function parseContactPhoneEntry(entry: string): { dialHref: string; numberPart: string; namePart: string } {
  const trimmed = entry.trim();
  const match = trimmed.match(/^(\+?\d[\d\s\-()]{5,}\d)(?:\s+(.*))?$/);
  if (match) {
    const numberPart = match[1].trim();
    const namePart = (match[2] || '').trim();
    return {
      dialHref: `tel:${numberPart.replace(/[^\d+]/g, '')}`,
      numberPart,
      namePart,
    };
  }
  return {
    dialHref: `tel:${trimmed.replace(/[^\d+]/g, '')}`,
    numberPart: trimmed,
    namePart: '',
  };
}

export function ContactSection({ siteContent, preselectedService }: ContactSectionProps) {
  const [fullName, setFullName] = useState('');
  const [businessEmail, setBusinessEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [country, setCountry] = useState('');
  const [serviceRequired, setServiceRequired] = useState(preselectedService || 'Web Development');
  const [budgetCurrency, setBudgetCurrency] = useState<'USD' | 'PKR'>('USD');
  const [projectBudget, setProjectBudget] = useState<string>(BUDGET_OPTIONS_BY_CURRENCY.USD[2]);
  const [projectDetails, setProjectDetails] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (preselectedService) {
      setServiceRequired(preselectedService);
    }
  }, [preselectedService]);

  const handleCurrencyChange = (currency: 'USD' | 'PKR') => {
    setBudgetCurrency(currency);
    setProjectBudget(BUDGET_OPTIONS_BY_CURRENCY[currency][1]);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const trimmedName = fullName.trim();
    const trimmedEmail = businessEmail.trim();
    const trimmedCountry = country.trim();
    const trimmedDetails = projectDetails.trim();

    if (trimmedName.length < 2) {
      setErrorMsg('Please provide your full name.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setErrorMsg('Please enter a valid business email address.');
      return;
    }
    if (!trimmedCountry) {
      setErrorMsg('Please enter your country or market region.');
      return;
    }
    if (trimmedDetails.length < 10) {
      setErrorMsg('Please share at least a brief summary of your project goals (10+ characters).');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: trimmedName,
          businessEmail: trimmedEmail,
          companyName: companyName.trim(),
          country: trimmedCountry,
          serviceRequired,
          projectBudget,
          projectDetails: trimmedDetails,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || 'Could not submit inquiry. Please verify your inputs.');
        return;
      }

      setSuccessMsg(
        data.message || 'Thank you. Your inquiry has been received and our team will reach out shortly.',
      );
      setFullName('');
      setBusinessEmail('');
      setCompanyName('');
      setCountry('');
      setProjectDetails('');
    } catch {
      setErrorMsg('Network error while sending your inquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const phoneEntries = (siteContent.phoneNumber || '')
    .split(/[,|\n·]+/)
    .map((n) => n.trim())
    .filter(Boolean)
    .map(parseContactPhoneEntry);

  return (
    <section id="contact" className="bg-white py-20 font-['Times_New_Roman',Times,serif] italic lg:py-28">
      <div className="mx-auto max-w-[1220px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Left Column: Direct Info */}
          <div className="lg:col-span-5">
            <h2 className="font-[Georgia] text-[44px] font-bold italic leading-tight tracking-tight text-[#131129] [text-wrap:balance]">
              {siteContent.contactHeadline}
            </h2>
            <p className="mt-4 text-[13px] leading-relaxed text-[#56536E]">
              {siteContent.contactDescription}
            </p>

            <div className="mt-8 space-y-5 border-t border-[#ECE8FA] pt-8 font-[Georgia]">
              <div className="flex items-start gap-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#E7E2FA] bg-[#F5F3FF] text-[#5B42F3]">
                  <Mail className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-medium text-[#706C8A]">Direct Email</p>
                  <a
                    href={`mailto:${siteContent.contactEmail}`}
                    className="mt-0.5 block font-display text-sm font-semibold text-[#131129] hover:text-[#5B42F3]"
                  >
                    {siteContent.contactEmail}
                  </a>
                </div>
              </div>

              {phoneEntries.length > 0 && (
                <div className="flex items-start gap-3.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#E7E2FA] bg-[#F5F3FF] text-[#5B42F3]">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-[#706C8A]">Direct Contact Numbers</p>
                    <div className="mt-1 space-y-1.5">
                      {phoneEntries.map((entry) => (
                        <a
                          key={entry.numberPart + entry.namePart}
                          href={entry.dialHref}
                          className="flex flex-wrap items-baseline gap-x-2 text-sm text-[#131129] transition-colors hover:text-[#5B42F3]"
                        >
                          <span className="font-mono-tabular font-semibold">{entry.numberPart}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {siteContent.socialLinks?.instagram && siteContent.socialLinks.instagram.trim().length > 0 && (
                <div className="flex items-start gap-3.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#E7E2FA] bg-[#F5F3FF] text-[#5B42F3]">
                    <Instagram className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-[#706C8A]">Instagram</p>
                    <a
                      href={siteContent.socialLinks.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-0.5 inline-flex items-center gap-1 font-display text-sm font-semibold text-[#5B42F3] hover:underline"
                    >
                      <span>
                        @
                        {siteContent.socialLinks.instagram
                          .replace(/^https?:\/\/(www\.)?instagram\.com\//i, '')
                          .split(/[/?#]/)[0] || 'buildtechnology35'}
                      </span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#E7E2FA] bg-[#F5F3FF] text-[#5B42F3]">
                  <MapPin className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-medium text-[#706C8A]">Office Location</p>
                  <p className="mt-0.5 font-display text-sm font-semibold text-[#131129]">
                    Karachi, Pakistan
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#E7E2FA] bg-[#F5F3FF] text-[#5B42F3]">
                  <Globe className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-medium text-[#706C8A]">International Collaboration</p>
                  <p className="mt-0.5 text-sm text-[#56536E]">
                    Supporting teams across Pakistan, USA, UK, Canada, UAE, and worldwide.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Validated Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-[#E2DCFA] bg-[#FAF9FF] p-6 font-[Georgia] font-normal shadow-sm sm:p-8">
              {successMsg ? (
                <div className="py-10 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#EDE9FE] text-[#5B42F3]">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 font-display text-xl font-bold text-[#131129]">
                    Project Inquiry Submitted
                  </h3>
                  <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-[#56536E]">
                    {successMsg}
                  </p>
                  <button
                    type="button"
                    onClick={() => setSuccessMsg('')}
                    className="mt-6 inline-flex min-h-[40px] items-center justify-center rounded-full border border-[#D4CBFA] bg-white px-5 py-2 text-sm font-semibold text-[#5B42F3] transition-colors hover:bg-[#F4F0FF] cursor-pointer"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="fullName" className="block text-xs font-semibold text-[#131129]">
                        Full Name *
                      </label>
                      <input
                        id="fullName"
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Alex Morgan"
                        className="mt-1.5 w-full rounded-lg border border-[#DDD6FE] bg-white px-3.5 py-2.5 text-sm text-[#131129] placeholder-[#9591AD] focus:border-[#5B42F3] focus:outline-none focus:ring-2 focus:ring-[#5B42F3]/25"
                      />
                    </div>
                    <div>
                      <label htmlFor="businessEmail" className="block text-xs font-semibold text-[#131129]">
                        Business Email *
                      </label>
                      <input
                        id="businessEmail"
                        type="email"
                        required
                        value={businessEmail}
                        onChange={(e) => setBusinessEmail(e.target.value)}
                        placeholder="name@company.com"
                        className="mt-1.5 w-full rounded-lg border border-[#DDD6FE] bg-white px-3.5 py-2.5 text-sm text-[#131129] placeholder-[#9591AD] focus:border-[#5B42F3] focus:outline-none focus:ring-2 focus:ring-[#5B42F3]/25"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="companyName" className="block text-xs font-semibold text-[#131129]">
                        Company Name
                      </label>
                      <input
                        id="companyName"
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="Organization or brand name"
                        className="mt-1.5 w-full rounded-lg border border-[#DDD6FE] bg-white px-3.5 py-2.5 text-sm text-[#131129] placeholder-[#9591AD] focus:border-[#5B42F3] focus:outline-none focus:ring-2 focus:ring-[#5B42F3]/25"
                      />
                    </div>
                    <div>
                      <label htmlFor="country" className="block text-xs font-semibold text-[#131129]">
                        Country *
                      </label>
                      <input
                        id="country"
                        type="text"
                        required
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        placeholder="Pakistan, USA, UK, Canada, UAE..."
                        className="mt-1.5 w-full rounded-lg border border-[#DDD6FE] bg-white px-3.5 py-2.5 text-sm text-[#131129] placeholder-[#9591AD] focus:border-[#5B42F3] focus:outline-none focus:ring-2 focus:ring-[#5B42F3]/25"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="serviceRequired" className="block text-xs font-semibold text-[#131129]">
                        Service Required *
                      </label>
                      <select
                        id="serviceRequired"
                        value={serviceRequired}
                        onChange={(e) => setServiceRequired(e.target.value)}
                        className="mt-1.5 w-full rounded-lg border border-[#DDD6FE] bg-white px-3.5 py-2.5 text-sm text-[#131129] focus:border-[#5B42F3] focus:outline-none focus:ring-2 focus:ring-[#5B42F3]/25"
                      >
                        {SERVICE_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <label htmlFor="projectBudget" className="block text-xs font-semibold text-[#131129]">
                          Project Budget ({budgetCurrency})
                        </label>
                        <div className="inline-flex rounded-md border border-[#DDD6FE] bg-white p-0.5">
                          {(['USD', 'PKR'] as const).map((curr) => (
                            <button
                              key={curr}
                              type="button"
                              onClick={() => handleCurrencyChange(curr)}
                              className={`rounded px-2 py-0.5 text-[11px] font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                                budgetCurrency === curr
                                  ? 'bg-[#5B42F3] text-white'
                                  : 'text-[#56536E] hover:text-[#131129]'
                              }`}
                            >
                              {curr === 'USD' ? '$ USD' : 'PKR'}
                            </button>
                          ))}
                        </div>
                      </div>
                      <select
                        id="projectBudget"
                        value={projectBudget}
                        onChange={(e) => setProjectBudget(e.target.value)}
                        className="mt-1.5 w-full rounded-lg border border-[#DDD6FE] bg-white px-3.5 py-2.5 text-sm text-[#131129] focus:border-[#5B42F3] focus:outline-none focus:ring-2 focus:ring-[#5B42F3]/25"
                      >
                        {BUDGET_OPTIONS_BY_CURRENCY[budgetCurrency].map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="projectDetails" className="block text-xs font-semibold text-[#131129]">
                      Project Details *
                    </label>
                    <textarea
                      id="projectDetails"
                      rows={4}
                      required
                      value={projectDetails}
                      onChange={(e) => setProjectDetails(e.target.value)}
                      placeholder="Tell us about your objectives, timeline, and what you are looking to build or grow..."
                      className="mt-1.5 w-full rounded-lg border border-[#DDD6FE] bg-white px-3.5 py-2.5 text-sm text-[#131129] placeholder-[#9591AD] focus:border-[#5B42F3] focus:outline-none focus:ring-2 focus:ring-[#5B42F3]/25"
                    />
                  </div>

                  {errorMsg && (
                    <div
                      role="alert"
                      className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium text-red-700"
                    >
                      {errorMsg}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full bg-[#493f81] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:bg-[#3d346e] disabled:opacity-60 cursor-pointer"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Sending Project Inquiry...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Send Project Inquiry
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
