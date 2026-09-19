'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

const data = [
  { topic: 'Sup/Unsup', score: 9.1 },
  { topic: 'Bias-Var', score: 8.4 },
  { topic: 'Grad Desc', score: 6.7 },
  { topic: 'Lin Reg', score: 8.9 },
  { topic: 'Eval Metrics', score: 6.2 },
  { topic: 'Regulariz.', score: 5.1 },
  { topic: 'Cross-Val', score: 0 },
  { topic: 'Ensembles', score: 0 },
];

const getColor = (score: number) => {
  if (score === 0) return 'var(--negative)';
  if (score < 6.5) return 'var(--warning)';
  if (score < 8) return 'var(--primary)';
  return 'var(--positive)';
};

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-lg px-3 py-2 shadow-elevated text-xs">
      <p className="font-semibold text-foreground mb-1">{label}</p>
      <p className="text-muted-foreground">
        Score:{' '}
        <span className="font-mono-data font-bold text-primary">
          {payload[0].value === 0 ? 'Not covered' : `${payload[0].value}/10`}
        </span>
      </p>
    </div>
  );
};

export default function TopicScoreBarChart() {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 30 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis
          dataKey="topic"
          tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }}
          angle={-30}
          textAnchor="end"
          interval={0}
        />
        <YAxis
          domain={[0, 10]}
          tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }}
          tickCount={6}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="score" radius={[4, 4, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={`bar-cell-${index}`} fill={getColor(entry.score)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
