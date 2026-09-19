'use client';

import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface BodyLanguageMonitorProps {
  elapsedSeconds: number;
}

interface MetricState {
  label: string;
  key: string;
  value: number;
  prev: number;
  description: string;
}

const initialMetrics: MetricState[] = [
  { label: 'Posture', key: 'posture', value: 78, prev: 78, description: 'Upright and engaged' },
  { label: 'Eye Contact', key: 'eye', value: 65, prev: 65, description: 'Moderate — occasional breaks' },
  { label: 'Confidence', key: 'confidence', value: 72, prev: 72, description: 'Good baseline presence' },
  { label: 'Engagement', key: 'engagement', value: 81, prev: 81, description: 'Active listener signals' },
];

const fluctuations: Record<string, number[]> = {
  posture:    [78, 76, 74, 77, 79, 75, 72, 74, 76, 78, 80, 77, 75, 73, 76],
  eye:        [65, 68, 70, 66, 62, 67, 71, 69, 64, 61, 65, 68, 70, 67, 63],
  confidence: [72, 74, 76, 73, 70, 68, 71, 74, 76, 78, 75, 72, 69, 71, 74],
  engagement: [81, 83, 80, 78, 82, 84, 81, 79, 77, 80, 82, 85, 83, 80, 78],
};

export default function BodyLanguageMonitor({ elapsedSeconds }: BodyLanguageMonitorProps) {
  const [metrics, setMetrics] = useState<MetricState[]>(initialMetrics);

  useEffect(() => {
    const tick = Math.floor(elapsedSeconds / 4) % 15;
    setMetrics((prev) =>
      prev.map((m) => {
        const newVal = fluctuations[m.key]?.[tick] ?? m.value;
        return { ...m, prev: m.value, value: newVal };
      })
    );
  }, [elapsedSeconds]);

  const getScoreColor = (v: number) => {
    if (v >= 75) return 'text-positive';
    if (v >= 60) return 'text-warning';
    return 'text-negative';
  };

  const getBarColor = (v: number) => {
    if (v >= 75) return 'bg-positive';
    if (v >= 60) return 'bg-warning';
    return 'bg-negative';
  };

  const getTrend = (current: number, prev: number) => {
    if (current > prev + 1) return 'up';
    if (current < prev - 1) return 'down';
    return 'neutral';
  };

  const overallScore = Math.round(metrics.reduce((sum, m) => sum + m.value, 0) / metrics.length);

  const getSignalLabel = (v: number) => {
    if (v >= 80) return { text: 'Strong', cls: 'badge-positive' };
    if (v >= 65) return { text: 'Moderate', cls: 'badge-warning' };
    return { text: 'Weak', cls: 'badge-negative' };
  };

  return (
    <div className="space-y-4">
      {/* Overall score */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="section-label mb-1">Body Language Index</p>
            <p className="text-xs text-muted-foreground">Real-time composite score</p>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-positive live-dot" />
            <span className="text-xs font-medium text-positive">Monitoring</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Ring */}
          <div className="relative w-20 h-20 flex-shrink-0">
            <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="32" fill="none" stroke="var(--muted)" strokeWidth="6" />
              <circle
                cx="40" cy="40" r="32"
                fill="none"
                stroke={overallScore >= 75 ? 'var(--positive)' : overallScore >= 60 ? 'var(--warning)' : 'var(--negative)'}
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 32}`}
                strokeDashoffset={`${2 * Math.PI * 32 * (1 - overallScore / 100)}`}
                style={{ transition: 'stroke-dashoffset 0.6s ease' }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`font-mono-data text-xl font-bold ${getScoreColor(overallScore)}`}>{overallScore}</span>
            </div>
          </div>

          <div className="flex-1">
            <p className="text-2xl font-bold text-foreground mb-0.5">{overallScore}/100</p>
            <p className="text-xs text-muted-foreground mb-2">Overall body language score</p>
            {(() => {
              const s = getSignalLabel(overallScore);
              return <span className={s.cls}>{s.text} Presence</span>;
            })()}
          </div>
        </div>
      </div>

      {/* Individual metrics */}
      <div className="card p-5 space-y-4">
        <p className="section-label">Live Indicators</p>
        {metrics.map((m) => {
          const trend = getTrend(m.value, m.prev);
          return (
            <div key={`bl-${m.key}`} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground">{m.label}</span>
                  {trend === 'up' && <TrendingUp size={12} className="text-positive" />}
                  {trend === 'down' && <TrendingDown size={12} className="text-negative" />}
                  {trend === 'neutral' && <Minus size={12} className="text-muted-foreground" />}
                </div>
                <span className={`font-mono-data text-sm font-bold ${getScoreColor(m.value)}`}>
                  {m.value}
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className={`h-full rounded-full ${getBarColor(m.value)} transition-all duration-700`}
                  style={{ width: `${m.value}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">{m.description}</p>
            </div>
          );
        })}
      </div>

      {/* Live alerts */}
      <div className="card p-4 space-y-2">
        <p className="section-label mb-2">AI Observations</p>
        {[
          { time: formatElapsed(elapsedSeconds > 30 ? elapsedSeconds - 28 : 0), text: 'Candidate shows strong engagement during technical questions', type: 'positive' },
          { time: formatElapsed(elapsedSeconds > 60 ? elapsedSeconds - 55 : 0), text: 'Slight drop in eye contact — consider re-engaging with a direct question', type: 'warning' },
          { time: formatElapsed(elapsedSeconds > 90 ? elapsedSeconds - 80 : 0), text: 'Confident posture maintained throughout opening statements', type: 'positive' },
        ].filter((_, i) => elapsedSeconds > i * 30).map((obs, i) => (
          <div key={`obs-${i}`} className={`flex items-start gap-2.5 p-2.5 rounded-lg ${
            obs.type === 'positive' ? 'bg-[var(--positive-bg)]' : 'bg-[var(--warning-bg)]'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${
              obs.type === 'positive' ? 'bg-positive' : 'bg-warning'
            }`} />
            <div>
              <p className="text-xs text-muted-foreground font-mono-data mb-0.5">{obs.time}</p>
              <p className="text-xs text-foreground leading-relaxed">{obs.text}</p>
            </div>
          </div>
        ))}
        {elapsedSeconds < 30 && (
          <div className="flex items-center gap-2 py-3 text-xs text-muted-foreground">
            <span className="w-2 h-2 rounded-full bg-primary live-dot" />
            <span>Collecting baseline data…</span>
          </div>
        )}
      </div>
    </div>
  );
}

function formatElapsed(s: number): string {
  if (s <= 0) return '00:00';
  const m = Math.floor(s / 60).toString().padStart(2, '0');
  const sec = (s % 60).toString().padStart(2, '0');
  return `${m}:${sec}`;
}
