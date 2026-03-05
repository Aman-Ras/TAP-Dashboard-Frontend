'use client';
import {
  BarChart, Bar, LineChart, Line, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, XAxis, YAxis, Tooltip, CartesianGrid, Legend,
  ResponsiveContainer, Cell,
} from 'recharts';

// Vivid chart-only palette — high contrast on black/grey backgrounds
export const COLORS = [
  '#6366f1', // indigo
  '#10b981', // emerald
  '#f59e0b', // amber
  '#ef4444', // red
  '#06b6d4', // cyan
  '#ec4899', // pink
  '#8b5cf6', // violet
];

const TOOLTIP_STYLE = {
  contentStyle: {
    background: '#1c1c1c',
    border: '1px solid #2a2a2a',
    borderRadius: 10,
    fontSize: 12,
    color: '#f0f0f0',
    boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
  },
  labelStyle: { color: '#888888', marginBottom: 4 },
  cursor: { fill: 'rgba(255,255,255,0.03)' },
};

const AXIS_TICK  = { fill: '#555555', fontSize: 11 };
const GRID_DASH  = '3 3';
const GRID_COLOR = '#222222';

export function BarChartWrapper({ data, dataKey, xKey, color, height = 260 }) {
  const barColor = color || COLORS[0];
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }} barCategoryGap="35%">
        <CartesianGrid strokeDasharray={GRID_DASH} stroke={GRID_COLOR} vertical={false} />
        <XAxis dataKey={xKey} tick={AXIS_TICK} axisLine={false} tickLine={false} />
        <YAxis tick={AXIS_TICK} axisLine={false} tickLine={false} />
        <Tooltip {...TOOLTIP_STYLE} />
        <Bar dataKey={dataKey} fill={barColor} radius={[5, 5, 0, 0]} maxBarSize={48}>
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function GroupedBarChart({ data, bars, xKey, height = 260 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }} barCategoryGap="30%">
        <CartesianGrid strokeDasharray={GRID_DASH} stroke={GRID_COLOR} vertical={false} />
        <XAxis dataKey={xKey} tick={AXIS_TICK} axisLine={false} tickLine={false} />
        <YAxis tick={AXIS_TICK} axisLine={false} tickLine={false} />
        <Tooltip {...TOOLTIP_STYLE} />
        <Legend
          wrapperStyle={{ fontSize: 12, color: '#888888', paddingTop: 12 }}
          iconType="circle"
          iconSize={8}
        />
        {bars.map((b, i) => (
          <Bar
            key={b.key}
            dataKey={b.key}
            name={b.label}
            fill={b.color || COLORS[i % COLORS.length]}
            radius={[4, 4, 0, 0]}
            maxBarSize={36}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}

export function LineChartWrapper({ data, dataKey, xKey, color, height = 260 }) {
  const lineColor = color || COLORS[0];
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray={GRID_DASH} stroke={GRID_COLOR} vertical={false} />
        <XAxis dataKey={xKey} tick={AXIS_TICK} axisLine={false} tickLine={false} />
        <YAxis tick={AXIS_TICK} axisLine={false} tickLine={false} />
        <Tooltip {...TOOLTIP_STYLE} />
        <Line
          type="monotone"
          dataKey={dataKey}
          stroke={lineColor}
          strokeWidth={2.5}
          dot={false}
          activeDot={{ r: 4, fill: lineColor, strokeWidth: 0 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function RadarChartWrapper({ data, height = 300 }) {
  const keys = data.length > 0 ? Object.keys(data[0]).filter((k) => k !== 'metric') : [];
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RadarChart data={data}>
        <PolarGrid stroke="#2a2a2a" />
        <PolarAngleAxis dataKey="metric" tick={{ fill: '#666666', fontSize: 11 }} />
        {keys.map((key, i) => (
          <Radar
            key={key}
            name={key}
            dataKey={key}
            stroke={COLORS[i % COLORS.length]}
            fill={COLORS[i % COLORS.length]}
            fillOpacity={0.18}
            strokeWidth={2}
          />
        ))}
        <Legend
          wrapperStyle={{ fontSize: 12, color: '#888888', paddingTop: 8 }}
          iconType="circle"
          iconSize={8}
        />
        <Tooltip {...TOOLTIP_STYLE} />
      </RadarChart>
    </ResponsiveContainer>
  );
}
