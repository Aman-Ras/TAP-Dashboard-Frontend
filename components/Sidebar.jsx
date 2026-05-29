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

export default function Sidebar({ open = false, onClose }) {
  const pathname = usePathname();

  const isActive = (href) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <aside className={`sidebar${open ? ' open' : ''}`}>
      {/* Mobile close button */}
      <button className="sidebar-close-btn" onClick={onClose} aria-label="Close menu">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>

      {/* Logo */}
      <div className="px-5 py-6">
        <div className="flex items-center gap-1.5">
          <span style={{ fontSize: 24, fontWeight: 800, color: '#ffffff', letterSpacing: '-0.5px', lineHeight: 1 }}>
            berlin
          </span>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#f87171', display: 'inline-block', flexShrink: 0 }} />
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

    </aside>
  );
}
