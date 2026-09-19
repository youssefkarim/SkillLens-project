'use client';

import React from 'react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

const data = [
  { subject: 'Clarity', score: 7.8, fullMark: 10 },
  { subject: 'Pacing', score: 6.2, fullMark: 10 },
  { subject: 'Engagement', score: 8.1, fullMark: 10 },
  { subject: 'Structure', score: 7.4, fullMark: 10 },
  { subject: 'Examples', score: 8.6, fullMark: 10 },
  { subject: 'Interaction', score: 5.5, fullMark: 10 },
];

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: { subject: string; score: number } }> }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-card border border-border rounded-lg px-3 py-2 shadow-elevated text-xs">
      <p className="font-semibold text-foreground">{d.subject}</p>
      <p className="text-muted-foreground">Score: <span className="font-mono-data font-bold text-primary">{d.score}/10</span></p>
    </div>
  );
};

export default function PresentationRadarChart() {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <RadarChart data={data} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
        <PolarGrid stroke="var(--border)" />
        <PolarAngleAxis
          dataKey="subject"
          tick={{ fill: 'var(--muted-foreground)', fontSize: 11, fontWeight: 500 }}
        />
        <Radar
          name="Skills"
          dataKey="score"
          stroke="var(--primary)"
          fill="var(--primary)"
          fillOpacity={0.15}
          strokeWidth={2}
        />
        <Tooltip content={<CustomTooltip />} />
      </RadarChart>
    </ResponsiveContainer>
  );
}
