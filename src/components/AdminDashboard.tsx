import { FormEvent, useCallback, useEffect, useState } from 'react';
import {
  Briefcase,
  Check,
  FileText,
  HelpCircle,
  Inbox,
  Loader2,
  Lock,
  LogOut,
  MessageSquareQuote,
  Plus,
  Save,
  Share2,
  Trash2,
} from 'lucide-react';
import {
  AgencyDatabase,
  FaqItem,
  InquiryItem,
  ProjectItem,
  ServiceItem,
  SiteContent,
  TestimonialItem,
} from '../types/agency';
import { DEMO_IMAGE_OPTIONS, resolveProjectImage } from '../lib/projectImages';

type AdminTab =
  | 'inquiries'
  | 'services'
  | 'projects'
  | 'testimonials'
  | 'faqs'
  | 'content'
  | 'socials';

interface AdminDashboardProps {
  onContentUpdated: () => void;
}

const SESSION_KEY = 'bt_admin_token';

export function AdminDashboard({ onContentUpdated }: AdminDashboardProps) {
  const [token, setToken] = useState<string>(() => sessionStorage.getItem(SESSION_KEY) || '');
  const [passcode, setPasscode] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  const [activeTab, setActiveTab] = useState<AdminTab>('inquiries');
  const [db, setDb] = useState<AgencyDatabase | null>(null);
  const [loadingData, setLoadingData] = useState(false);
  const [saving, setSaving] = useState(false);
  const [banner, setBanner] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Inquiry filters
  const [inquiryFilter, setInquiryFilter] = useState<'all' | 'new' | 'reviewed' | 'archived'>('all');
  const [inquirySearch, setInquirySearch] = useState('');

  const showToast = (type: 'success' | 'error', text: string) => {
    setBanner({ type, text });
    setTimeout(() => {
      setBanner((prev) => (prev?.text === text ? null : prev));
    }, 4000);
  };

  const fetchAdminData = useCallback(async (authToken: string) => {
    setLoadingData(true);
    try {
      const res = await fetch('/api/admin/data', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (res.status === 401) {
        sessionStorage.removeItem(SESSION_KEY);
        setToken('');
        return;
      }
      if (!res.ok) throw new Error('Failed to load admin workspace');
      const data = (await res.json()) as AgencyDatabase;
      setDb(data);
    } catch {
      showToast('error', 'Could not load admin workspace data.');
    } finally {
      setLoadingData(false);
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetchAdminData(token);
    }
  }, [token, fetchAdminData]);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode }),
      });
      const data = await res.json();
      if (!res.ok || !data.token) {
        setAuthError(data.error || 'Authentication failed.');
        return;
      }
      sessionStorage.setItem(SESSION_KEY, data.token);
      setToken(data.token);
      setPasscode('');
    } catch {
      setAuthError('Unable to reach authentication server.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setToken('');
    setDb(null);
  };

  const saveEndpoint = async (endpoint: string, payload: unknown, successText: string) => {
    if (!token) return;
    setSaving(true);
    try {
      const res = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Save failed');
      }
      showToast('success', successText);
      onContentUpdated();
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'Failed to save changes.');
    } finally {
      setSaving(false);
    }
  };

  const updateInquiryStatus = async (id: string, status: InquiryItem['status']) => {
    if (!token || !db) return;
    try {
      const res = await fetch(`/api/admin/inquiries/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error();
      setDb({
        ...db,
        inquiries: db.inquiries.map((inq) => (inq.id === id ? { ...inq, status } : inq)),
      });
      showToast('success', `Inquiry marked as ${status}.`);
    } catch {
      showToast('error', 'Failed to update inquiry status.');
    }
  };

  const deleteInquiry = async (id: string) => {
    if (!token || !db) return;
    try {
      const res = await fetch(`/api/admin/inquiries/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      setDb({
        ...db,
        inquiries: db.inquiries.filter((inq) => inq.id !== id),
      });
      showToast('success', 'Inquiry deleted.');
    } catch {
      showToast('error', 'Failed to delete inquiry.');
    }
  };

  if (!token) {
    return (
      <div className="min-h-[75vh] bg-[#FAF9FF] px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-md rounded-2xl border border-[#DFD8FA] bg-white p-8 shadow-sm">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EDE9FE] text-[#5B42F3]">
            <Lock className="h-5 w-5" />
          </div>
          <h1 className="mt-4 font-display text-2xl font-bold text-[#131129]">
            Build Technology Admin
          </h1>
          <p className="mt-2 text-sm text-[#56536E]">
            Sign in with your administrator passcode configured in the server environment to manage inquiries and website content.
          </p>

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label htmlFor="admin-passcode" className="block text-xs font-semibold text-[#131129]">
                Admin Passcode
              </label>
              <input
                id="admin-passcode"
                type="password"
                required
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter ADMIN_PASSCODE"
                className="mt-1.5 w-full rounded-lg border border-[#DDD6FE] bg-white px-3.5 py-2.5 text-sm text-[#131129] focus:border-[#5B42F3] focus:outline-none focus:ring-2 focus:ring-[#5B42F3]/25"
              />
            </div>

            {authError && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs font-medium text-red-700">
                {authError}
              </div>
            )}

            <button
              type="submit"
              disabled={authLoading}
              className="inline-flex min-h-[42px] w-full items-center justify-center gap-2 rounded-full bg-[#5B42F3] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#4932D0] disabled:opacity-60 cursor-pointer"
            >
              {authLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Sign In to Workspace'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const navItems: Array<{ id: AdminTab; label: string; icon: typeof Inbox; count?: number }> = [
    { id: 'inquiries', label: 'Contact Inquiries', icon: Inbox, count: db?.inquiries.length },
    { id: 'services', label: 'Services', icon: Briefcase, count: db?.services.length },
    { id: 'projects', label: 'Portfolio Projects', icon: FileText, count: db?.projects.length },
    { id: 'testimonials', label: 'Testimonials', icon: MessageSquareQuote, count: db?.testimonials.length },
    { id: 'faqs', label: 'FAQs', icon: HelpCircle, count: db?.faqs.length },
    { id: 'content', label: 'Website Content', icon: FileText },
    { id: 'socials', label: 'Social Links', icon: Share2 },
  ];

  const filteredInquiries =
    db?.inquiries.filter((inq) => {
      const matchesStatus = inquiryFilter === 'all' || inq.status === inquiryFilter;
      const q = inquirySearch.trim().toLowerCase();
      const matchesSearch =
        !q ||
        inq.fullName.toLowerCase().includes(q) ||
        inq.businessEmail.toLowerCase().includes(q) ||
        inq.companyName.toLowerCase().includes(q) ||
        inq.country.toLowerCase().includes(q) ||
        inq.serviceRequired.toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    }) || [];

  return (
    <div className="min-h-[82vh] bg-[#FAF9FF]">
      <div className="mx-auto flex max-w-[1320px] flex-col lg:flex-row">
        {/* Sidebar */}
        <aside className="w-full shrink-0 border-b border-[#E7E2FA] bg-white p-4 lg:min-h-[82vh] lg:w-64 lg:border-b-0 lg:border-r lg:p-5">
          <div className="mb-4 flex items-center justify-between lg:block">
            <p className="text-xs font-semibold text-[#706C8A]">Content & Lead Management</p>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[#56536E] hover:text-red-600 lg:hidden cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign Out
            </button>
          </div>

          <nav className="flex gap-1.5 overflow-x-auto pb-1 lg:flex-col lg:gap-1 lg:overflow-visible">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center justify-between gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-[#EDE9FE] text-[#5B42F3] font-semibold'
                      : 'text-[#56536E] hover:bg-[#F5F3FF] hover:text-[#131129]'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{item.label}</span>
                  </span>
                  {typeof item.count === 'number' && (
                    <span className="font-mono-tabular text-xs text-[#706C8A]">{item.count}</span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="mt-8 hidden border-t border-[#ECE8FA] pt-4 lg:block">
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-[#56536E] transition-colors hover:bg-red-50 hover:text-red-700 cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </aside>

        {/* Main Workspace */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mb-6 flex flex-col justify-between gap-3 border-b border-[#E7E2FA] pb-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-xs text-[#706C8A]">
                Admin / {navItems.find((n) => n.id === activeTab)?.label}
              </p>
              <h1 className="mt-0.5 font-display text-2xl font-bold text-[#131129]">
                {navItems.find((n) => n.id === activeTab)?.label}
              </h1>
            </div>
            {banner && (
              <div
                className={`inline-flex items-center gap-2 rounded-lg border px-3.5 py-2 text-xs font-semibold ${
                  banner.type === 'success'
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                    : 'border-red-200 bg-red-50 text-red-700'
                }`}
              >
                {banner.type === 'success' && <Check className="h-3.5 w-3.5" />}
                <span>{banner.text}</span>
              </div>
            )}
          </div>

          {loadingData || !db ? (
            <div className="flex items-center justify-center rounded-2xl border border-[#E7E2FA] bg-white py-20">
              <Loader2 className="h-6 w-6 animate-spin text-[#5B42F3]" />
            </div>
          ) : (
            <>
              {/* 1. INQUIRIES */}
              {activeTab === 'inquiries' && (
                <div className="space-y-4">
                  <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                    <div className="inline-flex rounded-lg border border-[#E7E2FA] bg-white p-1">
                      {(['all', 'new', 'reviewed', 'archived'] as const).map((status) => (
                        <button
                          key={status}
                          type="button"
                          onClick={() => setInquiryFilter(status)}
                          className={`rounded-md px-3 py-1.5 text-xs font-semibold capitalize transition-colors cursor-pointer ${
                            inquiryFilter === status
                              ? 'bg-[#5B42F3] text-white'
                              : 'text-[#56536E] hover:text-[#131129]'
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>

                    <input
                      type="search"
                      value={inquirySearch}
                      onChange={(e) => setInquirySearch(e.target.value)}
                      placeholder="Filter by client, company, country, or service..."
                      className="w-full rounded-lg border border-[#DDD6FE] bg-white px-3.5 py-2 text-sm text-[#131129] sm:w-72 focus:border-[#5B42F3] focus:outline-none"
                    />
                  </div>

                  {filteredInquiries.length === 0 ? (
                    <div className="rounded-2xl border border-[#E7E2FA] bg-white p-12 text-center">
                      <Inbox className="mx-auto h-8 w-8 text-[#9591AD]" />
                      <h2 className="mt-3 font-display text-base font-semibold text-[#131129]">
                        No inquiries match this view
                      </h2>
                      <p className="mt-1 text-sm text-[#706C8A]">
                        Submissions sent through the public Contact form appear here automatically.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredInquiries.map((inq) => (
                        <div
                          key={inq.id}
                          className="rounded-xl border border-[#E7E2FA] bg-white p-5 transition-colors hover:border-[#C4B7FC]"
                        >
                          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                            <div>
                              <div className="flex flex-wrap items-center gap-2 text-xs text-[#706C8A]">
                                <span className="font-semibold text-[#5B42F3]">{inq.serviceRequired}</span>
                                <span>·</span>
                                <span>{inq.country}</span>
                                <span>·</span>
                                <span className="font-mono-tabular">{inq.projectBudget}</span>
                                <span>·</span>
                                <span className="font-mono-tabular">
                                  {new Date(inq.createdAt).toLocaleString()}
                                </span>
                              </div>
                              <h3 className="mt-1 font-display text-base font-bold text-[#131129]">
                                {inq.fullName}
                                {inq.companyName ? ` — ${inq.companyName}` : ''}
                              </h3>
                              <p className="text-xs font-medium text-[#5B42F3]">{inq.businessEmail}</p>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <select
                                value={inq.status}
                                onChange={(e) =>
                                  updateInquiryStatus(inq.id, e.target.value as InquiryItem['status'])
                                }
                                aria-label="Inquiry status"
                                className="rounded-lg border border-[#DDD6FE] bg-[#FAF9FF] px-2.5 py-1.5 text-xs font-semibold text-[#131129]"
                              >
                                <option value="new">New</option>
                                <option value="reviewed">Reviewed</option>
                                <option value="archived">Archived</option>
                              </select>
                              <button
                                type="button"
                                onClick={() => deleteInquiry(inq.id)}
                                aria-label="Delete inquiry"
                                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E7E2FA] text-[#706C8A] hover:border-red-200 hover:bg-red-50 hover:text-red-600 cursor-pointer"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                          <p className="mt-3 border-t border-[#F4F0FF] pt-3 text-sm leading-relaxed text-[#3C3954]">
                            {inq.projectDetails}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* 2. SERVICES */}
              {activeTab === 'services' && (
                <div className="space-y-4">
                  {db.services.map((svc: ServiceItem, idx: number) => (
                    <div key={svc.id} className="rounded-xl border border-[#E7E2FA] bg-white p-5 space-y-4">
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-12">
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-semibold text-[#131129]">Index</label>
                          <input
                            type="text"
                            value={svc.number}
                            onChange={(e) => {
                              const next = [...db.services];
                              next[idx] = { ...svc, number: e.target.value };
                              setDb({ ...db, services: next });
                            }}
                            className="mt-1 w-full rounded-lg border border-[#DDD6FE] px-3 py-2 font-mono-tabular text-sm text-[#131129]"
                          />
                        </div>
                        <div className="sm:col-span-10">
                          <label className="block text-xs font-semibold text-[#131129]">Service Title</label>
                          <input
                            type="text"
                            value={svc.title}
                            onChange={(e) => {
                              const next = [...db.services];
                              next[idx] = { ...svc, title: e.target.value };
                              setDb({ ...db, services: next });
                            }}
                            className="mt-1 w-full rounded-lg border border-[#DDD6FE] px-3 py-2 text-sm font-medium text-[#131129]"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#131129]">Description</label>
                        <textarea
                          rows={2}
                          value={svc.description}
                          onChange={(e) => {
                            const next = [...db.services];
                            next[idx] = { ...svc, description: e.target.value };
                            setDb({ ...db, services: next });
                          }}
                          className="mt-1 w-full rounded-lg border border-[#DDD6FE] px-3 py-2 text-sm text-[#131129]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#131129]">
                          Deliverables (comma-separated)
                        </label>
                        <input
                          type="text"
                          value={svc.deliverables.join(', ')}
                          onChange={(e) => {
                            const next = [...db.services];
                            next[idx] = {
                              ...svc,
                              deliverables: e.target.value
                                .split(',')
                                .map((s) => s.trim())
                                .filter(Boolean),
                            };
                            setDb({ ...db, services: next });
                          }}
                          className="mt-1 w-full rounded-lg border border-[#DDD6FE] px-3 py-2 text-sm text-[#131129]"
                        />
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-end">
                    <button
                      type="button"
                      disabled={saving}
                      onClick={() =>
                        saveEndpoint('/api/admin/services', { services: db.services }, 'Services updated.')
                      }
                      className="inline-flex min-h-[42px] items-center gap-2 rounded-full bg-[#5B42F3] px-5 py-2 text-sm font-semibold text-white hover:bg-[#4932D0] disabled:opacity-60 cursor-pointer"
                    >
                      <Save className="h-4 w-4" />
                      Save Services
                    </button>
                  </div>
                </div>
              )}

              {/* 3. PROJECTS */}
              {activeTab === 'projects' && (
                <div className="space-y-4">
                  <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                    <p className="text-sm text-[#56536E]">
                      Edit demo projects or publish completed client projects. Toggle “Demo Project” off once real case studies are added.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        const newProj: ProjectItem = {
                          id: `proj-${Date.now()}`,
                          title: 'New Digital Solution',
                          category: 'Web & E-Commerce',
                          shortDescription: 'Brief project overview.',
                          fullSummary: 'Detailed scope and engineering architecture summary.',
                          technologies: ['React', 'Next.js'],
                          imageUrl: 'demo:commerce',
                          projectUrl: '#contact',
                          isDemo: true,
                        };
                        setDb({ ...db, projects: [newProj, ...db.projects] });
                      }}
                      className="inline-flex items-center gap-1.5 rounded-full border border-[#5B42F3] bg-white px-4 py-2 text-xs font-semibold text-[#5B42F3] hover:bg-[#EDE9FE] whitespace-nowrap cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Add Project
                    </button>
                  </div>

                  {db.projects.map((proj: ProjectItem, idx: number) => (
                    <div key={proj.id} className="rounded-xl border border-[#E7E2FA] bg-white p-5 space-y-4">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={resolveProjectImage(proj.imageUrl)}
                            alt={proj.title}
                            referrerPolicy="no-referrer"
                            className="h-12 w-16 rounded-lg border border-[#E7E2FA] object-cover"
                          />
                          <label className="inline-flex items-center gap-2 text-xs font-semibold text-[#131129] cursor-pointer">
                            <input
                              type="checkbox"
                              checked={proj.isDemo}
                              onChange={(e) => {
                                const next = [...db.projects];
                                next[idx] = { ...proj, isDemo: e.target.checked };
                                setDb({ ...db, projects: next });
                              }}
                              className="rounded border-[#DDD6FE]"
                            />
                            Label as Demo Project
                          </label>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            setDb({ ...db, projects: db.projects.filter((p) => p.id !== proj.id) })
                          }
                          className="inline-flex items-center gap-1 text-xs font-medium text-red-600 hover:underline cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Remove
                        </button>
                      </div>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <label className="block text-xs font-semibold text-[#131129]">Project Title</label>
                          <input
                            type="text"
                            value={proj.title}
                            onChange={(e) => {
                              const next = [...db.projects];
                              next[idx] = { ...proj, title: e.target.value };
                              setDb({ ...db, projects: next });
                            }}
                            className="mt-1 w-full rounded-lg border border-[#DDD6FE] px-3 py-2 text-sm text-[#131129]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-[#131129]">Category</label>
                          <input
                            type="text"
                            value={proj.category}
                            onChange={(e) => {
                              const next = [...db.projects];
                              next[idx] = { ...proj, category: e.target.value };
                              setDb({ ...db, projects: next });
                            }}
                            className="mt-1 w-full rounded-lg border border-[#DDD6FE] px-3 py-2 text-sm text-[#131129]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <label className="block text-xs font-semibold text-[#131129]">
                            Preview Image Preset or URL
                          </label>
                          <select
                            value={
                              DEMO_IMAGE_OPTIONS.some((o) => o.value === proj.imageUrl)
                                ? proj.imageUrl
                                : 'custom'
                            }
                            onChange={(e) => {
                              if (e.target.value !== 'custom') {
                                const next = [...db.projects];
                                next[idx] = { ...proj, imageUrl: e.target.value };
                                setDb({ ...db, projects: next });
                              }
                            }}
                            className="mt-1 w-full rounded-lg border border-[#DDD6FE] px-3 py-2 text-sm text-[#131129]"
                          >
                            {DEMO_IMAGE_OPTIONS.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                            <option value="custom">Custom Image URL</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-[#131129]">
                            Technologies (comma-separated)
                          </label>
                          <input
                            type="text"
                            value={proj.technologies.join(', ')}
                            onChange={(e) => {
                              const next = [...db.projects];
                              next[idx] = {
                                ...proj,
                                technologies: e.target.value
                                  .split(',')
                                  .map((t) => t.trim())
                                  .filter(Boolean),
                              };
                              setDb({ ...db, projects: next });
                            }}
                            className="mt-1 w-full rounded-lg border border-[#DDD6FE] px-3 py-2 text-sm text-[#131129]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#131129]">Short Description</label>
                        <textarea
                          rows={2}
                          value={proj.shortDescription}
                          onChange={(e) => {
                            const next = [...db.projects];
                            next[idx] = { ...proj, shortDescription: e.target.value };
                            setDb({ ...db, projects: next });
                          }}
                          className="mt-1 w-full rounded-lg border border-[#DDD6FE] px-3 py-2 text-sm text-[#131129]"
                        />
                      </div>
                    </div>
                  ))}

                  <div className="flex justify-end">
                    <button
                      type="button"
                      disabled={saving}
                      onClick={() =>
                        saveEndpoint('/api/admin/projects', { projects: db.projects }, 'Portfolio projects saved.')
                      }
                      className="inline-flex min-h-[42px] items-center gap-2 rounded-full bg-[#5B42F3] px-5 py-2 text-sm font-semibold text-white hover:bg-[#4932D0] disabled:opacity-60 cursor-pointer"
                    >
                      <Save className="h-4 w-4" />
                      Save Portfolio Projects
                    </button>
                  </div>
                </div>
              )}

              {/* 4. TESTIMONIALS */}
              {activeTab === 'testimonials' && (
                <div className="space-y-4">
                  <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                    <p className="text-sm text-[#56536E]">
                      Replace placeholder testimonial slots with genuine client quotes once approved.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        const item: TestimonialItem = {
                          id: `test-${Date.now()}`,
                          quote: 'Enter verified client review text here.',
                          authorName: 'Client Name',
                          authorRole: 'Role / Title',
                          companyName: 'Company Name',
                          isPlaceholder: false,
                        };
                        setDb({ ...db, testimonials: [...db.testimonials, item] });
                      }}
                      className="inline-flex items-center gap-1.5 rounded-full border border-[#5B42F3] bg-white px-4 py-2 text-xs font-semibold text-[#5B42F3] hover:bg-[#EDE9FE] whitespace-nowrap cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Add Testimonial
                    </button>
                  </div>

                  {db.testimonials.map((item: TestimonialItem, idx: number) => (
                    <div key={item.id} className="rounded-xl border border-[#E7E2FA] bg-white p-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="inline-flex items-center gap-2 text-xs font-semibold text-[#131129] cursor-pointer">
                          <input
                            type="checkbox"
                            checked={item.isPlaceholder}
                            onChange={(e) => {
                              const next = [...db.testimonials];
                              next[idx] = { ...item, isPlaceholder: e.target.checked };
                              setDb({ ...db, testimonials: next });
                            }}
                          />
                          Mark as Editable Placeholder Slot
                        </label>
                        <button
                          type="button"
                          onClick={() =>
                            setDb({
                              ...db,
                              testimonials: db.testimonials.filter((t) => t.id !== item.id),
                            })
                          }
                          className="text-xs font-medium text-red-600 hover:underline cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                      <textarea
                        rows={2}
                        value={item.quote}
                        onChange={(e) => {
                          const next = [...db.testimonials];
                          next[idx] = { ...item, quote: e.target.value };
                          setDb({ ...db, testimonials: next });
                        }}
                        className="w-full rounded-lg border border-[#DDD6FE] px-3 py-2 text-sm text-[#131129]"
                      />
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        <input
                          type="text"
                          value={item.authorName}
                          placeholder="Author Name"
                          onChange={(e) => {
                            const next = [...db.testimonials];
                            next[idx] = { ...item, authorName: e.target.value };
                            setDb({ ...db, testimonials: next });
                          }}
                          className="rounded-lg border border-[#DDD6FE] px-3 py-2 text-sm text-[#131129]"
                        />
                        <input
                          type="text"
                          value={item.authorRole}
                          placeholder="Role"
                          onChange={(e) => {
                            const next = [...db.testimonials];
                            next[idx] = { ...item, authorRole: e.target.value };
                            setDb({ ...db, testimonials: next });
                          }}
                          className="rounded-lg border border-[#DDD6FE] px-3 py-2 text-sm text-[#131129]"
                        />
                        <input
                          type="text"
                          value={item.companyName}
                          placeholder="Company"
                          onChange={(e) => {
                            const next = [...db.testimonials];
                            next[idx] = { ...item, companyName: e.target.value };
                            setDb({ ...db, testimonials: next });
                          }}
                          className="rounded-lg border border-[#DDD6FE] px-3 py-2 text-sm text-[#131129]"
                        />
                      </div>
                    </div>
                  ))}

                  <div className="flex justify-end">
                    <button
                      type="button"
                      disabled={saving}
                      onClick={() =>
                        saveEndpoint(
                          '/api/admin/testimonials',
                          { testimonials: db.testimonials },
                          'Testimonials updated.',
                        )
                      }
                      className="inline-flex min-h-[42px] items-center gap-2 rounded-full bg-[#5B42F3] px-5 py-2 text-sm font-semibold text-white hover:bg-[#4932D0] disabled:opacity-60 cursor-pointer"
                    >
                      <Save className="h-4 w-4" />
                      Save Testimonials
                    </button>
                  </div>
                </div>
              )}

              {/* 5. FAQs */}
              {activeTab === 'faqs' && (
                <div className="space-y-4">
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        const nextFaq: FaqItem = {
                          id: `faq-${Date.now()}`,
                          question: 'New question?',
                          answer: 'Clear, concise answer.',
                        };
                        setDb({ ...db, faqs: [...db.faqs, nextFaq] });
                      }}
                      className="inline-flex items-center gap-1.5 rounded-full border border-[#5B42F3] bg-white px-4 py-2 text-xs font-semibold text-[#5B42F3] hover:bg-[#EDE9FE] cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Add FAQ
                    </button>
                  </div>

                  {db.faqs.map((faq: FaqItem, idx: number) => (
                    <div key={faq.id} className="rounded-xl border border-[#E7E2FA] bg-white p-5 space-y-3">
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-mono-tabular text-xs font-semibold text-[#5B42F3]">
                          FAQ {String(idx + 1).padStart(2, '0')}
                        </span>
                        <button
                          type="button"
                          onClick={() => setDb({ ...db, faqs: db.faqs.filter((f) => f.id !== faq.id) })}
                          className="text-xs font-medium text-red-600 hover:underline cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                      <input
                        type="text"
                        value={faq.question}
                        onChange={(e) => {
                          const next = [...db.faqs];
                          next[idx] = { ...faq, question: e.target.value };
                          setDb({ ...db, faqs: next });
                        }}
                        className="w-full rounded-lg border border-[#DDD6FE] px-3 py-2 text-sm font-medium text-[#131129]"
                      />
                      <textarea
                        rows={2}
                        value={faq.answer}
                        onChange={(e) => {
                          const next = [...db.faqs];
                          next[idx] = { ...faq, answer: e.target.value };
                          setDb({ ...db, faqs: next });
                        }}
                        className="w-full rounded-lg border border-[#DDD6FE] px-3 py-2 text-sm text-[#131129]"
                      />
                    </div>
                  ))}

                  <div className="flex justify-end">
                    <button
                      type="button"
                      disabled={saving}
                      onClick={() => saveEndpoint('/api/admin/faqs', { faqs: db.faqs }, 'FAQs updated.')}
                      className="inline-flex min-h-[42px] items-center gap-2 rounded-full bg-[#5B42F3] px-5 py-2 text-sm font-semibold text-white hover:bg-[#4932D0] disabled:opacity-60 cursor-pointer"
                    >
                      <Save className="h-4 w-4" />
                      Save FAQs
                    </button>
                  </div>
                </div>
              )}

              {/* 6. WEBSITE CONTENT */}
              {activeTab === 'content' && (
                <ContentEditor
                  siteContent={db.siteContent}
                  saving={saving}
                  onChange={(siteContent) => setDb({ ...db, siteContent })}
                  onSave={() =>
                    saveEndpoint('/api/admin/site-content', db.siteContent, 'Website content updated.')
                  }
                />
              )}

              {/* 7. SOCIAL LINKS */}
              {activeTab === 'socials' && (
                <div className="rounded-xl border border-[#E7E2FA] bg-white p-6 space-y-4">
                  <p className="text-sm text-[#56536E]">
                    Enter full URLs (including https://) for the social profiles you want visible in the footer. Leave any field blank to keep it hidden.
                  </p>
                  {(['linkedin', 'twitter', 'instagram', 'facebook', 'github'] as const).map((key) => (
                    <div key={key}>
                      <label className="block text-xs font-semibold capitalize text-[#131129]">
                        {key === 'twitter' ? 'X / Twitter' : key}
                      </label>
                      <input
                        type="url"
                        value={db.siteContent.socialLinks[key]}
                        placeholder={`https://${key === 'twitter' ? 'x.com' : `${key}.com`}/buildtechnology`}
                        onChange={(e) =>
                          setDb({
                            ...db,
                            siteContent: {
                              ...db.siteContent,
                              socialLinks: {
                                ...db.siteContent.socialLinks,
                                [key]: e.target.value,
                              },
                            },
                          })
                        }
                        className="mt-1 w-full rounded-lg border border-[#DDD6FE] px-3.5 py-2 text-sm text-[#131129]"
                      />
                    </div>
                  ))}
                  <div className="flex justify-end pt-2">
                    <button
                      type="button"
                      disabled={saving}
                      onClick={() =>
                        saveEndpoint('/api/admin/site-content', db.siteContent, 'Social links saved.')
                      }
                      className="inline-flex min-h-[42px] items-center gap-2 rounded-full bg-[#5B42F3] px-5 py-2 text-sm font-semibold text-white hover:bg-[#4932D0] disabled:opacity-60 cursor-pointer"
                    >
                      <Save className="h-4 w-4" />
                      Save Social Links
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

function ContentEditor({
  siteContent,
  saving,
  onChange,
  onSave,
}: {
  siteContent: SiteContent;
  saving: boolean;
  onChange: (next: SiteContent) => void;
  onSave: () => void;
}) {
  const fields: Array<{ key: keyof SiteContent; label: string; multiline?: boolean; hint?: string }> = [
    { key: 'heroHeadline', label: 'Hero Headline' },
    { key: 'heroSupportingText', label: 'Hero Supporting Text', multiline: true },
    { key: 'trustHeading', label: 'Trust Section Heading' },
    { key: 'trustDescription', label: 'Trust Section Description', multiline: true },
    { key: 'aboutHeading', label: 'About Section Heading' },
    { key: 'aboutDescription', label: 'About Section Description', multiline: true },
    { key: 'aboutMission', label: 'Our Mission', multiline: true },
    { key: 'aboutVision', label: 'Our Vision', multiline: true },
    { key: 'aboutApproach', label: 'Our Approach', multiline: true },
    { key: 'marketingHeadline', label: 'Marketing Section Headline' },
    { key: 'marketingDescription', label: 'Marketing Section Description', multiline: true },
    { key: 'contactHeadline', label: 'Contact Section Headline' },
    { key: 'contactDescription', label: 'Contact Section Description', multiline: true },
    { key: 'contactEmail', label: 'Public Contact Email' },
    {
      key: 'phoneNumber',
      label: 'Public Phone Number (Optional)',
      hint: 'Separate multiple lines or names with commas (e.g. +92 3322846238 Syed Mahdi Kazmi, +92 3112713755 Syed Haider Rizvi).',
    },
    { key: 'footerTagline', label: 'Footer Tagline' },
    { key: 'footerDescription', label: 'Footer Description', multiline: true },
  ];

  return (
    <div className="rounded-xl border border-[#E7E2FA] bg-white p-6 space-y-4">
      {fields.map((f) => (
        <div key={f.key}>
          <label className="block text-xs font-semibold text-[#131129]">{f.label}</label>
          {f.hint && <p className="mt-0.5 text-xs text-[#706C8A]">{f.hint}</p>}
          {f.multiline ? (
            <textarea
              rows={2}
              value={String(siteContent[f.key] || '')}
              onChange={(e) => onChange({ ...siteContent, [f.key]: e.target.value })}
              className="mt-1 w-full rounded-lg border border-[#DDD6FE] px-3.5 py-2 text-sm text-[#131129]"
            />
          ) : (
            <input
              type="text"
              value={String(siteContent[f.key] || '')}
              onChange={(e) => onChange({ ...siteContent, [f.key]: e.target.value })}
              className="mt-1 w-full rounded-lg border border-[#DDD6FE] px-3.5 py-2 text-sm text-[#131129]"
            />
          )}
        </div>
      ))}
      <div className="flex justify-end pt-2">
        <button
          type="button"
          disabled={saving}
          onClick={onSave}
          className="inline-flex min-h-[42px] items-center gap-2 rounded-full bg-[#5B42F3] px-5 py-2 text-sm font-semibold text-white hover:bg-[#4932D0] disabled:opacity-60 cursor-pointer"
        >
          <Save className="h-4 w-4" />
          Save Website Content
        </button>
      </div>
    </div>
  );
}
