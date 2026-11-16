import { ServiceVisualType } from '../types/agency';

interface Props {
  type: ServiceVisualType;
}

export function ServiceVisual3D({ type }: Props) {
  return (
    <div
      aria-hidden="true"
      className="perspective-1000 relative flex h-36 w-full items-center justify-center overflow-hidden rounded-xl border border-[#E7E2FA] bg-gradient-to-br from-[#FAF9FF] via-[#F2EEFF] to-[#EAE3FF]"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-35"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(91,66,243,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(91,66,243,0.08) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      />

      {type === 'web' && (
        <div className="preserve-3d relative h-24 w-40 transition-transform duration-300 ease-out group-hover:-translate-y-1 group-hover:[transform:rotateX(8deg)_rotateY(-10deg)]">
          <div className="absolute inset-0 rounded-lg border border-[#D4CBFA] bg-white/95 shadow-md" />
          <div className="absolute inset-x-0 top-0 flex h-4 items-center gap-1 rounded-t-lg border-b border-[#EDE9FE] bg-[#F8F6FF] px-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#5B42F3]" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#8B75FF]" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#C4B7FC]" />
          </div>
          <div className="absolute left-3 top-6 right-8 h-7 rounded border border-[#E7E2FA] bg-[#F4F0FF]/90 p-1.5">
            <div className="h-1.5 w-14 rounded bg-[#5B42F3]" />
            <div className="mt-1 h-1 w-20 rounded bg-[#8B75FF]/70" />
          </div>
          <div className="absolute -right-2 bottom-2 h-14 w-12 rounded-md border border-[#8B75FF]/50 bg-white p-1.5 shadow-lg transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
            <div className="h-4 rounded bg-gradient-to-br from-[#5B42F3] to-[#8B75FF]" />
            <div className="mt-1.5 h-1 w-full rounded bg-[#D9D1FB]" />
            <div className="mt-1 h-1 w-3/4 rounded bg-[#EDE9FE]" />
          </div>
          <div className="absolute bottom-3 left-3 h-7 w-22 rounded border border-[#EDE9FE] bg-white p-1.5">
            <div className="flex gap-1">
              <div className="h-4 w-5 rounded-sm bg-[#8B75FF]/30" />
              <div className="h-4 w-5 rounded-sm bg-[#5B42F3]/25" />
              <div className="h-4 w-5 rounded-sm bg-[#8B75FF]/40" />
            </div>
          </div>
        </div>
      )}

      {type === 'software' && (
        <div className="preserve-3d relative flex h-24 w-40 items-center justify-center transition-transform duration-300 ease-out group-hover:-translate-y-1 group-hover:[transform:rotateX(10deg)_rotateY(10deg)]">
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 160 96" fill="none">
            <path d="M40 48 L80 28 L120 48 L80 68 Z" stroke="#8B75FF" strokeWidth="1.5" strokeDasharray="3 3" />
            <path d="M80 28 L80 68" stroke="#5B42F3" strokeWidth="1.5" opacity="0.4" />
          </svg>
          <div className="relative z-10 flex h-11 w-11 rotate-12 items-center justify-center rounded-xl border border-[#5B42F3]/30 bg-gradient-to-br from-[#5B42F3] to-[#7C63FF] shadow-lg transition-transform duration-300 group-hover:rotate-0 group-hover:scale-105">
            <div className="h-4 w-4 rounded-sm border-2 border-white/85" />
          </div>
          <div className="absolute left-5 top-8 h-7 w-7 rounded-lg border border-[#C4B7FC] bg-white shadow-sm transition-transform duration-300 group-hover:-translate-x-1" />
          <div className="absolute right-5 top-8 h-7 w-7 rounded-lg border border-[#C4B7FC] bg-white shadow-sm transition-transform duration-300 group-hover:translate-x-1" />
          <div className="absolute bottom-2 left-1/2 h-5 w-16 -translate-x-1/2 rounded-md border border-[#C4B7FC] bg-white/95 shadow-sm" />
        </div>
      )}

      {type === 'marketing' && (
        <div className="preserve-3d relative flex h-24 w-40 items-center justify-center transition-transform duration-300 ease-out group-hover:-translate-y-1 group-hover:[transform:rotateX(8deg)_rotateY(-8deg)]">
          <div className="absolute h-20 w-20 rounded-full border border-[#8B75FF]/35 bg-white/40" />
          <div className="absolute h-14 w-14 rounded-full border border-[#5B42F3]/25 bg-white/70" />
          <div className="relative z-10 flex items-center gap-2">
            <div className="h-14 w-16 -rotate-6 rounded-lg border border-[#D9D1FB] bg-white p-2 shadow-md transition-transform duration-300 group-hover:-rotate-12">
              <div className="h-5 w-full rounded bg-[#F3EFFF]" />
              <div className="mt-1.5 h-1.5 w-10 rounded bg-[#5B42F3]" />
              <div className="mt-1 h-1 w-7 rounded bg-[#8B75FF]" />
            </div>
            <div className="h-14 w-16 rotate-6 rounded-lg border border-[#8B75FF]/50 bg-gradient-to-br from-[#5B42F3] to-[#2B1D78] p-2 shadow-lg transition-transform duration-300 group-hover:rotate-12">
              <div className="h-5 w-full rounded bg-white/20" />
              <div className="mt-1.5 h-1.5 w-10 rounded bg-white/90" />
              <div className="mt-1 h-1 w-7 rounded bg-[#C4B7FC]" />
            </div>
          </div>
        </div>
      )}

      {type === 'meta' && (
        <div className="preserve-3d relative flex h-24 w-40 items-center justify-center transition-transform duration-300 ease-out group-hover:-translate-y-1 group-hover:[transform:rotateX(8deg)_rotateY(8deg)]">
          <div className="flex flex-col items-center gap-1.5">
            <div className="h-4 w-32 rounded-md border border-[#C4B7FC] bg-white shadow-sm transition-transform duration-300 group-hover:scale-105" />
            <div className="h-4 w-24 rounded-md border border-[#8B75FF]/70 bg-[#EAE3FF] shadow-sm transition-transform duration-300 group-hover:scale-105" />
            <div className="h-5 w-16 rounded-md bg-gradient-to-r from-[#5B42F3] to-[#8B75FF] shadow-md transition-transform duration-300 group-hover:scale-110" />
          </div>
          <div className="absolute right-2 top-3 rounded-md border border-[#D9D1FB] bg-white px-2 py-1 shadow-md">
            <div className="h-1.5 w-8 rounded bg-[#5B42F3]" />
            <div className="mt-1 h-1 w-5 rounded bg-[#8B75FF]" />
          </div>
        </div>
      )}

      {type === 'google' && (
        <div className="preserve-3d relative flex h-24 w-40 items-center justify-center transition-transform duration-300 ease-out group-hover:-translate-y-1 group-hover:[transform:rotateX(8deg)_rotateY(-8deg)]">
          <div className="flex h-16 items-end gap-2 rounded-lg border border-[#D9D1FB] bg-white/95 px-4 py-2.5 shadow-md">
            <div className="h-4 w-3.5 rounded-t bg-[#DDD6FE]" />
            <div className="h-6 w-3.5 rounded-t bg-[#B9AAFC]" />
            <div className="h-8 w-3.5 rounded-t bg-[#8B75FF]" />
            <div className="h-11 w-3.5 rounded-t bg-[#5B42F3] transition-transform duration-300 group-hover:scale-y-110 origin-bottom" />
          </div>
          <div className="absolute -top-0.5 left-4 flex h-6 w-28 items-center gap-1.5 rounded-md border border-[#8B75FF]/45 bg-white px-2 shadow-md transition-transform duration-300 group-hover:translate-x-1">
            <div className="h-2.5 w-2.5 rounded-full border-2 border-[#5B42F3]" />
            <div className="h-1.5 w-14 rounded bg-[#EDE9FE]" />
          </div>
        </div>
      )}

      {type === 'branding' && (
        <div className="preserve-3d relative flex h-24 w-40 items-center justify-center transition-transform duration-300 ease-out group-hover:-translate-y-1 group-hover:[transform:rotateX(10deg)_rotateY(8deg)]">
          <div className="relative h-16 w-28">
            <div className="absolute left-0 top-2 h-14 w-20 -rotate-6 rounded-lg border border-[#D9D1FB] bg-white p-2 shadow-sm transition-transform duration-300 group-hover:-rotate-12">
              <div className="h-3 w-3 rounded-full bg-[#8B75FF]" />
              <div className="mt-2 h-1.5 w-10 rounded bg-[#131129]/80" />
            </div>
            <div className="absolute right-0 top-0 h-14 w-20 rotate-3 rounded-lg border border-[#5B42F3]/30 bg-gradient-to-br from-[#5B42F3] to-[#221662] p-2 shadow-lg transition-transform duration-300 group-hover:rotate-6">
              <div className="flex h-6 w-6 items-center justify-center rounded border border-white/40">
                <div className="h-2.5 w-2.5 rotate-45 bg-[#C4B7FC]" />
              </div>
              <div className="mt-2 h-1 w-10 rounded bg-white/75" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
