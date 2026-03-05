const VALUE_COLOR = {
  accent:  'var(--text)',
  success: 'var(--success)',
  warning: 'var(--warning)',
  danger:  'var(--danger)',
  info:    'var(--info)',
  cyan:    'var(--chart-5)',
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
