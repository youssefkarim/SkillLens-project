'use client';

import React, { useState } from 'react';
import { Download, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import { UploadedLesson } from './InstructorAnalysisScreen';
import ReportMetricCards from './ReportMetricCards';
import TopicCoverageTable from './TopicCoverageTable';
import PresentationRadarChart from './PresentationRadarChart';
import TopicScoreBarChart from './TopicScoreBarChart';
import ImprovementTips from './ImprovementTips';

interface AnalysisReportProps {
  lesson: UploadedLesson;
}

type ReportTab = 'overview' | 'topics' | 'skills' | 'coaching';

export default function AnalysisReport({ lesson }: AnalysisReportProps) {
  const [activeTab, setActiveTab] = useState<ReportTab>('overview');

  const tabs: { id: ReportTab; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'topics', label: 'Topic Coverage' },
    { id: 'skills', label: 'Presentation Skills' },
    { id: 'coaching', label: 'Coaching Tips' },
  ];

  return (
    <div className="space-y-6 fade-in">
      {/* Report header */}
      <div className="card p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="badge-positive">Complete</span>
              <span className="text-xs text-muted-foreground">13 Sep 2026 · 3m 42s processing</span>
            </div>
            <h2 className="text-lg font-semibold text-foreground">{lesson.videoName.replace(/\.[^/.]+$/, '')}</h2>
            <p className="text-sm text-muted-foreground">Module 4: Machine Learning Fundamentals · 44 min 17s</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => toast.success('Report link copied to clipboard')}
              className="btn-ghost gap-2 text-xs"
            >
              <Share2 size={14} />
              Share
            </button>
            <button
              onClick={() => toast.success('Downloading report PDF…')}
              className="btn-secondary gap-2 text-xs"
            >
              <Download size={14} />
              Export PDF
            </button>
          </div>
        </div>
      </div>

      {/* Metric cards */}
      <ReportMetricCards />

      {/* Tabs */}
      <div className="flex gap-0.5 p-0.5 rounded-md bg-muted border border-border w-fit">
        {tabs.map((tab) => (
          <button
            key={`tab-${tab.id}`}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3.5 py-1.5 rounded text-[13px] font-medium transition-colors duration-150 ${
              activeTab === tab.id
                ? 'bg-card text-foreground shadow-card border border-border'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="card p-6">
            <h3 className="text-sm font-semibold text-foreground mb-5">Skill Dimensions — Radar</h3>
            <PresentationRadarChart />
          </div>
          <div className="card p-6">
            <h3 className="text-sm font-semibold text-foreground mb-5">Topic Coverage Scores</h3>
            <TopicScoreBarChart />
          </div>
        </div>
      )}

      {activeTab === 'topics' && <TopicCoverageTable />}

      {activeTab === 'skills' && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="card p-6">
            <h3 className="text-sm font-semibold text-foreground mb-1">Presentation Skills Radar</h3>
            <p className="text-xs text-muted-foreground mb-5">Scores out of 10 across all evaluated dimensions</p>
            <PresentationRadarChart />
          </div>
          <div className="card p-6 space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Skill Breakdown</h3>
            {[
              { label: 'Clarity of Explanation', score: 7.8, max: 10, note: 'Good use of analogies; some concepts rushed' },
              { label: 'Pacing & Rhythm', score: 6.2, max: 10, note: 'Slightly fast in the gradient descent section' },
              { label: 'Vocal Engagement', score: 8.1, max: 10, note: 'Strong variation; avoids monotone delivery' },
              { label: 'Structure & Flow', score: 7.4, max: 10, note: 'Clear intro; transitions between topics could be smoother' },
              { label: 'Use of Examples', score: 8.6, max: 10, note: 'Excellent real-world examples throughout' },
              { label: 'Student Interaction', score: 5.5, max: 10, note: 'Few prompts for audience engagement; add more questions' },
            ].map((skill) => (
              <div key={`skill-${skill.label}`}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium text-foreground">{skill.label}</span>
                  <span className="font-mono-data text-xs font-bold text-foreground">{skill.score}/10</span>
                </div>
                <div className="w-full h-2 rounded-full bg-muted overflow-hidden mb-1">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      skill.score >= 8 ? 'bg-positive' : skill.score >= 6.5 ? 'bg-primary' : 'bg-warning'
                    }`}
                    style={{ width: `${(skill.score / skill.max) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">{skill.note}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'coaching' && <ImprovementTips />}
    </div>
  );
}
