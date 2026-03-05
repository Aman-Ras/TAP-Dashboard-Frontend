// Value-color only — the card shell is always grey/black
const VALUE_COLOR = {
  accent:  '#f0f0f0',
  success: '#4ade80',
  warning: '#fbbf24',
  danger:  '#f87171',
  info:    '#60a5fa',
  cyan:    '#22d3ee',
};

export default function StatCard({ label, value, sub, color = 'accent', icon }) {
  const vc = VALUE_COLOR[color] || VALUE_COLOR.accent;

  return (
    <div
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 14,
        padding: '18px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Left accent strip */}
      <div style={{
        position: 'absolute',
        left: 0, top: '20%', bottom: '20%',
        width: 2,
        background: vc,
        borderRadius: '0 2px 2px 0',
        opacity: 0.7,
      }} />

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <p style={{
          fontSize: 10.5,
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'var(--muted)',
        }}>
          {label}
        </p>
        {icon && (
          <span style={{ color: 'var(--muted)', opacity: 0.6 }}>{icon}</span>
        )}
      </div>

      <div>
        <p style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em', color: vc }}>
          {value ?? '—'}
        </p>
        {sub && (
          <p style={{ fontSize: 11.5, color: 'var(--muted-2)', marginTop: 4 }}>{sub}</p>
        )}
      </div>
    </div>
  );
}
