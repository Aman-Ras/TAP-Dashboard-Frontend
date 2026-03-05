'use client';
import { useState } from 'react';
import { GroupedBarChart, RadarChartWrapper, COLORS } from '../../components/ActivityChart';

export default function ComparisonClient({ data }) {
  const [selected, setSelected] = useState([]);

  const toggle = (email) => {
    setSelected((prev) =>
      prev.includes(email)
        ? prev.filter((e) => e !== email)
        : prev.length < 4
        ? [...prev, email]
        : prev
    );
  };

  const chosen = selected.length > 0
    ? data.filter((r) => selected.includes(r.email))
    : data.slice(0, 4);

  const barData = chosen.map((r) => ({
    name: (r.name || r.email).split(' ')[0],
    Interviews: r.totalInterviews,
    'Resume Sessions': r.totalSessions,
  }));

  const radarMetrics = ['Interviews', 'Sessions', 'Completion %', 'Pass Rate %', 'Activity Score'];
  const maxInterviews = Math.max(...data.map((r) => r.totalInterviews), 1);
  const maxSessions   = Math.max(...data.map((r) => r.totalSessions),   1);

  const radarData = radarMetrics.map((metric) => {
    const entry = { metric };
    for (const r of chosen) {
      const key = (r.name || r.email).split(' ')[0];
      if      (metric === 'Interviews')     entry[key] = Math.round((r.totalInterviews / maxInterviews) * 100);
      else if (metric === 'Sessions')       entry[key] = Math.round((r.totalSessions   / maxSessions)   * 100);
      else if (metric === 'Completion %')   entry[key] = r.completionRate;
      else if (metric === 'Pass Rate %')    entry[key] = r.passRate;
      else if (metric === 'Activity Score') entry[key] = r.activityScore;
    }
    return entry;
  });

  return (
    <div>
      <div style={{ marginBottom:28 }}>
        <h1 className="page-title">Comparison</h1>
        <p className="page-sub">Select up to 4 recruiters to compare side-by-side</p>
      </div>

      {/* Recruiter selector */}
      <div className="card" style={{ marginBottom:14 }}>
        <p className="section-title" style={{ marginBottom:12 }}>Select recruiters</p>
        <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
          {data.map((r, i) => {
            const isSelected = selected.includes(r.email);
            const selIdx     = selected.indexOf(r.email);
            const color      = isSelected ? COLORS[selIdx % COLORS.length] : null;
            return (
              <button
                key={r.email}
                onClick={() => toggle(r.email)}
                style={{
                  display:'flex', alignItems:'center', gap:6,
                  padding:'5px 12px', borderRadius:99, fontSize:12, fontWeight:500,
                  cursor:'pointer', border:'1px solid',
                  background: isSelected ? `${color}18` : 'var(--surface-2)',
                  borderColor: isSelected ? color       : 'var(--border)',
                  color:       isSelected ? color       : 'var(--muted-2)',
                  transition:'all 0.12s',
                }}
              >
                {isSelected && (
                  <span style={{ width:6, height:6, borderRadius:'50%', background:color, display:'inline-block', flexShrink:0 }} />
                )}
                {r.name}
              </button>
            );
          })}
        </div>
        {selected.length === 0 && (
          <p style={{ fontSize:11, color:'var(--muted)', marginTop:10 }}>
            No selection — showing top 4 by default
          </p>
        )}
      </div>

      {/* Charts */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:12 }}>
        <div className="card">
          <p style={{ fontWeight:600, fontSize:13, color:'var(--text)', marginBottom:20 }}>
            Interviews vs Resume Sessions
          </p>
          <GroupedBarChart
            data={barData}
            xKey="name"
            bars={[
              { key:'Interviews',      label:'Interviews',      color: COLORS[0] },
              { key:'Resume Sessions', label:'Resume Sessions', color: COLORS[1] },
            ]}
            height={220}
          />
        </div>
        <div className="card">
          <p style={{ fontWeight:600, fontSize:13, color:'var(--text)', marginBottom:20 }}>
            Activity Radar
            <span style={{ fontSize:11, color:'var(--muted)', fontWeight:400, marginLeft:6 }}>normalised 0–100</span>
          </p>
          <RadarChartWrapper data={radarData} height={220} />
        </div>
      </div>

      {/* Metrics table */}
      <div className="card-tight" style={{ overflow:'hidden' }}>
        <div style={{ padding:'14px 20px', borderBottom:'1px solid var(--border)', background:'var(--surface)' }}>
          <p style={{ fontWeight:600, fontSize:13, color:'var(--text)' }}>Metrics Comparison</p>
        </div>
        <div style={{ overflowX:'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Recruiter</th>
                <th style={{ textAlign:'right' }}>Interviews</th>
                <th style={{ textAlign:'right' }}>Completion</th>
                <th style={{ textAlign:'right' }}>Resume Sessions</th>
                <th style={{ textAlign:'right' }}>Pass Rate</th>
                <th style={{ textAlign:'right' }}>Avg / Session</th>
                <th style={{ textAlign:'right' }}>Activity Score</th>
                <th style={{ textAlign:'right' }}>Last Active</th>
              </tr>
            </thead>
            <tbody>
              {chosen.map((r, i) => (
                <tr key={r.email}>
                  <td>
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <span style={{ width:10, height:10, borderRadius:'50%', background:COLORS[i%COLORS.length], display:'inline-block', flexShrink:0 }} />
                      <div>
                        <div style={{ fontWeight:500, fontSize:13, color:'var(--text)' }}>{r.name}</div>
                        <div style={{ fontSize:11, color:'var(--muted)', marginTop:1 }}>{r.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ textAlign:'right', fontWeight:600 }}>{r.totalInterviews}</td>
                  <td style={{ textAlign:'right' }}>
                    <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:4 }}>
                      <span style={{ fontSize:12 }}>{r.completionRate}%</span>
                      <div className="progress-bar" style={{ width:52 }}>
                        <div className="progress-bar-fill" style={{ width:`${r.completionRate}%`, background:COLORS[i%COLORS.length] }} />
                      </div>
                    </div>
                  </td>
                  <td style={{ textAlign:'right' }}>{r.totalSessions}</td>
                  <td style={{ textAlign:'right' }}>
                    <span className={`badge ${r.passRate >= 70 ? 'badge-green' : r.passRate >= 40 ? 'badge-yellow' : 'badge-gray'}`}>
                      {r.passRate}%
                    </span>
                  </td>
                  <td style={{ textAlign:'right' }}>{r.avgResumesPerSession}</td>
                  <td style={{ textAlign:'right' }}>
                    <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:4 }}>
                      <span style={{ fontWeight:600, fontSize:13, color:COLORS[i%COLORS.length] }}>{r.activityScore}</span>
                      <div className="progress-bar" style={{ width:52 }}>
                        <div className="progress-bar-fill" style={{ width:`${r.activityScore}%`, background:COLORS[i%COLORS.length] }} />
                      </div>
                    </div>
                  </td>
                  <td style={{ textAlign:'right', fontSize:11, color:'var(--muted)' }}>
                    {r.lastActive ? new Date(r.lastActive).toLocaleDateString() : '—'}
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
