'use client';

import React, { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

const topics = [
  { id: 'topic-001', name: 'Supervised vs Unsupervised Learning', covered: true, depth: 'Thorough', timeSpent: '5m 12s', qualityScore: 9.1, notes: 'Excellent definitions with real-world examples' },
  { id: 'topic-002', name: 'Bias-Variance Tradeoff', covered: true, depth: 'Thorough', timeSpent: '7m 38s', qualityScore: 8.4, notes: 'Clear visual explanation; good analogies used' },
  { id: 'topic-003', name: 'Gradient Descent Optimization', covered: true, depth: 'Partial', timeSpent: '4m 05s', qualityScore: 6.7, notes: 'Covered concept but skipped step-size intuition' },
  { id: 'topic-004', name: 'Linear Regression Implementation', covered: true, depth: 'Thorough', timeSpent: '8m 22s', qualityScore: 8.9, notes: 'Hands-on code walkthrough was highly effective' },
  { id: 'topic-005', name: 'Model Evaluation (Precision/Recall/F1)', covered: true, depth: 'Partial', timeSpent: '3m 48s', qualityScore: 6.2, notes: 'F1-score formula shown but not explained intuitively' },
  { id: 'topic-006', name: 'Overfitting & Regularization (L1/L2)', covered: true, depth: 'Brief', timeSpent: '2m 11s', qualityScore: 5.1, notes: 'Mentioned but not demonstrated with examples' },
  { id: 'topic-007', name: 'Cross-Validation Strategies', covered: false, depth: '—', timeSpent: '0m 00s', qualityScore: 0, notes: 'Not covered — significant gap in learning objectives' },
  { id: 'topic-008', name: 'Ensemble Methods (Bagging/Boosting/RF)', covered: false, depth: '—', timeSpent: '0m 00s', qualityScore: 0, notes: 'Not covered — was listed as a required module topic' },
];

type SortField = 'name' | 'qualityScore' | 'timeSpent';
type SortDir = 'asc' | 'desc';

export default function TopicCoverageTable() {
  const [sortField, setSortField] = useState<SortField>('qualityScore');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('desc'); }
  };

  const sorted = [...topics].sort((a, b) => {
    let av: number | string = a[sortField];
    let bv: number | string = b[sortField];
    if (sortField === 'timeSpent') {
      av = parseInt(String(a.timeSpent).replace(/\D/g, '')) || 0;
      bv = parseInt(String(b.timeSpent).replace(/\D/g, '')) || 0;
    }
    if (av < bv) return sortDir === 'asc' ? -1 : 1;
    if (av > bv) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });

  const SortIcon = ({ field }: { field: SortField }) => (
    <span className="inline-flex flex-col ml-1">
      <ChevronUp size={10} className={sortField === field && sortDir === 'asc' ? 'text-primary' : 'text-muted-foreground/40'} />
      <ChevronDown size={10} className={sortField === field && sortDir === 'desc' ? 'text-primary' : 'text-muted-foreground/40'} />
    </span>
  );

  const depthBadge = (depth: string, covered: boolean) => {
    if (!covered) return <span className="badge-negative">Not Covered</span>;
    if (depth === 'Thorough') return <span className="badge-positive">Thorough</span>;
    if (depth === 'Partial') return <span className="badge-warning">Partial</span>;
    return <span className="badge-info">Brief</span>;
  };

  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Topic Coverage Breakdown</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {topics.filter((t) => t.covered).length} of {topics.length} topics covered ·{' '}
            {topics.filter((t) => !t.covered).length} gaps identified
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="badge-negative">{topics.filter((t) => !t.covered).length} Missed</span>
          <span className="badge-warning">{topics.filter((t) => t.depth === 'Partial').length} Partial</span>
          <span className="badge-positive">{topics.filter((t) => t.depth === 'Thorough').length} Thorough</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/30 border-b border-border">
              <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground w-8">#</th>
              <th
                className="text-left px-3 py-3 text-xs font-semibold text-muted-foreground cursor-pointer hover:text-foreground"
                onClick={() => handleSort('name')}
              >
                Topic <SortIcon field="name" />
              </th>
              <th className="text-left px-3 py-3 text-xs font-semibold text-muted-foreground">Coverage Depth</th>
              <th
                className="text-left px-3 py-3 text-xs font-semibold text-muted-foreground cursor-pointer hover:text-foreground"
                onClick={() => handleSort('timeSpent')}
              >
                Time Spent <SortIcon field="timeSpent" />
              </th>
              <th
                className="text-left px-3 py-3 text-xs font-semibold text-muted-foreground cursor-pointer hover:text-foreground"
                onClick={() => handleSort('qualityScore')}
              >
                Quality Score <SortIcon field="qualityScore" />
              </th>
              <th className="text-left px-3 py-3 text-xs font-semibold text-muted-foreground">AI Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sorted.map((topic, i) => (
              <tr
                key={topic.id}
                className={`transition-colors hover:bg-muted/30 ${!topic.covered ? 'bg-[var(--negative-bg)]/40' : ''}`}
              >
                <td className="px-5 py-3.5 text-xs text-muted-foreground font-mono-data">{i + 1}</td>
                <td className="px-3 py-3.5">
                  <span className="text-sm font-medium text-foreground">{topic.name}</span>
                </td>
                <td className="px-3 py-3.5">{depthBadge(topic.depth, topic.covered)}</td>
                <td className="px-3 py-3.5 font-mono-data text-xs text-muted-foreground">{topic.timeSpent}</td>
                <td className="px-3 py-3.5">
                  {topic.covered ? (
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            topic.qualityScore >= 8 ? 'bg-positive' :
                            topic.qualityScore >= 6 ? 'bg-primary' : 'bg-warning'
                          }`}
                          style={{ width: `${topic.qualityScore * 10}%` }}
                        />
                      </div>
                      <span className="font-mono-data text-xs font-semibold text-foreground">{topic.qualityScore}</span>
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </td>
                <td className="px-3 py-3.5 text-xs text-muted-foreground max-w-xs">{topic.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
