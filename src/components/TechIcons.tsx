interface TechItem {
  name: string;
  category: string;
  accent: string;
  mark: string;
}

export const TECH_STACK: TechItem[] = [
  { name: 'HTML5', category: 'Markup', accent: '#E34F26', mark: 'H5' },
  { name: 'CSS3', category: 'Styling', accent: '#5B42F3', mark: 'C3' },
  { name: 'JavaScript', category: 'Language', accent: '#D97706', mark: 'JS' },
  { name: 'React', category: 'Frontend', accent: '#5B42F3', mark: 'Re' },
  { name: 'Next.js', category: 'Full-Stack', accent: '#131129', mark: 'Nx' },
  { name: 'Node.js', category: 'Runtime', accent: '#16A34A', mark: 'Nd' },
  { name: 'Python', category: 'Backend / AI', accent: '#4338CA', mark: 'Py' },
  { name: 'PHP', category: 'Server', accent: '#6D28D9', mark: 'PHP' },
  { name: 'WordPress', category: 'CMS', accent: '#4F46E5', mark: 'WP' },
  { name: 'Shopify', category: 'Commerce', accent: '#15803D', mark: 'Sh' },
  { name: 'MySQL', category: 'Relational DB', accent: '#5B42F3', mark: 'SQL' },
  { name: 'MongoDB', category: 'Document DB', accent: '#15803D', mark: 'MDB' },
  { name: 'AI Technologies', category: 'Automation', accent: '#5B42F3', mark: 'AI' },
];

export function TechBadgeMark({ item }: { item: TechItem }) {
  return (
    <div
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#E7E2FA] bg-[#F6F4FF] font-mono-tabular text-xs font-semibold tracking-tight transition-colors duration-200 group-hover:border-[#8B75FF] group-hover:bg-white"
      style={{ color: item.accent }}
    >
      {item.mark}
    </div>
  );
}
