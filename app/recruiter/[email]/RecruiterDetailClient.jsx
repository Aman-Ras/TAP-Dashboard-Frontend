'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import StatCard from '../../../components/StatCard';
import DateRangePicker from '../../../components/DateRangePicker';
import PositionFilter from '../../../components/PositionFilter';
import { BarChartWrapper, COLORS } from '../../../components/ActivityChart';

function avatarBg(str = '') {
  let h = 0;
  for (const c of str) h = c.charCodeAt(0) + ((h << 5) - h);
  return COLORS[Math.abs(h) % COLORS.length];
}

function StatusBadge({ status }) {
  const cls = status === 'Completed' ? 'badge-green' : status === 'Scheduled' ? 'badge-blue' : status === 'Cancelled' ? 'badge-red' : 'badge-gray';
  return <span className={`badge ${cls}`}>{status || '—'}</span>;
}

function SectionHeader({ icon, title, badge }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:10, padding:'13px 20px', borderBottom:'1px solid var(--border)', background:'var(--surface-2)' }}>
      <span style={{ color:'var(--muted-2)' }}>{icon}</span>
      <span style={{ fontWeight:600, fontSize:13, color:'var(--text)' }}>{title}</span>
      {badge != null && <span className="badge badge-white" style={{ marginLeft:4 }}>{badge}</span>}
    </div>
  );
}

const IconCalendar = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
const IconFile    = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>;
const IconCheck   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
const IconX       = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;

export default function RecruiterDetailClient({ data, email, initialStart, initialEnd, initialPosition = '', positions = [] }) {
  const router = useRouter();
  const [filters, setFilters] = useState({
    startDate: initialStart,
    endDate:   initialEnd,
    position:  initialPosition,
  });

  const push = (next) => {
    const merged = { ...filters, ...next };
    setFilters(merged);
    const params = new URLSearchParams();
    if (merged.startDate) params.set('startDate', merged.startDate);
    if (merged.endDate)   params.set('endDate',   merged.endDate);
    if (merged.position)  params.set('position',  merged.position);
    router.push(`/recruiter/${encodeURIComponent(email)}?${params.toString()}`);
  };

  const { interviews, resumeSessions, weeklyActivity, name } = data;
  const bg = avatarBg(name || email);
  const statusOrder  = ['Completed', 'Scheduled', 'Cancelled'];
  const statusIcons  = { Completed:<IconCheck />, Scheduled:<IconCalendar />, Cancelled:<IconX /> };
  const statusColors = { Completed:'success', Scheduled:'info', Cancelled:'danger' };

  const activeFilters = [filters.startDate, filters.endDate, filters.position].filter(Boolean).length;

  return (
    <div>
      {/* ── Hero ─────────────────────────────────────── */}
      <div className="card-tight" style={{ marginBottom:14 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:16, padding:'20px 24px', background:'var(--surface)', borderRadius:'12px 12px 0 0' }}>
          <div style={{ display:'flex', alignItems:'center', gap:16 }}>
            <div style={{ width:52, height:52, borderRadius:14, background:bg, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, fontWeight:700, flexShrink:0 }}>
              {(name || email || '?').slice(0,2).toUpperCase()}
            </div>
            <div>
              <h1 style={{ fontSize:18, fontWeight:700, color:'var(--text)', letterSpacing:'-0.01em' }}>{name || email}</h1>
              <p style={{ fontSize:12, color:'var(--muted)', marginTop:3 }}>{email}</p>
              <div style={{ display:'flex', gap:6, marginTop:8, flexWrap:'wrap' }}>
                <span className="badge badge-white">{interviews.total} interviews</span>
                <span className="badge badge-white">{resumeSessions.totalSessions} resume sessions</span>
                {filters.position && <span className="badge badge-blue">{filters.position}</span>}
              </div>
            </div>
          </div>
        </div>

        {/* ── Filter bar ─────────────────────────────── */}
        <div style={{
          display:'flex', alignItems:'center', gap:12, flexWrap:'wrap',
          padding:'12px 24px',
          background:'var(--surface-2)', borderTop:'1px solid var(--border)',
          borderRadius:'0 0 12px 12px',
          position:'relative', zIndex:10, overflow:'visible',
        }}>
          {/* Position filter */}
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <span style={{ fontSize:11, fontWeight:600, color:'var(--muted)', whiteSpace:'nowrap' }}>Position</span>
            <PositionFilter
              positions={positions}
              current={filters.position}
              onChange={(pos) => push({ position: pos })}
            />
          </div>

          <div style={{ width:1, height:20, background:'var(--border)', flexShrink:0 }} />

          {/* Date filter */}
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <span style={{ fontSize:11, fontWeight:600, color:'var(--muted)', whiteSpace:'nowrap' }}>Date range</span>
            <DateRangePicker
              startDate={filters.startDate}
              endDate={filters.endDate}
              onChange={({ startDate, endDate }) => push({ startDate, endDate })}
            />
          </div>

          {activeFilters > 0 && (
            <button
              onClick={() => push({ startDate:'', endDate:'', position:'' })}
              style={{ marginLeft:'auto', fontSize:11, padding:'4px 10px', borderRadius:6, background:'var(--surface)', border:'1px solid var(--border)', color:'var(--muted)', cursor:'pointer' }}
            >
              Clear all filters
            </button>
          )}
        </div>
      </div>

      {/* ── Interviews ─────────────────────────────── */}
      <div className="card-tight" style={{ marginBottom:14, overflow:'hidden' }}>
        <SectionHeader icon={<IconCalendar />} title="Interviews" badge={interviews.total} />
        <div style={{ padding:20 }}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10, marginBottom:18 }}>
            {statusOrder.map((s) => (
              <StatCard key={s} label={s} value={interviews.statusBreakdown[s] ?? 0} color={statusColors[s]} icon={statusIcons[s]} />
            ))}
          </div>

          {interviews.list.length > 0 ? (
            <div style={{ border:'1px solid var(--border)', borderRadius:10, overflow:'hidden' }}>
              <div style={{ overflowX:'auto' }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Candidate</th>
                      <th>Position</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th style={{ textAlign:'right' }}>Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {interviews.list.slice(0,50).map((iv, i) => (
                      <tr key={i}>
                        <td style={{ fontWeight:500 }}>{iv.candidateName || iv.candidate || '—'}</td>
                        <td style={{ color:'var(--muted-2)' }}>{iv.applyFor || iv.position || iv.jobTitle || '—'}</td>
                        <td style={{ color:'var(--muted)', fontSize:12 }}>
                          {iv.startTime ? new Date(iv.startTime).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}) : '—'}
                        </td>
                        <td><StatusBadge status={iv.status} /></td>
                        <td style={{ textAlign:'right' }}>
                          {iv.status === 'Completed' && iv.score != null ? (
                            <div style={{ display:'flex', alignItems:'center', gap:8, justifyContent:'flex-end' }}>
                              <div style={{ width:60, height:5, borderRadius:3, background:'var(--surface-3)', overflow:'hidden' }}>
                                <div style={{
                                  height:'100%', borderRadius:3,
                                  width:`${iv.score}%`,
                                  background: iv.score >= 70 ? 'var(--success)' : iv.score >= 50 ? 'var(--warning)' : 'var(--danger)',
                                }} />
                              </div>
                              <span style={{ fontSize:12, fontWeight:600, color: iv.score >= 70 ? 'var(--success)' : iv.score >= 50 ? 'var(--warning)' : 'var(--danger)', minWidth:30 }}>
                                {iv.score}%
                              </span>
                            </div>
                          ) : iv.status === 'Completed' ? (
                            <span style={{ fontSize:11, color:'var(--muted)' }}>No score</span>
                          ) : (
                            <span style={{ color:'var(--muted)' }}>—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {interviews.list.length > 50 && (
                <div style={{ padding:'10px 16px', fontSize:11, color:'var(--muted)', textAlign:'center', borderTop:'1px solid var(--border)', background:'var(--surface-2)' }}>
                  Showing 50 of {interviews.list.length}
                </div>
              )}
            </div>
          ) : (
            <div style={{ textAlign:'center', padding:'40px 16px', color:'var(--muted)', fontSize:13 }}>
              No interviews found for the selected filters
            </div>
          )}
        </div>
      </div>

      {/* ── Resume Matching ────────────────────────── */}
      <div className="card-tight" style={{ marginBottom:14, overflow:'hidden' }}>
        <SectionHeader icon={<IconFile />} title="Resume Matching" badge={resumeSessions.totalSessions} />
        <div style={{ padding:20 }}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:10, marginBottom:18 }}>
            <StatCard label="Sessions"          value={resumeSessions.totalSessions}  color="info"    icon={<IconFile />} />
            <StatCard label="Resumes Uploaded"  value={resumeSessions.totalResumes}   color="warning" icon={<IconFile />} />
            <StatCard label="Passed Threshold"  value={resumeSessions.totalPassed}    color="success" icon={<IconCheck />} />
            <StatCard label="Pass Rate" value={`${resumeSessions.passRate}%`}
              color={resumeSessions.passRate >= 70 ? 'success' : 'warning'}
              sub={resumeSessions.passRate >= 70 ? 'Above 70% target' : 'Below 70% target'}
            />
          </div>

          {resumeSessions.list.length > 0 ? (
            <div style={{ border:'1px solid var(--border)', borderRadius:10, overflow:'hidden' }}>
              <div style={{ overflowX:'auto' }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Position</th>
                      <th>Date</th>
                      <th style={{ textAlign:'right' }}>Uploaded</th>
                      <th style={{ textAlign:'right' }}>Passed</th>
                      <th style={{ textAlign:'right' }}>Pass Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resumeSessions.list.slice(0,50).map((s, i) => {
                      const pr = s.total_resumes_uploaded ? Math.round((s.resumes_passed_threshold / s.total_resumes_uploaded) * 100) : 0;
                      return (
                        <tr key={i}>
                          <td style={{ fontWeight:500 }}>{s.jd_position || '—'}</td>
                          <td style={{ color:'var(--muted)', fontSize:12 }}>
                            {s.created_at ? new Date(s.created_at).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}) : '—'}
                          </td>
                          <td style={{ textAlign:'right' }}>{s.total_resumes_uploaded}</td>
                          <td style={{ textAlign:'right', color:'var(--success)' }}>{s.resumes_passed_threshold}</td>
                          <td style={{ textAlign:'right' }}>
                            <span className={`badge ${pr >= 70 ? 'badge-green' : 'badge-yellow'}`}>{pr}%</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div style={{ textAlign:'center', padding:'40px 16px', color:'var(--muted)', fontSize:13 }}>
              No resume sessions found for the selected filters
            </div>
          )}
        </div>
      </div>

      {/* ── Weekly chart ───────────────────────────── */}
      {weeklyActivity.length > 0 && (
        <div className="card">
          <p style={{ fontWeight:600, fontSize:13, color:'var(--text)', marginBottom:16 }}>
            Interview Activity by Week
            {filters.position && <span style={{ color:'var(--muted)', fontWeight:400, fontSize:11, marginLeft:8 }}>{filters.position}</span>}
          </p>
          <BarChartWrapper data={weeklyActivity} dataKey="count" xKey="week" height={200} />
        </div>
      )}
    </div>
  );
}
