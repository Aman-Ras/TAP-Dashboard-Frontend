'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { COLORS } from './ActivityChart';

function avatarBg(str = '') {
  let h = 0;
  for (const c of str) h = c.charCodeAt(0) + ((h << 5) - h);
  return COLORS[Math.abs(h) % COLORS.length];
}

function SortIcon({ active, dir }) {
  return (
    <span style={{ display:'inline-flex', flexDirection:'column', marginLeft:4, opacity: active ? 1 : 0.3 }}>
      <svg width="7" height="4" viewBox="0 0 7 4" fill="currentColor" style={{ marginBottom:1, opacity: active && dir==='asc' ? 1 : 0.4 }}>
        <path d="M3.5 0L7 4H0L3.5 0z"/>
      </svg>
      <svg width="7" height="4" viewBox="0 0 7 4" fill="currentColor" style={{ opacity: active && dir==='desc' ? 1 : 0.4 }}>
        <path d="M3.5 4L0 0H7L3.5 4z"/>
      </svg>
    </span>
  );
}

const COLS = [
  { key: 'name',           label: 'Recruiter',       align: 'left'  },
  { key: 'totalInterviews',label: 'Interviews',       align: 'right' },
  { key: 'completed',      label: 'Completed',        align: 'right' },
  { key: 'completionRate', label: 'Completion',       align: 'right' },
  { key: 'totalSessions',  label: 'Resume Sessions',  align: 'right' },
  { key: 'totalResumes',   label: 'Resumes',          align: 'right' },
  { key: 'passRate',       label: 'Pass Rate',        align: 'right' },
  { key: 'lastActive',     label: 'Last Active',      align: 'right' },
];

export default function RecruiterTable({ data = [] }) {
  const [search, setSearch]   = useState('');
  const [sortKey, setSortKey] = useState('totalInterviews');
  const [sortDir, setSortDir] = useState('desc');

  const toggle = (key) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir('desc'); }
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return [...data]
      .filter((r) =>
        (r.name || '').toLowerCase().includes(q) ||
        (r.email || '').toLowerCase().includes(q)
      )
      .sort((a, b) => {
        const av = a[sortKey] ?? '';
        const bv = b[sortKey] ?? '';
        if (av < bv) return sortDir === 'asc' ? -1 : 1;
        if (av > bv) return sortDir === 'asc' ? 1 : -1;
        return 0;
      });
  }, [data, search, sortKey, sortDir]);

  return (
    <div className="card-tight" style={{ overflow:'hidden' }}>
      {/* Toolbar */}
      <div style={{
        display:'flex', alignItems:'center', gap:12,
        padding:'14px 16px',
        borderBottom:'1px solid var(--border)',
        background:'var(--surface)',
      }}>
        <div style={{ position:'relative', flex:1, maxWidth:280 }}>
          <svg
            style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }}
            width="13" height="13" viewBox="0 0 24 24" fill="none"
            stroke="var(--muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            style={{
              width:'100%', paddingLeft:32, paddingRight:12, paddingTop:7, paddingBottom:7,
              background:'var(--surface-2)', border:'1px solid var(--border)', borderRadius:8,
              fontSize:13, color:'var(--text)', outline:'none',
            }}
            placeholder="Search name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <span style={{ fontSize:11, color:'var(--muted)', marginLeft:'auto', whiteSpace:'nowrap' }}>
          {filtered.length} / {data.length}
        </span>
      </div>

      {/* Table */}
      <div style={{ overflowX:'auto' }}>
        <table className="data-table">
          <thead>
            <tr>
              {COLS.map((c) => (
                <th
                  key={c.key}
                  onClick={() => toggle(c.key)}
                  style={{ textAlign: c.align, cursor:'pointer', userSelect:'none' }}
                >
                  {c.label}
                  <SortIcon active={sortKey === c.key} dir={sortDir} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={COLS.length} style={{ textAlign:'center', padding:'48px 16px', color:'var(--muted)' }}>
                  No recruiters match your search
                </td>
              </tr>
            )}
            {filtered.map((r) => {
              const bg = avatarBg(r.name || r.email);
              return (
                <tr key={r.email}>
                  {/* Recruiter */}
                  <td>
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <div className="avatar" style={{ background: bg, color:'#fff', fontSize:11 }}>
                        {(r.name || r.email || '?').slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <Link
                          href={`/recruiter/${encodeURIComponent(r.email)}`}
                          style={{ color:'var(--text)', fontWeight:500, fontSize:13, textDecoration:'none' }}
                        >
                          {r.name || '—'}
                        </Link>
                        <div style={{ fontSize:11, color:'var(--muted)', marginTop:1 }}>{r.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ textAlign:'right', fontWeight:600 }}>{r.totalInterviews}</td>
                  <td style={{ textAlign:'right', color:'var(--success)' }}>{r.completed}</td>
                  {/* Completion with bar */}
                  <td style={{ textAlign:'right' }}>
                    <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:4 }}>
                      <span style={{ fontSize:12, fontWeight:500 }}>{r.completionRate}%</span>
                      <div className="progress-bar" style={{ width:52 }}>
                        <div className="progress-bar-fill" style={{ width:`${r.completionRate}%`, background:COLORS[0] }} />
                      </div>
                    </div>
                  </td>
                  <td style={{ textAlign:'right' }}>{r.totalSessions}</td>
                  <td style={{ textAlign:'right' }}>{r.totalResumes}</td>
                  {/* Pass rate badge */}
                  <td style={{ textAlign:'right' }}>
                    <span className={`badge ${
                      r.passRate >= 70 ? 'badge-green' :
                      r.passRate >= 40 ? 'badge-yellow' :
                      r.passRate > 0   ? 'badge-red' : 'badge-gray'
                    }`}>
                      {r.passRate}%
                    </span>
                  </td>
                  <td style={{ textAlign:'right', fontSize:11, color:'var(--muted)' }}>
                    {r.lastActive ? new Date(r.lastActive).toLocaleDateString() : '—'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
