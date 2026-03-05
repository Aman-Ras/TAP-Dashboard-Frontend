import { getOverview, getAllRecruiters, getPositions } from '../lib/api';
import StatCard from '../components/StatCard';
import { BarChartWrapper } from '../components/ActivityChart';
import OverviewFilterBar from '../components/OverviewFilterBar';
import Link from 'next/link';

function avatarBg(str = '') {
  const palette = ['#6366f1','#10b981','#f59e0b','#ef4444','#06b6d4','#ec4899','#8b5cf6'];
  let h = 0;
  for (const c of str) h = c.charCodeAt(0) + ((h << 5) - h);
  return palette[Math.abs(h) % palette.length];
}

export default async function OverviewPage({ searchParams }) {
  const position  = searchParams?.position  || '';
  const startDate = searchParams?.startDate || '';
  const endDate   = searchParams?.endDate   || '';

  const apiParams = {};
  if (position)  apiParams.position  = position;
  if (startDate) apiParams.startDate = startDate;
  if (endDate)   apiParams.endDate   = endDate;

  let overview = null, recruiters = [], positions = [];
  try {
    [overview, recruiters, positions] = await Promise.all([
      getOverview(apiParams),
      getAllRecruiters(apiParams),
      getPositions(),
    ]);
  } catch {
    return (
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:320 }}>
        <div style={{ textAlign:'center' }}>
          <div style={{ fontSize:36, marginBottom:12, color:'var(--danger)' }}>⚠</div>
          <p style={{ fontWeight:600, color:'var(--text)' }}>Backend not reachable</p>
          <p style={{ fontSize:13, color:'var(--muted)', marginTop:6 }}>Make sure the server is running on port 5002</p>
        </div>
      </div>
    );
  }

  const top10 = [...recruiters]
    .sort((a, b) => b.totalInterviews - a.totalInterviews)
    .slice(0, 10)
    .map((r) => ({ name: (r.name || r.email).split(' ')[0], value: r.totalInterviews }));

  const top5 = [...recruiters]
    .sort((a, b) => (b.totalInterviews + b.totalSessions) - (a.totalInterviews + a.totalSessions))
    .slice(0, 5);

  const CHART_STATUS_COLORS = { Completed:'#10b981', Scheduled:'#6366f1', Cancelled:'#ef4444', Blocked:'#f59e0b' };

  // Build a human-readable period label for chart headers
  const periodLabel = startDate || endDate
    ? `${startDate || '…'} → ${endDate || '…'}`
    : null;

  // Build the pass-through qs for recruiter links
  const linkQS = new URLSearchParams(apiParams).toString();
  const withQS = (href) => linkQS ? `${href}?${linkQS}` : href;

  return (
    <div>
      {/* Page header */}
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:20 }}>
        <div>
          <h1 className="page-title">Overview</h1>
          <p className="page-sub">Real-time recruiter activity across all channels</p>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:11, fontWeight:600, background:'var(--success-dim)', color:'var(--success)', padding:'5px 12px', borderRadius:99 }}>
          <span style={{ width:6, height:6, borderRadius:'50%', background:'var(--success)', display:'inline-block' }} />
          Live
        </div>
      </div>

      {/* Combined filter bar */}
      <OverviewFilterBar
        positions={positions}
        currentPosition={position}
        currentStart={startDate}
        currentEnd={endDate}
      />

      {/* Stat cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:20 }}>
        <StatCard label="Total Interviews"
          value={overview.totalInterviews.toLocaleString()}
          sub={periodLabel ? `in selected period` : `${overview.thisMonthInterviews} this month`}
          color="accent"
          icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>}
        />
        <StatCard label="Resume Sessions"
          value={overview.totalResumeSessions.toLocaleString()}
          color="info"
          icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>}
        />
        <StatCard label="Resumes Processed"
          value={overview.totalResumesProcessed.toLocaleString()}
          sub={`${overview.totalPassed} passed threshold`}
          color="success"
          icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
        />
        <StatCard label="Active Recruiters"
          value={overview.activeRecruiters}
          sub={`${overview.totalInterviews + overview.totalResumeSessions} total actions`}
          color="warning"
          icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>}
        />
      </div>

      {/* Chart row */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 300px', gap:12, marginBottom:12 }}>
        {top10.length > 0 && (
          <div className="card">
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
              <p style={{ fontWeight:600, fontSize:13, color:'var(--text)' }}>Interviews per Recruiter</p>
              <span style={{ fontSize:11, color:'var(--muted)' }}>
                Top 10
                {position && ` · ${position}`}
                {periodLabel && ` · ${periodLabel}`}
              </span>
            </div>
            <BarChartWrapper data={top10} dataKey="value" xKey="name" height={220} />
          </div>
        )}

        {overview.byStatus && Object.keys(overview.byStatus).length > 0 && (
          <div className="card" style={{ display:'flex', flexDirection:'column' }}>
            <p style={{ fontWeight:600, fontSize:13, color:'var(--text)', marginBottom:16 }}>Interview Status</p>
            <div style={{ display:'flex', flexDirection:'column', gap:14, flex:1 }}>
              {Object.entries(overview.byStatus).sort((a,b)=>b[1]-a[1]).map(([status, count]) => {
                const pct = overview.totalInterviews ? Math.round((count / overview.totalInterviews) * 100) : 0;
                const c = CHART_STATUS_COLORS[status] || '#555';
                return (
                  <div key={status}>
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:5 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:7 }}>
                        <span style={{ width:7, height:7, borderRadius:'50%', background:c, display:'inline-block' }} />
                        <span style={{ fontSize:12, color:'var(--text-2)' }}>{status}</span>
                      </div>
                      <div style={{ display:'flex', alignItems:'center', gap:7 }}>
                        <span style={{ fontSize:12, fontWeight:600, color:'var(--text)' }}>{count.toLocaleString()}</span>
                        <span style={{ fontSize:11, color:'var(--muted)', minWidth:28, textAlign:'right' }}>{pct}%</span>
                      </div>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-bar-fill" style={{ width:`${pct}%`, background:c }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Top recruiters table */}
      {top5.length > 0 && (
        <div className="card-tight" style={{ overflow:'hidden' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 20px', borderBottom:'1px solid var(--border)' }}>
            <p style={{ fontWeight:600, fontSize:13, color:'var(--text)' }}>
              Top Recruiters
              {position && <span style={{ color:'var(--muted)', fontWeight:400 }}> · {position}</span>}
              {periodLabel && <span style={{ color:'var(--muted)', fontWeight:400 }}> · {periodLabel}</span>}
            </p>
            <Link href={withQS('/recruiters')} className="view-all-link">View all →</Link>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width:32 }}>#</th>
                <th>Recruiter</th>
                <th style={{ textAlign:'right' }}>Interviews</th>
                <th style={{ textAlign:'right' }}>Completed</th>
                <th style={{ textAlign:'right' }}>Sessions</th>
                <th style={{ textAlign:'right' }}>Pass Rate</th>
                <th style={{ textAlign:'right' }}>Last Active</th>
              </tr>
            </thead>
            <tbody>
              {top5.map((r, i) => (
                <tr key={r.email}>
                  <td><span style={{ color:'var(--muted)', fontSize:12, fontWeight:600 }}>{i+1}</span></td>
                  <td>
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <div className="avatar" style={{ background:avatarBg(r.name||r.email), color:'#fff', fontSize:11 }}>
                        {(r.name||r.email||'?').slice(0,2).toUpperCase()}
                      </div>
                      <div>
                        <Link href={withQS(`/recruiter/${encodeURIComponent(r.email)}`)}
                          style={{ color:'var(--text)', fontWeight:500, fontSize:13, textDecoration:'none' }}>
                          {r.name || '—'}
                        </Link>
                        <div style={{ fontSize:11, color:'var(--muted)', marginTop:1 }}>{r.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ textAlign:'right', fontWeight:600 }}>{r.totalInterviews}</td>
                  <td style={{ textAlign:'right', color:'var(--success)' }}>{r.completed}</td>
                  <td style={{ textAlign:'right' }}>{r.totalSessions}</td>
                  <td style={{ textAlign:'right' }}>
                    <span className={`badge ${r.passRate>=70?'badge-green':r.passRate>=40?'badge-yellow':'badge-gray'}`}>{r.passRate}%</span>
                  </td>
                  <td style={{ textAlign:'right', fontSize:11, color:'var(--muted)' }}>
                    {r.lastActive ? new Date(r.lastActive).toLocaleDateString() : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
