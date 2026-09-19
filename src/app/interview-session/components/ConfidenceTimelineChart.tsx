'use client';

import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

const data = [
  { minute: '0:00', confidence: 64, bodyLanguage: 60 },
  { minute: '3:00', confidence: 70, bodyLanguage: 65 },
  { minute: '6:00', confidence: 74, bodyLanguage: 70 },
  { minute: '9:00', confidence: 72, bodyLanguage: 68 },
  { minute: '12:00', confidence: 78, bodyLanguage: 74 },
  { minute: '15:00', confidence: 76, bodyLanguage: 72 },
  { minute: '18:00', confidence: 80, bodyLanguage: 77 },
  { minute: '21:00', confidence: 82, bodyLanguage: 79 },
  { minute: '24:00', confidence: 79, bodyLanguage: 76 },
  { minute: '27:00', confidence: 75, bodyLanguage: 71 },
  { minute: '30:00', confidence: 77, bodyLanguage: 73 },
  { minute: '33:00', confidence: 81, bodyLanguage: 78 },
  { minute: '36:00', confidence: 83, bodyLanguage: 80 },
  { minute: '39:00', confidence: 85, bodyLanguage: 82 },
  { minute: '42:00', confidence: 82, bodyLanguage: 79 },
  { minute: '44:32', confidence: 80, bodyLanguage: 77 },
];

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-lg px-3 py-2.5 shadow-elevated text-xs">
      <p className="font-mono-data font-semibold text-foreground mb-2">{label}</p>
      {payload.map((p, i) => (
        <div key={`tooltip-line-${i}`} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: p.color }} />
          <span className="text-muted-foreground">{p.name}:</span>
          <span className="font-mono-data font-bold text-foreground">{p.value}</span>
        </div>
      ))}
    </div>
  );
};

export default function ConfidenceTimelineChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
        <defs>
          <linearGradient id="confGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.2} />
            <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="blGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.15} />
            <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis
          dataKey="minute"
          tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }}
          interval={2}
        />
        <YAxis
          domain={[50, 100]}
          tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }}
          tickCount={6}
        />
        <Tooltip content={<CustomTooltip />} />
        <ReferenceLine y={75} stroke="var(--positive)" strokeDasharray="4 4" strokeOpacity={0.5} label={{ value: 'Good', fill: 'var(--positive)', fontSize: 10, position: 'right' }} />
        <Area
          type="monotone"
          dataKey="confidence"
          name="Confidence"
          stroke="var(--primary)"
          strokeWidth={2}
          fill="url(#confGrad)"
        />
        <Area
          type="monotone"
          dataKey="bodyLanguage"
          name="Body Language"
          stroke="var(--accent)"
          strokeWidth={2}
          fill="url(#blGrad)"
          strokeDasharray="4 2"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
