'use client';
import { useState, useMemo } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import PositionFilter from '../../components/PositionFilter';
import { BarChartWrapper, COLORS } from '../../components/ActivityChart';

function ScoreBar({ score }) {
  if (score === null || score === undefined) return <span style={{ color:'var(--muted)', fontSize:12 }}>—</span>;
  const color = score >= 70 ? '#10b981' : score >= 40 ? '#f59e0b' : '#ef4444';
  return (
    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
      <div style={{ flex:1, height:5, borderRadius:99, background:'var(--surface-3)', minWidth:60 }}>
        <div style={{ height:'100%', borderRadius:99, background:color, width:`${score}%`, transition:'width 0.3s' }} />
      </div>
      <span style={{ fontSize:12, fontWeight:600, color, minWidth:30, textAlign:'right' }}>{score}%</span>
    </div>
  );
}


function avatarBg(str = '') {
  let h = 0;
  for (const c of str) h = c.charCodeAt(0) + ((h << 5) - h);
  return COLORS[Math.abs(h) % COLORS.length];
}

function daysAgo(n) { const d = new Date(); d.setDate(d.getDate()-n); return d.toISOString().slice(0,10); }
function today()     { return new Date().toISOString().slice(0,10); }

const PRESETS = [
  { label:'Today',     getStart: () => today(),      getEnd: () => today()      },
  { label:'Yesterday', getStart: () => daysAgo(1),   getEnd: () => daysAgo(1)   },
  { label:'7d',        getStart: () => daysAgo(7),   getEnd: () => today()      },
  { label:'30d',       getStart: () => daysAgo(30),  getEnd: () => today()      },
  { label:'3m',        getStart: () => daysAgo(90),  getEnd: () => today()      },
  { label:'6m',        getStart: () => daysAgo(180), getEnd: () => today()      },
];

export default function CandidatesClient({ candidates, positions, recruiters, filters }) {
  const router      = useRouter();
  const pathname    = usePathname();
  const searchParams = useSearchParams();

  const [search,  setSearch]  = useState('');
  const [sortKey, setSortKey] = useState('score');
  const [sortDir, setSortDir] = useState('desc');

  const push = (updates) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([k, v]) => v ? params.set(k, v) : params.delete(k));
    router.push(`${pathname}?${params.toString()}`);
  };

  const clearAll = () => {
    router.push(pathname);
  };

  const activePreset = PRESETS.find(p => filters.startDate === p.getStart() && filters.endDate === p.getEnd())?.label ?? null;

  const toggle = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir(key === 'score' ? 'desc' : 'asc'); }
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return [...candidates]
      .filter(c =>
        !q ||
        (c.candidateName || '').toLowerCase().includes(q) ||
        (c.candidateEmail || '').toLowerCase().includes(q) ||
        (c.applyFor || '').toLowerCase().includes(q) ||
        (c.recruiter || '').toLowerCase().includes(q)
      )
      .sort((a, b) => {
        let av = a[sortKey] ?? -1;
        let bv = b[sortKey] ?? -1;
        if (sortKey === 'startTime') { av = av ? new Date(av).getTime() : 0; bv = bv ? new Date(bv).getTime() : 0; }
        if (av < bv) return sortDir === 'asc' ? -1 : 1;
        if (av > bv) return sortDir === 'asc' ? 1 : -1;
        return 0;
      });
  }, [candidates, search, sortKey, sortDir]);

  // Score distribution for chart
  const scoreBuckets = [
    { name:'0–20',  value: candidates.filter(c => c.score !== null && c.score <= 20).length },
    { name:'21–40', value: candidates.filter(c => c.score > 20 && c.score <= 40).length },
    { name:'41–60', value: candidates.filter(c => c.score > 40 && c.score <= 60).length },
    { name:'61–80', value: candidates.filter(c => c.score > 60 && c.score <= 80).length },
    { name:'81–100',value: candidates.filter(c => c.score > 80).length },
  ];

  const withScore   = candidates.filter(c => c.score !== null && c.score !== undefined);
  const avgScore    = withScore.length ? Math.round(withScore.reduce((s, c) => s + c.score, 0) / withScore.length) : null;
  const passedCount = candidates.filter(c => c.score !== null && c.score >= 70).length;

  const hasFilters = filters.position || filters.startDate || filters.endDate || filters.recruiterEmail;

  const COLS = [
    { key:'candidateName', label:'Candidate' },
    { key:'applyFor',      label:'Position' },
    { key:'recruiter',     label:'Recruiter' },
    { key:'startTime',     label:'Interview Date', align:'right' },
    { key:'score',         label:'Score', align:'right' },
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:20 }}>
        <div>
          <h1 className="page-title">Candidates</h1>
          <p className="page-sub">Completed interviews with AI evaluation scores</p>
        </div>
      </div>

      {/* Stat cards row */}
      <div className="stat-grid">
        {[
          { label:'Completed', value: candidates.length, color:'#f0f0f0' },
          { label:'With Score', value: withScore.length, color:'#60a5fa' },
          { label:'Avg Score', value: avgScore !== null ? `${avgScore}%` : '—', color: avgScore >= 70 ? '#10b981' : avgScore >= 40 ? '#f59e0b' : '#ef4444' },
          { label:'Passed (≥70%)', value: passedCount, color:'#10b981' },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:14, padding:'16px 20px', position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', left:0, top:'20%', bottom:'20%', width:2, background:color, borderRadius:'0 2px 2px 0', opacity:0.7 }} />
            <p style={{ fontSize:10.5, fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase', color:'var(--muted)', marginBottom:10 }}>{label}</p>
            <p style={{ fontSize:28, fontWeight:700, letterSpacing:'-0.02em', color }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Score distribution chart */}
      <div className="chart-grid-wide">
        <div className="card">
          <p style={{ fontWeight:600, fontSize:13, color:'var(--text)', marginBottom:16 }}>Score Distribution</p>
          <BarChartWrapper data={scoreBuckets} dataKey="value" xKey="name" height={180} />
        </div>
        <div className="card" style={{ display:'flex', flexDirection:'column', gap:12 }}>
          <p style={{ fontWeight:600, fontSize:13, color:'var(--text)' }}>Score Bands</p>
          {[
            { label:'Excellent (81–100%)', count: scoreBuckets[4].value, color:'#10b981' },
            { label:'Good (61–80%)',       count: scoreBuckets[3].value, color:'#6366f1' },
            { label:'Average (41–60%)',    count: scoreBuckets[2].value, color:'#f59e0b' },
            { label:'Below Avg (21–40%)', count: scoreBuckets[1].value, color:'#f97316' },
            { label:'Poor (0–20%)',        count: scoreBuckets[0].value, color:'#ef4444' },
          ].map(({ label, count, color }) => {
            const pct = candidates.length ? Math.round((count / candidates.length) * 100) : 0;
            return (
              <div key={label}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                  <span style={{ fontSize:11, color:'var(--muted-2)', display:'flex', alignItems:'center', gap:6 }}>
                    <span style={{ width:6, height:6, borderRadius:'50%', background:color, display:'inline-block' }} />
                    {label}
                  </span>
                  <span style={{ fontSize:11, fontWeight:600, color:'var(--text)' }}>{count}</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-bar-fill" style={{ width:`${pct}%`, background:color }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filter bar */}
      <div style={{ display:'flex', alignItems:'center', gap:10, flexWrap:'wrap', padding:'11px 16px', background:'var(--surface)', border:'1px solid var(--border)', borderRadius:12, marginBottom:14 }}>

        {/* Position */}
        <div style={{ display:'flex', alignItems:'center', gap:7 }}>
          <span style={{ fontSize:11, fontWeight:700, color:'var(--muted)', letterSpacing:'0.06em', textTransform:'uppercase', whiteSpace:'nowrap' }}>Position</span>
          <PositionFilter positions={positions} current={filters.position} onChange={(p) => push({ position: p })} />
        </div>

        <div style={{ width:1, height:22, background:'var(--border)' }} />

        {/* Recruiter dropdown */}
        <div style={{ display:'flex', alignItems:'center', gap:7 }}>
          <span style={{ fontSize:11, fontWeight:700, color:'var(--muted)', letterSpacing:'0.06em', textTransform:'uppercase', whiteSpace:'nowrap' }}>Recruiter</span>
          <select
            value={filters.recruiterEmail}
            onChange={(e) => push({ recruiterEmail: e.target.value })}
            style={{ background:'var(--surface-2)', border:'1px solid var(--border)', borderRadius:8, padding:'6px 10px', fontSize:12, color: filters.recruiterEmail ? '#818cf8' : 'var(--muted-2)', outline:'none', cursor:'pointer' }}
          >
            <option value="">All Recruiters</option>
            {recruiters.map(r => (
              <option key={r.email} value={r.email}>{r.name}</option>
            ))}
          </select>
        </div>

        <div style={{ width:1, height:22, background:'var(--border)' }} />

        {/* Preset date buttons */}
        <div style={{ display:'flex', alignItems:'center', gap:6 }}>
          <span style={{ fontSize:11, fontWeight:700, color:'var(--muted)', letterSpacing:'0.06em', textTransform:'uppercase', whiteSpace:'nowrap' }}>Period</span>
          <div style={{ display:'flex', gap:4 }}>
            {PRESETS.map(p => (
              <button key={p.label} onClick={() => push({ startDate: p.getStart(), endDate: p.getEnd() })}
                style={{ padding:'4px 10px', borderRadius:6, fontSize:12, fontWeight:500, cursor:'pointer', border:'1px solid',
                  background: activePreset===p.label ? 'rgba(99,102,241,0.12)' : 'var(--surface-2)',
                  borderColor: activePreset===p.label ? '#6366f1' : 'var(--border)',
                  color: activePreset===p.label ? '#818cf8' : 'var(--muted-2)',
                }}>
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {hasFilters && (
          <button onClick={clearAll} className="clear-btn" style={{ marginLeft:'auto' }}>Clear all</button>
        )}
      </div>

      {/* Table */}
      <div className="card-tight" style={{ overflow:'hidden' }}>
        {/* Toolbar */}
        <div style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 16px', borderBottom:'1px solid var(--border)', background:'var(--surface)' }}>
          <div style={{ position:'relative', flex:1, maxWidth:280 }}>
            <svg style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }}
              width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input style={{ width:'100%', paddingLeft:32, paddingRight:12, paddingTop:7, paddingBottom:7, background:'var(--surface-2)', border:'1px solid var(--border)', borderRadius:8, fontSize:13, color:'var(--text)', outline:'none' }}
              placeholder="Search candidate, position, recruiter…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <span style={{ fontSize:11, color:'var(--muted)', marginLeft:'auto', whiteSpace:'nowrap' }}>{filtered.length} candidates</span>
        </div>

        <div style={{ overflowX:'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                {COLS.map(c => (
                  <th key={c.key} onClick={() => toggle(c.key)}
                    style={{ textAlign: c.align || 'left', cursor:'pointer', userSelect:'none' }}>
                    {c.label}
                    <span style={{ marginLeft:4, opacity: sortKey === c.key ? 1 : 0.3 }}>
                      {sortKey === c.key ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={5} style={{ textAlign:'center', padding:'48px 16px', color:'var(--muted)' }}>No candidates found</td></tr>
              )}
              {filtered.map((c, i) => (
                <tr key={String(c._id)}>
                  <td>
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <div className="avatar" style={{ background: avatarBg(c.candidateName || ''), color:'#fff', fontSize:11 }}>
                        {(c.candidateName || '?').slice(0,2).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight:500, fontSize:13, color:'var(--text)' }}>{c.candidateName || '—'}</div>
                        <div style={{ fontSize:11, color:'var(--muted)', marginTop:1 }}>{c.candidateEmail || ''}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ color:'var(--muted-2)' }}>{c.applyFor || '—'}</td>
                  <td>
                    <div style={{ fontSize:12 }}>{c.recruiter || '—'}</div>
                    <div style={{ fontSize:11, color:'var(--muted)', marginTop:1 }}>{c.recruiterEmail || ''}</div>
                  </td>
                  <td style={{ textAlign:'right', fontSize:12, color:'var(--muted)' }}>
                    {c.startTime ? new Date(c.startTime).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}) : '—'}
                  </td>
                  <td style={{ textAlign:'right', minWidth:130 }}>
                    <ScoreBar score={c.score} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
