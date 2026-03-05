'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV = [
  {
    section: 'Analytics',
    links: [
      {
        href: '/',
        label: 'Overview',
        icon: (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
            <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
          </svg>
        ),
      },
      {
        href: '/recruiters',
        label: 'Recruiters',
        icon: (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
        ),
      },
      {
        href: '/comparison',
        label: 'Comparison',
        icon: (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
          </svg>
        ),
      },
      {
        href: '/candidates',
        label: 'Candidates',
        icon: (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
            <polyline points="16 11 18 13 22 9"/>
          </svg>
        ),
      },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (href) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div
        className="px-5 py-5"
        style={{ borderBottom: '1px solid var(--border-subtle)' }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: 'var(--surface-3)', border: '1px solid var(--border)' }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--text)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
            </svg>
          </div>
          <div>
            <div className="text-sm font-bold leading-tight" style={{ color: 'var(--text)' }}>
              RecruiterDash
            </div>
            <div className="text-[10px] leading-tight mt-0.5" style={{ color: 'var(--muted)' }}>
              Internal Analytics
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        {NAV.map((group) => (
          <div key={group.section}>
            <p className="section-title px-3 mb-2 mt-2">{group.section}</p>
            {group.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-item ${isActive(link.href) ? 'active' : ''}`}
              >
                {link.icon}
                <span>{link.label}</span>
                <span className="nav-indicator" />
              </Link>
            ))}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div
        className="px-3 py-4"
        style={{ borderTop: '1px solid var(--border-subtle)' }}
      >
        <div
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg"
          style={{ background: 'var(--surface-2)' }}
        >
          <div
            className="avatar text-[11px] font-bold flex-shrink-0"
            style={{ background: 'var(--surface-3)', border: '1px solid var(--border)', color: 'var(--text)' }}
          >
            RD
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-semibold truncate" style={{ color: 'var(--text)' }}>Dashboard</div>
            <div className="text-[10px] truncate" style={{ color: 'var(--muted)' }}>Read-only · Live</div>
          </div>
          {/* Status dot */}
          <div
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ background: 'var(--success)' }}
            title="Connected to MongoDB"
          />
        </div>
      </div>
    </aside>
  );
}
