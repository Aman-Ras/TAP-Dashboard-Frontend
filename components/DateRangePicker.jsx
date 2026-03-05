'use client';

export default function DateRangePicker({ startDate, endDate, onChange }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
      <input
        type="date"
        value={startDate}
        onChange={(e) => onChange({ startDate: e.target.value, endDate })}
        className="date-input"
      />
      <span style={{ fontSize:11, color:'var(--muted)' }}>→</span>
      <input
        type="date"
        value={endDate}
        onChange={(e) => onChange({ startDate, endDate: e.target.value })}
        className="date-input"
      />
      {(startDate || endDate) && (
        <button
          onClick={() => onChange({ startDate: '', endDate: '' })}
          className="clear-btn"
        >
          Clear
        </button>
      )}
    </div>
  );
}
