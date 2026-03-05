'use client';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import PositionFilter from './PositionFilter';

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}
function today() { return new Date().toISOString().slice(0, 10); }

const PRESETS = [
  { label: 'Today',     getStart: () => today(),     getEnd: () => today()     },
  { label: 'Yesterday', getStart: () => daysAgo(1),  getEnd: () => daysAgo(1)  },
  { label: '7d',        getStart: () => daysAgo(7),  getEnd: () => today()     },
  { label: '30d',       getStart: () => daysAgo(30), getEnd: () => today()     },
  { label: '3m',        getStart: () => daysAgo(90), getEnd: () => today()     },
  { label: '6m',        getStart: () => daysAgo(180),getEnd: () => today()     },
];

export default function OverviewFilterBar({ positions, currentPosition, currentStart, currentEnd }) {
  const router      = useRouter();
  const pathname    = usePathname();
  const searchParams = useSearchParams();

  const push = (updates) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([k, v]) => {
      if (v) params.set(k, v);
      else   params.delete(k);
    });
    router.push(`${pathname}?${params.toString()}`);
  };

  const activePreset = PRESETS.find(
    (p) => currentStart === p.getStart() && currentEnd === p.getEnd()
  )?.label ?? null;

  const hasFilters = currentPosition || currentStart || currentEnd;

  const clearAll = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('position');
    params.delete('startDate');
    params.delete('endDate');
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap',
      padding: '11px 16px',
      background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12,
      marginBottom: 20,
    }}>

      {/* Position filter */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', letterSpacing: '0.06em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
          Position
        </span>
        <PositionFilter
          positions={positions}
          current={currentPosition}
          onChange={(pos) => push({ position: pos })}
        />
      </div>

      {/* Divider */}
      <div style={{ width: 1, height: 22, background: 'var(--border)', flexShrink: 0 }} />

      {/* Quick presets */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', letterSpacing: '0.06em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
          Period
        </span>
        <div style={{ display: 'flex', gap: 4 }}>
          {PRESETS.map((p) => {
            const isActive = activePreset === p.label;
            return (
              <button
                key={p.label}
                onClick={() => push({ startDate: p.getStart(), endDate: p.getEnd() })}
                style={{
                  padding: '4px 10px', borderRadius: 6, fontSize: 12, fontWeight: 500,
                  cursor: 'pointer', border: '1px solid',
                  background: isActive ? 'rgba(99,102,241,0.12)' : 'var(--surface-2)',
                  borderColor: isActive ? '#6366f1' : 'var(--border)',
                  color: isActive ? '#818cf8' : 'var(--muted-2)',
                  transition: 'all 0.12s',
                }}
              >
                {p.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Divider */}
      <div style={{ width: 1, height: 22, background: 'var(--border)', flexShrink: 0 }} />

      {/* Custom date range */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', letterSpacing: '0.06em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
          Custom
        </span>
        <input
          type="date"
          value={currentStart}
          onChange={(e) => push({ startDate: e.target.value })}
          className="date-input"
        />
        <span style={{ fontSize: 11, color: 'var(--muted)' }}>→</span>
        <input
          type="date"
          value={currentEnd}
          onChange={(e) => push({ endDate: e.target.value })}
          className="date-input"
        />
      </div>

      {/* Active filter badges + clear */}
      {hasFilters && (
        <>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
            {currentPosition && (
              <span className="badge badge-blue" style={{ fontSize: 11 }}>{currentPosition}</span>
            )}
            {(currentStart || currentEnd) && (
              <span className="badge badge-yellow" style={{ fontSize: 11 }}>
                {currentStart || '…'} → {currentEnd || '…'}
              </span>
            )}
          </div>
          <button
            onClick={clearAll}
            className="clear-btn"
            style={{ marginLeft: 'auto' }}
          >
            Clear all
          </button>
        </>
      )}
    </div>
  );
}
