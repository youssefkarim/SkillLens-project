'use client';

import React, { useState } from 'react';
import UploadPanel from './UploadPanel';
import AnalysisProgress from './AnalysisProgress';
import AnalysisReport from './AnalysisReport';
import PageHeader from '@/components/PageHeader';

export type AnalysisState = 'idle' | 'uploading' | 'analyzing' | 'complete';

export interface UploadedLesson {
  videoName: string;
  syllabusText: string;
}

export default function InstructorAnalysisScreen() {
  const [analysisState, setAnalysisState] = useState<AnalysisState>('idle');
  const [uploadedLesson, setUploadedLesson] = useState<UploadedLesson | null>(null);
  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState('');

  const handleStartAnalysis = async (lesson: UploadedLesson) => {
    setUploadedLesson(lesson);
    setAnalysisState('uploading');

    const steps = [
      { label: 'Uploading recording…', target: 35, duration: 1200 },
      { label: 'Extracting transcript…', target: 55, duration: 900 },
      { label: 'Parsing syllabus topics…', target: 68, duration: 700 },
      { label: 'Measuring content coverage…', target: 80, duration: 1000 },
      { label: 'Scoring delivery…', target: 90, duration: 800 },
      { label: 'Compiling recommendations…', target: 98, duration: 900 },
      { label: 'Report ready', target: 100, duration: 400 },
    ];

    setAnalysisState('analyzing');

    for (const step of steps) {
      setProgressLabel(step.label);
      const start = progress;
      const end = step.target;
      const stepDuration = step.duration;
      const startTime = Date.now();

      await new Promise<void>((resolve) => {
        const tick = () => {
          const elapsed = Date.now() - startTime;
          const pct = Math.min(elapsed / stepDuration, 1);
          setProgress(Math.round(start + (end - start) * pct));
          if (pct < 1) requestAnimationFrame(tick);
          else resolve();
        };
        requestAnimationFrame(tick);
      });
    }

    setTimeout(() => setAnalysisState('complete'), 300);
  };

  const handleReset = () => {
    setAnalysisState('idle');
    setUploadedLesson(null);
    setProgress(0);
    setProgressLabel('');
  };

  return (
    <div className="px-6 lg:px-8 xl:px-10 py-8 max-w-[1280px] mx-auto">
      <PageHeader
        eyebrow="Instruction"
        title="Video analysis"
        description="Upload a teaching recording and syllabus to generate a coverage and delivery report."
        actions={
          analysisState === 'complete' ? (
            <button onClick={handleReset} className="btn-secondary">
              Analyze another lesson
            </button>
          ) : undefined
        }
      />

      {analysisState === 'idle' && (
        <UploadPanel onAnalyze={handleStartAnalysis} />
      )}

      {(analysisState === 'uploading' || analysisState === 'analyzing') && (
        <AnalysisProgress progress={progress} label={progressLabel} />
      )}

      {analysisState === 'complete' && uploadedLesson && (
        <AnalysisReport lesson={uploadedLesson} />
      )}
    </div>
  );
}
