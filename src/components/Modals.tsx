import { ArrowRight, Check, X } from 'lucide-react';
import { ProjectItem, ServiceItem } from '../types/agency';
import { resolveProjectImage } from '../lib/projectImages';

interface ServiceModalProps {
  service: ServiceItem | null;
  onClose: () => void;
  onRequestService: (serviceTitle: string) => void;
}

export function ServiceDetailModal({ service, onClose, onRequestService }: ServiceModalProps) {
  if (!service) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="service-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#131129]/45 p-4 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl rounded-2xl border border-[#DFD8FA] bg-white p-6 shadow-2xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono-tabular text-xs font-semibold text-[#5B42F3]">
              Service {service.number}
            </p>
            <h3 id="service-modal-title" className="mt-1 font-display text-2xl font-bold text-[#131129]">
              {service.title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close service details"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#E7E2FA] text-[#56536E] transition-colors hover:bg-[#F4F0FF] hover:text-[#131129] cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-[#56536E]">{service.description}</p>
        {service.highlights && (
          <p className="mt-3 rounded-xl border border-[#EAE4FF] bg-[#FAF8FF] p-4 text-sm leading-relaxed text-[#3C3954]">
            {service.highlights}
          </p>
        )}

        <div className="mt-6">
          <p className="text-xs font-semibold text-[#131129]">Capabilities &amp; Deliverables</p>
          <ul className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {service.deliverables.map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm text-[#3C3954]">
                <Check className="h-4 w-4 shrink-0 text-[#5B42F3]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-[#ECE8FA] pt-5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="min-h-[42px] rounded-lg border border-[#DFD8FA] px-5 py-2 text-sm font-semibold text-[#56536E] hover:bg-[#F6F4FF] cursor-pointer"
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => {
              const title = service.title.includes('Google Ads')
                ? 'Google Ads'
                : service.title.includes('Branding')
                  ? 'Branding & Design'
                  : service.title;
              onRequestService(title);
            }}
            className="inline-flex min-h-[42px] items-center justify-center gap-2 rounded-full bg-[#5B42F3] px-6 py-2 text-sm font-semibold text-white hover:bg-[#4932D0] cursor-pointer"
          >
            Request This Service
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

interface ProjectModalProps {
  project: ProjectItem | null;
  onClose: () => void;
  onStartSimilar: () => void;
}

export function ProjectDetailModal({ project, onClose, onStartSimilar }: ProjectModalProps) {
  if (!project) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#131129]/45 p-4 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[#DFD8FA] bg-white p-6 shadow-2xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-[#5B42F3]">
              {project.isDemo ? 'Demo Project' : 'Featured Work'} · {project.category}
            </p>
            <h3 id="project-modal-title" className="mt-1 font-display text-2xl font-bold text-[#131129]">
              {project.title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close project preview"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#E7E2FA] text-[#56536E] transition-colors hover:bg-[#F4F0FF] hover:text-[#131129] cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-5 overflow-hidden rounded-xl border border-[#E7E2FA] bg-[#F4F0FF]">
          <img
            src={resolveProjectImage(project.imageUrl)}
            alt={project.title}
            referrerPolicy="no-referrer"
            className="aspect-[4/3] w-full object-cover"
          />
        </div>

        <p className="mt-5 text-sm leading-relaxed text-[#3C3954]">{project.fullSummary}</p>

        <div className="mt-5 border-t border-[#ECE8FA] pt-4">
          <p className="text-xs font-semibold text-[#131129]">Architecture &amp; Technologies</p>
          <p className="mt-1.5 text-sm text-[#56536E]">{project.technologies.join(' · ')}</p>
        </div>

        <div className="mt-7 flex flex-col gap-3 border-t border-[#ECE8FA] pt-5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="min-h-[42px] rounded-lg border border-[#DFD8FA] px-5 py-2 text-sm font-semibold text-[#56536E] hover:bg-[#F6F4FF] cursor-pointer"
          >
            Close
          </button>
          <button
            type="button"
            onClick={onStartSimilar}
            className="inline-flex min-h-[42px] items-center justify-center gap-2 rounded-full bg-[#5B42F3] px-6 py-2 text-sm font-semibold text-white hover:bg-[#4932D0] cursor-pointer"
          >
            Discuss a Similar Project
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
