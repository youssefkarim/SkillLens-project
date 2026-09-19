'use client';

import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const metrics = [
  {
    id: 'metric-coverage',
    label: 'Content coverage',
    value: '73%',
    subtext: '6 of 8 topics addressed',
    trend: 'up',
    trendLabel: '+8 pts vs prior',
    tone: 'warning' as const,
  },
  {
    id: 'metric-presentation',
    label: 'Presentation',
    value: '7.4',
    subtext: 'out of 10',
    trend: 'up',
    trendLabel: '+0.6 vs prior',
    tone: 'neutral' as const,
  },
  {
    id: 'metric-clarity',
    label: 'Clarity',
    value: '7.8',
    subtext: 'Explanation quality',
    trend: 'neutral',
    trendLabel: 'Unchanged',
    tone: 'neutral' as const,
  },
  {
    id: 'metric-pacing',
    label: 'Pacing',
    value: '6.2',
    subtext: 'Rate and rhythm',
    trend: 'down',
    trendLabel: '−0.4 vs prior',
    tone: 'alert' as const,
  },
  {
    id: 'metric-engagement',
    label: 'Engagement',
    value: '8.1',
    subtext: 'Vocal variety',
    trend: 'up',
    trendLabel: '+1.2 vs prior',
    tone: 'good' as const,
  },
];

export default function ReportMetricCards() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
      {metrics.map((m, idx) => (
        <div 
          key={m.id} 
          className="card p-4 relative overflow-hidden transition-all duration-300 hover-lift hover:border-primary/40 group cursor-pointer"
          style={{ animationDelay: `${idx * 80}ms` }}
        >
          <span
            className={`absolute left-0 top-0 bottom-0 w-[3px] transition-all duration-300 group-hover:w-[5px] ${
              m.tone === 'alert' ? 'bg-negative' :
              m.tone === 'warning' ? 'bg-warning' :
              m.tone === 'good' ? 'bg-positive' : 'bg-primary'
            }`}
          />
          <p className="section-label mb-3 group-hover:text-primary transition-colors">{m.label}</p>
          <p className="font-mono-data text-[1.75rem] font-bold tracking-tight text-foreground mb-0.5 transition-transform duration-300 group-hover:scale-105 origin-left">
            {m.value}
          </p>
          <p className="text-xs text-muted-foreground mb-3">{m.subtext}</p>
          <div className="flex items-center gap-1">
            {m.trend === 'up' && <TrendingUp size={12} className="text-positive transition-transform duration-300 group-hover:-translate-y-0.5" />}
            {m.trend === 'down' && <TrendingDown size={12} className="text-negative transition-transform duration-300 group-hover:translate-y-0.5" />}
            {m.trend === 'neutral' && <Minus size={12} className="text-muted-foreground" />}
            <span className={`text-[11px] font-semibold ${
              m.trend === 'up' ? 'text-positive' :
              m.trend === 'down' ? 'text-negative' : 'text-muted-foreground'
            }`}>
              {m.trendLabel}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
