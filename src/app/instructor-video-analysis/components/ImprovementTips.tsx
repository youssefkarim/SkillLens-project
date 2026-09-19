'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronRight, AlertTriangle, TrendingUp, Lightbulb, Clock } from 'lucide-react';

const tips = [
  {
    id: 'tip-pacing',
    category: 'Pacing',
    priority: 'high',
    icon: Clock,
    title: 'Slow down during complex derivations',
    description:
      'Your speaking rate in the gradient descent section averaged 187 words/minute — significantly above the recommended 130–150 wpm for technical content. Listeners need processing time when you introduce mathematical concepts.',
    actions: [
      'Insert 2-second pauses after writing each equation on the board',
      'Explicitly narrate what you\'re doing: "Let me walk through this step-by-step"',
      'Add a verbal checkpoint: "Does that make sense before we move on?"',
    ],
  },
  {
    id: 'tip-coverage',
    category: 'Content Coverage',
    priority: 'high',
    icon: AlertTriangle,
    title: 'Cross-validation and ensemble methods were not covered',
    description:
      'Two of the eight stated learning objectives — cross-validation strategies and ensemble methods — were not addressed in this recording. These are foundational topics that students will need for assessments.',
    actions: [
      'Allocate 6–8 minutes to k-fold cross-validation with a visual diagram',
      'Cover bagging vs boosting as a conceptual comparison first, then introduce random forests',
      'Consider a follow-up supplementary video specifically for these two topics',
    ],
  },
  {
    id: 'tip-interaction',
    category: 'Student Interaction',
    priority: 'medium',
    icon: TrendingUp,
    title: 'Add audience engagement prompts throughout the lecture',
    description:
      'Only 2 direct questions were posed to the audience in a 44-minute lecture. Research shows that prompting students to predict outcomes before explanations significantly improves retention.',
    actions: [
      'Open each major topic with a prediction question: "What do you think happens when…?"',
      'Use a 30-second think-pause before revealing answers to complex questions',
      'End each section with a quick recap question: "Can someone summarize what we just covered?"',
    ],
  },
  {
    id: 'tip-regularization',
    category: 'Depth of Coverage',
    priority: 'medium',
    icon: Lightbulb,
    title: 'Expand regularization explanation with visual examples',
    description:
      'The L1/L2 regularization topic received only 2 minutes 11 seconds of coverage and scored 5.1/10 for quality. The concept was mentioned but not demonstrated with visual plots or code examples.',
    actions: [
      'Show a before/after plot: overfit model vs regularized model on the same dataset',
      'Explain the geometric interpretation of L1 (diamond) vs L2 (circle) constraints',
      'Walk through a lambda selection example using validation loss curves',
    ],
  },
  {
    id: 'tip-filler',
    category: 'Speech Quality',
    priority: 'low',
    icon: Lightbulb,
    title: 'Reduce filler word usage',
    description:
      'The transcript detected 43 instances of "um/uh" and 28 instances of "you know" throughout the lecture. While this is within an acceptable range, reducing filler words will improve perceived authority and clarity.',
    actions: [
      'Practice deliberate silence — replace filler words with a 1-second pause',
      'Record a 10-minute practice segment daily and count fillers to build awareness',
      'Prepare key transition phrases: "Building on that…", "The key insight here is…"',
    ],
  },
];

export default function ImprovementTips() {
  const [expanded, setExpanded] = useState<string | null>('tip-pacing');

  const priorityConfig = {
    high: { label: 'High Priority', color: 'badge-negative' },
    medium: { label: 'Medium Priority', color: 'badge-warning' },
    low: { label: 'Low Priority', color: 'badge-info' },
  };

  return (
    <div className="space-y-4">
      <div className="card p-5">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
            <Lightbulb size={15} className="text-accent" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">AI Coaching Recommendations</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {tips.filter((t) => t.priority === 'high').length} high-priority issues · {tips.filter((t) => t.priority === 'medium').length} medium · {tips.filter((t) => t.priority === 'low').length} low · Based on your latest recording
            </p>
          </div>
        </div>
      </div>

      {tips.map((tip) => {
        const isOpen = expanded === tip.id;
        const pc = priorityConfig[tip.priority as keyof typeof priorityConfig];
        return (
          <div
            key={tip.id}
            className={`card overflow-hidden transition-all duration-200 ${
              tip.priority === 'high' ? 'border-negative/20' : ''
            }`}
          >
            <button
              onClick={() => setExpanded(isOpen ? null : tip.id)}
              className="w-full flex items-center gap-4 p-5 text-left hover:bg-muted/20 transition-colors"
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                tip.priority === 'high' ? 'bg-[var(--negative-bg)]' :
                tip.priority === 'medium' ? 'bg-[var(--warning-bg)]' : 'bg-[var(--info-bg)]'
              }`}>
                <tip.icon size={16} className={
                  tip.priority === 'high' ? 'text-negative' :
                  tip.priority === 'medium' ? 'text-warning' : 'text-info'
                } />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={pc.color}>{pc.label}</span>
                  <span className="text-xs text-muted-foreground">{tip.category}</span>
                </div>
                <p className="text-sm font-semibold text-foreground">{tip.title}</p>
              </div>
              {isOpen ? (
                <ChevronDown size={16} className="text-muted-foreground flex-shrink-0" />
              ) : (
                <ChevronRight size={16} className="text-muted-foreground flex-shrink-0" />
              )}
            </button>

            {isOpen && (
              <div className="px-5 pb-5 border-t border-border fade-in">
                <p className="text-sm text-muted-foreground leading-relaxed mt-4 mb-4">
                  {tip.description}
                </p>
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2">
                    Recommended Actions
                  </p>
                  {tip.actions.map((action, i) => (
                    <div key={`action-${tip.id}-${i}`} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-primary">{i + 1}</span>
                      </div>
                      <p className="text-sm text-foreground leading-relaxed">{action}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
