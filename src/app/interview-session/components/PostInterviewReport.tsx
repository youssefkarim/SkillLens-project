'use client';

import React, { useState } from 'react';
import { Download, Share2, ThumbsUp, ThumbsDown, Minus, Star } from 'lucide-react';
import { toast } from 'sonner';
import { CandidateProfile } from './InterviewSessionScreen';
import ConfidenceTimelineChart from './ConfidenceTimelineChart';
import ResponseQualityTable from './ResponseQualityTable';

interface PostInterviewReportProps {
  candidate: CandidateProfile;
}

type ReportTab = 'summary' | 'timeline' | 'responses' | 'recommendation';

const scoreData = [
  { id: 'score-comm', label: 'Communication', score: 8.2, max: 10, note: 'Articulate and structured responses throughout', color: 'positive' },
  { id: 'score-body', label: 'Body Language', score: 7.4, max: 10, note: 'Good posture; some eye contact inconsistency', color: 'positive' },
  { id: 'score-tech', label: 'Technical Depth', score: 8.7, max: 10, note: 'Strong domain knowledge with concrete examples', color: 'positive' },
  { id: 'score-culture', label: 'Culture Fit', score: 6.9, max: 10, note: 'Collaborative signals present; values alignment unclear', color: 'warning' },
];

const QUESTION_BANK_STATIC = [
  { id: 'qs-001', asked: true },
  { id: 'qs-002', asked: true },
  { id: 'qs-003', asked: true },
  { id: 'qs-004', asked: true },
  { id: 'qs-005', asked: true },
  { id: 'qs-006', asked: false },
  { id: 'qs-007', asked: false },
  { id: 'qs-008', asked: false },
];

export default function PostInterviewReport({ candidate }: PostInterviewReportProps) {
  const [activeTab, setActiveTab] = useState<ReportTab>('summary');

  const overallScore = parseFloat(
    (scoreData.reduce((s, d) => s + d.score, 0) / scoreData.length).toFixed(1)
  );

  const recommendation: 'hire' | 'consider' | 'pass' =
    overallScore >= 8 ? 'hire' : overallScore >= 7 ? 'consider' : 'pass';

  const recConfig = {
    hire: {
      label: 'Recommend Hire',
      icon: ThumbsUp,
      cls: 'bg-[var(--positive-bg)] border-positive/20 text-positive',
      badge: 'badge-positive',
      desc: 'Strong candidate across all evaluated dimensions. Recommend proceeding to offer stage.',
    },
    consider: {
      label: 'Consider with Follow-up',
      icon: Minus,
      cls: 'bg-[var(--warning-bg)] border-warning/20 text-warning',
      badge: 'badge-warning',
      desc: 'Solid candidate with some areas needing clarification. Recommend a second interview focused on culture fit.',
    },
    pass: {
      label: 'Do Not Proceed',
      icon: ThumbsDown,
      cls: 'bg-[var(--negative-bg)] border-negative/20 text-negative',
      badge: 'badge-negative',
      desc: 'Candidate did not meet the minimum bar for this role. Consider for a junior position or revisit in 6 months.',
    },
  };

  const rec = recConfig[recommendation];

  const tabs: { id: ReportTab; label: string }[] = [
    { id: 'summary', label: 'Summary' },
    { id: 'timeline', label: 'Confidence Timeline' },
    { id: 'responses', label: 'Response Quality' },
    { id: 'recommendation', label: 'Hiring Decision' },
  ];

  return (
    <div className="space-y-6 fade-in">
      {/* Report header */}
      <div className="card p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg flex-shrink-0">
              {candidate.initials}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-lg font-bold text-foreground">{candidate.name}</h2>
                <span className={rec.badge}>{rec.label}</span>
              </div>
              <p className="text-sm text-muted-foreground">{candidate.role} · Interview completed 2026-09-13 · 44m 32s</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button onClick={() => toast.success('Report link copied')} className="btn-ghost text-xs gap-1.5">
              <Share2 size={13} />
              Share
            </button>
            <button onClick={() => toast.success('Downloading report PDF…')} className="btn-secondary text-xs gap-1.5">
              <Download size={13} />
              Export PDF
            </button>
          </div>
        </div>
      </div>

      {/* Score cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-4 gap-4">
        {scoreData.map((s) => (
          <div
            key={s.id}
            className={`card p-4 ${s.color === 'warning' ? 'border-warning/20 bg-[var(--warning-bg)]' : ''}`}
          >
            <p className="section-label mb-3">{s.label}</p>
            <p className="font-mono-data text-3xl font-bold text-foreground mb-0.5">{s.score}</p>
            <p className="text-xs text-muted-foreground mb-3">out of 10</p>
            <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
              <div
                className={`h-full rounded-full ${s.color === 'positive' ? 'bg-positive' : 'bg-warning'}`}
                style={{ width: `${s.score * 10}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{s.note}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl bg-muted border border-border w-fit overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={`report-tab-${tab.id}`}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-150 ${
              activeTab === tab.id
                ? 'bg-card text-foreground shadow-card border border-border'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab: Summary */}
      {activeTab === 'summary' && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Overall score */}
          <div className="card p-6">
            <h3 className="text-sm font-semibold text-foreground mb-5">Overall Interview Score</h3>
            <div className="flex items-center gap-6">
              <div className="relative w-28 h-28 flex-shrink-0">
                <svg className="w-28 h-28 -rotate-90" viewBox="0 0 112 112">
                  <circle cx="56" cy="56" r="46" fill="none" stroke="var(--muted)" strokeWidth="8" />
                  <circle
                    cx="56" cy="56" r="46"
                    fill="none"
                    stroke={overallScore >= 8 ? 'var(--positive)' : overallScore >= 7 ? 'var(--warning)' : 'var(--negative)'}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 46}`}
                    strokeDashoffset={`${2 * Math.PI * 46 * (1 - overallScore / 10)}`}
                    style={{ transition: 'stroke-dashoffset 1s ease' }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-mono-data text-2xl font-bold text-foreground">{overallScore}</span>
                  <span className="text-xs text-muted-foreground">/10</span>
                </div>
              </div>
              <div className="flex-1 space-y-3">
                {scoreData.map((s) => (
                  <div key={`sum-${s.id}`} className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground w-28 flex-shrink-0">{s.label}</span>
                    <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className={`h-full rounded-full ${s.color === 'positive' ? 'bg-positive' : 'bg-warning'}`}
                        style={{ width: `${s.score * 10}%` }}
                      />
                    </div>
                    <span className="font-mono-data text-xs font-bold text-foreground w-8 text-right">{s.score}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Key highlights */}
          <div className="card p-6">
            <h3 className="text-sm font-semibold text-foreground mb-4">Interview Highlights</h3>
            <div className="space-y-3">
              {[
                { type: 'strength', text: 'Demonstrated deep knowledge of ML model evaluation techniques with specific project examples' },
                { type: 'strength', text: 'Communicated complex technical concepts clearly using accessible analogies' },
                { type: 'strength', text: 'Showed strong self-awareness when discussing past failures and lessons learned' },
                { type: 'concern', text: 'Vague responses when asked about cross-functional collaboration — needed multiple follow-ups' },
                { type: 'concern', text: 'Cultural fit signals were mixed — did not clearly align with stated company values' },
              ].map((h, i) => (
                <div key={`highlight-${i}`} className={`flex items-start gap-2.5 p-3 rounded-lg ${
                  h.type === 'strength' ? 'bg-[var(--positive-bg)]' : 'bg-[var(--negative-bg)]'
                }`}>
                  <Star size={13} className={`mt-0.5 flex-shrink-0 ${h.type === 'strength' ? 'text-positive' : 'text-negative'}`} />
                  <p className="text-xs text-foreground leading-relaxed">{h.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Timeline */}
      {activeTab === 'timeline' && (
        <div className="card p-6">
          <h3 className="text-sm font-semibold text-foreground mb-1">Confidence Over Time</h3>
          <p className="text-xs text-muted-foreground mb-6">Composite body language confidence score tracked minute-by-minute throughout the session</p>
          <ConfidenceTimelineChart />
        </div>
      )}

      {/* Tab: Responses */}
      {activeTab === 'responses' && (
        <ResponseQualityTable />
      )}

      {/* Tab: Recommendation */}
      {activeTab === 'recommendation' && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className={`card p-8 border-2 ${rec.cls} flex flex-col items-center text-center`}>
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${rec.cls}`}>
              <rec.icon size={28} />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">{rec.label}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">{rec.desc}</p>
            <div className="flex items-center gap-3">
              <div className="text-center">
                <p className="font-mono-data text-2xl font-bold text-foreground">{overallScore}</p>
                <p className="text-xs text-muted-foreground">Overall Score</p>
              </div>
              <div className="w-px h-10 bg-border" />
              <div className="text-center">
                <p className="font-mono-data text-2xl font-bold text-foreground">
                  {QUESTION_BANK_STATIC.filter((q) => q.asked).length}/{QUESTION_BANK_STATIC.length}
                </p>
                <p className="text-xs text-muted-foreground">Questions Asked</p>
              </div>
              <div className="w-px h-10 bg-border" />
              <div className="text-center">
                <p className="font-mono-data text-2xl font-bold text-foreground">44m</p>
                <p className="text-xs text-muted-foreground">Duration</p>
              </div>
            </div>
          </div>

          <div className="card p-6 space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Next Steps</h3>
            <div className="space-y-3">
              {(recommendation === 'hire' ? [
                { step: 1, action: 'Send offer letter within 48 hours to maintain candidate interest' },
                { step: 2, action: 'Schedule a reference check call with at least two previous managers' },
                { step: 3, action: 'Prepare onboarding plan aligned with candidate\'s stated learning goals' },
              ] : recommendation === 'consider' ? [
                { step: 1, action: 'Schedule a 30-minute follow-up focused on cultural fit and collaboration style' },
                { step: 2, action: 'Request a written case study or take-home assignment to assess depth' },
                { step: 3, action: 'Discuss internally whether the role requirements can be adjusted for this candidate\'s profile' },
              ] : [
                { step: 1, action: 'Send a professional rejection email within 24 hours' },
                { step: 2, action: 'Document specific gaps in the ATS for future reference' },
                { step: 3, action: 'Consider whether a junior variant of the role would be a better fit' },
              ]).map((ns) => (
                <div key={`next-${ns.step}`} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-primary">{ns.step}</span>
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">{ns.action}</p>
                </div>
              ))}

            </div>

            <div className="pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground mb-3">Share this report with your hiring team</p>
              <div className="flex gap-2">
                <button
                  onClick={() => toast.success('Report shared with hiring team')}
                  className="btn-primary text-xs flex-1"
                >
                  Share with Team
                </button>
                <button
                  onClick={() => toast.success('Added to ATS')}
                  className="btn-secondary text-xs flex-1"
                >
                  Save to ATS
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
