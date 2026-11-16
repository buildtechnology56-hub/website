import { ArrowLeft, Info, Mail, ServerOff, ShieldAlert } from 'lucide-react';
import { DEFAULT_PUBLIC_CONTENT } from '../lib/defaultContent';

interface AdminDashboardProps {
  onExitAdmin: () => void;
}

export function AdminDashboard({ onExitAdmin }: AdminDashboardProps) {
  const { services, projects, testimonials, faqs, siteContent } = DEFAULT_PUBLIC_CONTENT;

  return (
    <div className="min-h-[78vh] bg-[#FAF9FF] px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl rounded-2xl border border-[#DFD8FA] bg-white p-6 shadow-sm sm:p-10">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#EDE9FE] text-[#5B42F3]">
            <ServerOff className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#5B42F3]">
              Static Hosting Mode (GitHub Pages)
            </p>
            <h1 className="mt-1 font-display text-2xl font-bold text-[#131129]">
              Build Technology Admin Workspace Unavailable
            </h1>
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50/70 p-4 text-sm leading-relaxed text-amber-950">
          <div className="flex items-start gap-2.5">
            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
            <p>
              This public website is deployed on <strong>GitHub Pages static hosting</strong>. Administrator login, live content editing, and server-side inquiry database persistence require a Node.js/Express backend and are disabled here so no credentials or private data are exposed in the browser.
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl border border-[#E7E2FA] bg-[#FAF9FF] p-3.5 text-center">
            <p className="font-mono-tabular text-lg font-bold text-[#5B42F3]">{services.length}</p>
            <p className="mt-0.5 text-xs text-[#56536E]">Services</p>
          </div>
          <div className="rounded-xl border border-[#E7E2FA] bg-[#FAF9FF] p-3.5 text-center">
            <p className="font-mono-tabular text-lg font-bold text-[#5B42F3]">{projects.length}</p>
            <p className="mt-0.5 text-xs text-[#56536E]">Projects</p>
          </div>
          <div className="rounded-xl border border-[#E7E2FA] bg-[#FAF9FF] p-3.5 text-center">
            <p className="font-mono-tabular text-lg font-bold text-[#5B42F3]">{testimonials.length}</p>
            <p className="mt-0.5 text-xs text-[#56536E]">Review Slots</p>
          </div>
          <div className="rounded-xl border border-[#E7E2FA] bg-[#FAF9FF] p-3.5 text-center">
            <p className="font-mono-tabular text-lg font-bold text-[#5B42F3]">{faqs.length}</p>
            <p className="mt-0.5 text-xs text-[#56536E]">FAQs</p>
          </div>
        </div>

        <div className="mt-6 space-y-3 rounded-xl border border-[#E7E2FA] bg-[#FAF9FF] p-5 text-sm text-[#3C3954]">
          <div className="flex items-start gap-2.5">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#5B42F3]" />
            <p>
              <strong>Updating Site Content:</strong> Edit <code className="rounded bg-white px-1.5 py-0.5 text-xs">src/lib/defaultContent.ts</code> and push to the <code className="rounded bg-white px-1.5 py-0.5 text-xs">main</code> branch to trigger an automatic GitHub Pages rebuild.
            </p>
          </div>
          <div className="flex items-start gap-2.5">
            <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[#5B42F3]" />
            <p>
              <strong>Client Inquiries:</strong> All visitor inquiries from the Contact section are routed directly to{' '}
              <a href={`mailto:${siteContent.contactEmail}`} className="font-semibold text-[#5B42F3] hover:underline">
                {siteContent.contactEmail}
              </a>{' '}
              and WhatsApp.
            </p>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="button"
            onClick={onExitAdmin}
            className="inline-flex min-h-[42px] items-center gap-2 rounded-full bg-[#5B42F3] px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#4932D0] cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            Return to Website
          </button>
        </div>
      </div>
    </div>
  );
}
