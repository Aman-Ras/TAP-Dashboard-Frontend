'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

// onChange prop → controlled mode (used in RecruiterDetailClient)
// no onChange  → URL mode (used on page-level server components)
export default function PositionFilter({ positions = [], current = '', onChange }) {
  const router      = useRouter();
  const pathname    = usePathname();
  const searchParams = useSearchParams();

  const [open, setOpen]     = useState(false);
  const [query, setQuery]   = useState('');
  const ref                  = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filtered = positions.filter((p) =>
    p.toLowerCase().includes(query.toLowerCase())
  );

  const select = (position) => {
    setOpen(false);
    setQuery('');
    if (onChange) {
      onChange(position);
    } else {
      const params = new URLSearchParams(searchParams.toString());
      if (position) params.set('position', position);
      else params.delete('position');
      router.push(`${pathname}?${params.toString()}`);
    }
  };

  const label = current || 'All Positions';

  return (
    <div ref={ref} style={{ position: 'relative', minWidth: 200 }}>
      {/* Trigger button */}
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          width: '100%',
          padding: '7px 12px',
          background: current ? 'rgba(99,102,241,0.1)' : 'var(--surface-2)',
          border: `1px solid ${current ? '#6366f1' : 'var(--border)'}`,
          borderRadius: 8,
          fontSize: 13,
          color: current ? '#818cf8' : 'var(--muted-2)',
          cursor: 'pointer',
          textAlign: 'left',
          transition: 'all 0.12s',
        }}
      >
        {/* briefcase icon */}
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
          <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
        </svg>
        <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {label}
        </span>
        {current && (
          <span
            onClick={(e) => { e.stopPropagation(); select(''); }}
            style={{ marginLeft: 'auto', color: 'var(--muted)', fontSize: 16, lineHeight: 1, cursor: 'pointer' }}
            title="Clear filter"
          >
            ×
          </span>
        )}
        {!current && (
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginLeft: 'auto', flexShrink: 0, opacity: 0.4 }}>
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 6px)',
          left: 0,
          zIndex: 100,
          width: 280,
          background: 'var(--surface-2)',
          border: '1px solid var(--border)',
          borderRadius: 10,
          boxShadow: '0 12px 32px rgba(0,0,0,0.5)',
          overflow: 'hidden',
        }}>
          {/* Search */}
          <div style={{ padding: '8px 10px', borderBottom: '1px solid var(--border)' }}>
            <div style={{ position: 'relative' }}>
              <svg style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
                width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search position…"
                style={{
                  width: '100%',
                  padding: '5px 8px 5px 26px',
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 6,
                  fontSize: 12,
                  color: 'var(--text)',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          {/* Options */}
          <div style={{ maxHeight: 260, overflowY: 'auto' }}>
            {/* All option */}
            <button
              onClick={() => select('')}
              style={{
                display: 'block',
                width: '100%',
                padding: '8px 14px',
                textAlign: 'left',
                fontSize: 12,
                background: !current ? 'rgba(99,102,241,0.1)' : 'transparent',
                color: !current ? '#818cf8' : 'var(--muted-2)',
                border: 'none',
                cursor: 'pointer',
                borderBottom: '1px solid var(--border-subtle)',
              }}
            >
              All Positions
            </button>
            {filtered.length === 0 && (
              <div style={{ padding: '12px 14px', fontSize: 12, color: 'var(--muted)', textAlign: 'center' }}>
                No results
              </div>
            )}
            {filtered.map((p) => (
              <button
                key={p}
                onClick={() => select(p)}
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '8px 14px',
                  textAlign: 'left',
                  fontSize: 12,
                  background: current === p ? 'rgba(99,102,241,0.1)' : 'transparent',
                  color: current === p ? '#818cf8' : 'var(--text)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background 0.1s',
                }}
                onMouseEnter={(e) => { if (current !== p) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                onMouseLeave={(e) => { if (current !== p) e.currentTarget.style.background = 'transparent'; }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
