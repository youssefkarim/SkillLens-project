'use client';

import React from 'react';
import { Loader2, Brain, AudioLines, FileSearch, BarChart2, Lightbulb } from 'lucide-react';

interface AnalysisProgressProps {
  progress: number;
  label: string;
}

const steps = [
  { icon: AudioLines, label: 'Uploading & transcribing', threshold: 0 },
  { icon: FileSearch, label: 'Parsing syllabus', threshold: 55 },
  { icon: Brain, label: 'Analyzing content coverage', threshold: 68 },
  { icon: BarChart2, label: 'Scoring presentation', threshold: 80 },
  { icon: Lightbulb, label: 'Generating recommendations', threshold: 90 },
];

export default function AnalysisProgress({ progress, label }: AnalysisProgressProps) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="card p-10 text-center">
        {/* Animated logo */}
        <div className="relative w-20 h-20 mx-auto mb-8">
          <div className="w-20 h-20 rounded-full border-4 border-muted" />
          <svg className="absolute inset-0 w-20 h-20 -rotate-90" viewBox="0 0 80 80">
            <circle
              cx="40" cy="40" r="36"
              fill="none"
              stroke="var(--primary)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 36}`}
              strokeDashoffset={`${2 * Math.PI * 36 * (1 - progress / 100)}`}
              style={{ transition: 'stroke-dashoffset 0.3s ease' }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-mono-data text-lg font-bold text-primary">{progress}%</span>
          </div>
        </div>

        <h2 className="text-lg font-semibold text-foreground mb-2">Analyzing recording</h2>
        <p className="text-sm text-muted-foreground mb-8 min-h-[20px]">{label}</p>

        {/* Step indicators */}
        <div className="space-y-3 text-left max-w-sm mx-auto">
          {steps.map((step, i) => {
            const isDone = progress > step.threshold + 10;
            const isActive = progress >= step.threshold && !isDone;
            return (
              <div key={`step-${i}`} className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                  isDone ? 'bg-positive/10' : isActive ? 'bg-primary/10' : 'bg-muted'
                }`}>
                  {isDone ? (
                    <svg width="14" height="11" viewBox="0 0 14 11" fill="none">
                      <path d="M1 5.5L5 9.5L13 1.5" stroke="var(--positive)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : isActive ? (
                    <Loader2 size={14} className="text-primary animate-spin" />
                  ) : (
                    <step.icon size={14} className="text-muted-foreground" />
                  )}
                </div>
                <span className={`text-sm transition-colors duration-300 ${
                  isDone ? 'text-positive font-medium' : isActive ? 'text-foreground font-semibold' : 'text-muted-foreground'
                }`}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>

        <p className="mt-8 text-xs text-muted-foreground">
          Typical processing time is 2–4 minutes. You may leave this page; a notification will appear when the report is ready.
        </p>
      </div>
    </div>
  );
}
