'use client';

import React from 'react';

const responses = [
  {
    id: 'resp-001',
    question: 'Walk me through your background and what led you to apply for this role?',
    category: 'Introduction',
    duration: '3m 12s',
    qualityScore: 8.4,
    depthScore: 7.8,
    relevanceScore: 9.0,
    notes: 'Strong narrative arc; clear motivation stated',
  },
  {
    id: 'resp-002',
    question: 'Describe a technically complex problem you solved recently.',
    category: 'Technical',
    duration: '5m 47s',
    qualityScore: 9.1,
    depthScore: 9.4,
    relevanceScore: 8.8,
    notes: 'Detailed STAR format; quantified impact well',
  },
  {
    id: 'resp-003',
    question: 'Tell me about a time you disagreed with a team decision.',
    category: 'Behavioral',
    duration: '4m 05s',
    qualityScore: 7.6,
    depthScore: 7.2,
    relevanceScore: 8.0,
    notes: 'Good self-awareness; resolution was vague',
  },
  {
    id: 'resp-004',
    question: 'How would you approach building a recommendation system from scratch?',
    category: 'Problem Solving',
    duration: '6m 33s',
    qualityScore: 8.8,
    depthScore: 9.2,
    relevanceScore: 8.4,
    notes: 'Structured approach; handled edge cases proactively',
  },
  {
    id: 'resp-005',
    question: 'Describe a situation where you influenced stakeholders without direct authority.',
    category: 'Leadership',
    duration: '3m 58s',
    qualityScore: 7.1,
    depthScore: 6.8,
    relevanceScore: 7.4,
    notes: 'Example was relevant but lacked specific outcomes',
  },
];

const categoryBadge = (cat: string) => {
  const map: Record<string, string> = {
    Introduction: 'badge-info',
    Technical: 'badge-warning',
    Behavioral: 'badge-positive',
    'Problem Solving': 'badge-info',
    Leadership: 'badge-warning',
  };
  return map[cat] || 'badge-info';
};

export default function ResponseQualityTable() {
  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Response Quality Analysis</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {responses.length} questions analyzed · Scored on quality, depth, and relevance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Avg quality:</span>
          <span className="font-mono-data text-sm font-bold text-foreground">
            {(responses.reduce((s, r) => s + r.qualityScore, 0) / responses.length).toFixed(1)}/10
          </span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/30 border-b border-border">
              <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Question</th>
              <th className="text-left px-3 py-3 text-xs font-semibold text-muted-foreground">Category</th>
              <th className="text-left px-3 py-3 text-xs font-semibold text-muted-foreground">Duration</th>
              <th className="text-left px-3 py-3 text-xs font-semibold text-muted-foreground">Quality</th>
              <th className="text-left px-3 py-3 text-xs font-semibold text-muted-foreground">Depth</th>
              <th className="text-left px-3 py-3 text-xs font-semibold text-muted-foreground">Relevance</th>
              <th className="text-left px-3 py-3 text-xs font-semibold text-muted-foreground">AI Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {responses.map((r) => (
              <tr key={r.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-5 py-3.5 max-w-xs">
                  <p className="text-sm text-foreground line-clamp-2 leading-relaxed">{r.question}</p>
                </td>
                <td className="px-3 py-3.5">
                  <span className={categoryBadge(r.category)}>{r.category}</span>
                </td>
                <td className="px-3 py-3.5 font-mono-data text-xs text-muted-foreground">{r.duration}</td>
                <td className="px-3 py-3.5">
                  <div className="flex items-center gap-1.5">
                    <div className="w-12 h-1.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className={`h-full rounded-full ${r.qualityScore >= 8.5 ? 'bg-positive' : r.qualityScore >= 7 ? 'bg-primary' : 'bg-warning'}`}
                        style={{ width: `${r.qualityScore * 10}%` }}
                      />
                    </div>
                    <span className="font-mono-data text-xs font-bold text-foreground">{r.qualityScore}</span>
                  </div>
                </td>
                <td className="px-3 py-3.5 font-mono-data text-xs font-semibold text-foreground">{r.depthScore}</td>
                <td className="px-3 py-3.5 font-mono-data text-xs font-semibold text-foreground">{r.relevanceScore}</td>
                <td className="px-3 py-3.5 text-xs text-muted-foreground max-w-[180px]">{r.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
