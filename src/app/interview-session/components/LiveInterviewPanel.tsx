'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Square, Mic, MicOff, Camera, CameraOff, ChevronRight, Plus, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { CandidateProfile } from './InterviewSessionScreen';
import BodyLanguageMonitor from './BodyLanguageMonitor';
import LiveCameraFeed from '@/components/LiveCameraFeed';

interface LiveInterviewPanelProps {
  candidate: CandidateProfile;
  onEnd: () => void;
}

const QUESTION_BANK = [
  { id: 'q-001', category: 'Introduction', text: 'Can you walk me through your background and what led you to apply for this role?', asked: false },
  { id: 'q-002', category: 'Technical', text: 'Describe a technically complex problem you solved recently. What was your approach?', asked: false },
  { id: 'q-003', category: 'Behavioral', text: 'Tell me about a time you disagreed with a team decision. How did you handle it?', asked: false },
  { id: 'q-004', category: 'Problem Solving', text: 'How would you approach building a recommendation system from scratch with limited data?', asked: false },
  { id: 'q-005', category: 'Leadership', text: 'Describe a situation where you had to influence stakeholders without direct authority.', asked: false },
  { id: 'q-006', category: 'Technical', text: 'What\'s your experience with model monitoring in production? How do you handle model drift?', asked: false },
  { id: 'q-007', category: 'Culture Fit', text: 'What kind of work environment helps you do your best work? What do you avoid?', asked: false },
  { id: 'q-008', category: 'Situational', text: 'You\'re midway through a sprint and discover a critical bug affecting 20% of users. What do you do?', asked: false },
];

const AI_FOLLOWUPS = [
  'Can you give a specific example from your last role?',
  'What was the outcome, and what would you do differently?',
  'How did your team react to that decision?',
  'What metrics did you use to measure success?',
  'If you had more time, what would you have done differently?',
];

export default function LiveInterviewPanel({ candidate, onEnd }: LiveInterviewPanelProps) {
  const [questions, setQuestions] = useState(QUESTION_BANK);
  const [activeQuestion, setActiveQuestion] = useState<string | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [notes, setNotes] = useState('');
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setElapsedSeconds((s) => s + 1);
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  };

  const markAsked = useCallback((id: string) => {
    setQuestions((prev) => prev.map((q) => q.id === id ? { ...q, asked: true } : q));
    setActiveQuestion(id);
  }, []);

  const handleEndSession = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    toast.success('Session ended. Compiling evaluation…');
    setTimeout(onEnd, 1200);
  };

  const categoryColor: Record<string, string> = {
    Introduction: 'badge-info',
    Technical: 'badge-warning',
    Behavioral: 'badge-positive',
    'Problem Solving': 'badge-info',
    Leadership: 'badge-warning',
    'Culture Fit': 'badge-positive',
    Situational: 'badge-warning',
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
      {/* Left: Question queue */}
      <div className="xl:col-span-3 space-y-4">
        <div className="card p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">Question queue</h3>
            <span className="font-mono-data text-xs text-muted-foreground">
              {questions.filter((q) => q.asked).length}/{questions.length}
            </span>
          </div>
          <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
            {questions.map((q) => (
              <button
                key={q.id}
                onClick={() => !q.asked && markAsked(q.id)}
                disabled={q.asked}
                className={`w-full text-left p-3 rounded-xl border transition-all duration-150 ${
                  activeQuestion === q.id
                    ? 'border-primary bg-primary/5'
                    : q.asked
                    ? 'border-border bg-muted/40 opacity-60 cursor-default' :'border-border hover:border-primary/40 hover:bg-muted/30'
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <span className={categoryColor[q.category] || 'badge-info'}>{q.category}</span>
                  {q.asked && (
                    <span className="text-xs text-muted-foreground font-medium">Asked</span>
                  )}
                </div>
                <p className="text-xs text-foreground leading-relaxed line-clamp-3">{q.text}</p>
                {!q.asked && (
                  <div className="flex items-center gap-1 mt-2 text-xs text-primary font-medium">
                    <ChevronRight size={11} />
                    <span>Ask this question</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* AI Follow-ups */}
        <div className="card p-4">
          <h3 className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground mb-3">Suggested follow-ups</h3>
          <div className="space-y-2">
            {AI_FOLLOWUPS.slice(0, 3).map((f, i) => (
              <div
                key={`followup-${i}`}
                className="flex items-start gap-2 p-2.5 rounded-lg bg-accent/5 border border-accent/15 cursor-pointer hover:bg-accent/10 transition-colors"
                onClick={() => toast.success('Follow-up noted')}
              >
                <Plus size={12} className="text-accent mt-0.5 flex-shrink-0" />
                <p className="text-xs text-foreground leading-relaxed">{f}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Center: Video feed */}
      <div className="xl:col-span-5 space-y-4">
        {/* Video panel */}
        <div className="card overflow-hidden">
          <div className="relative aspect-video bg-slate-950">
            <LiveCameraFeed
              className="w-full h-full"
              overlayLabel="LIVE INTERVIEW"
              showTimer={true}
            />
            {/* Candidate name overlay */}
            <div className="absolute top-3 right-16 z-20 px-3 py-1 rounded-lg bg-black/60 backdrop-blur-sm border border-white/10">
              <p className="text-white text-xs font-semibold">{candidate.name}</p>
              <p className="text-white/70 text-[11px]">{candidate.role}</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-border">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMuted((v) => !v)}
                className={`p-2.5 rounded-xl border transition-all duration-150 ${
                  isMuted ? 'bg-negative/10 border-negative/30 text-negative' : 'bg-muted border-border text-muted-foreground hover:text-foreground'
                }`}
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <MicOff size={16} /> : <Mic size={16} />}
              </button>
              <button
                onClick={() => setIsCameraOff((v) => !v)}
                className={`p-2.5 rounded-xl border transition-all duration-150 ${
                  isCameraOff ? 'bg-negative/10 border-negative/30 text-negative' : 'bg-muted border-border text-muted-foreground hover:text-foreground'
                }`}
                title={isCameraOff ? 'Turn camera on' : 'Turn camera off'}
              >
                {isCameraOff ? <CameraOff size={16} /> : <Camera size={16} />}
              </button>
            </div>

            <div className="text-center">
              <p className="text-xs text-muted-foreground">Session time</p>
              <p className="font-mono-data text-sm font-bold text-foreground">{formatTime(elapsedSeconds)}</p>
            </div>

            <button
              onClick={() => setShowEndConfirm(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-negative text-white text-sm font-semibold hover:opacity-90 active:scale-95 transition-all duration-150"
            >
              <Square size={14} />
              End session
            </button>
          </div>
        </div>

        {/* Active question display */}
        {activeQuestion && (
          <div className="card p-4 border-primary/20 bg-primary/5 fade-in">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-primary mb-2">Current question</p>
            <p className="text-sm text-foreground leading-relaxed">
              {questions.find((q) => q.id === activeQuestion)?.text}
            </p>
          </div>
        )}

        {/* Notes */}
        <div className="card p-4">
          <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2.5">
            Interview notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Type observations during the interview…"
            className="input-field resize-none h-28 text-xs leading-relaxed"
          />
        </div>
      </div>

      {/* Right: Body language monitor */}
      <div className="xl:col-span-4">
        <BodyLanguageMonitor elapsedSeconds={elapsedSeconds} />
      </div>

      {/* End session confirm modal */}
      {showEndConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/20 backdrop-blur-sm">
          <div className="bg-card rounded-2xl border border-border shadow-modal p-6 w-full max-w-sm fade-in">
            <div className="w-12 h-12 rounded-full bg-[var(--warning-bg)] flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={22} className="text-warning" />
            </div>
            <h3 className="text-lg font-semibold text-foreground text-center mb-2">End this session?</h3>
            <p className="text-sm text-muted-foreground text-center mb-6">
              Recording will stop and an evaluation report will be generated from the session data.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowEndConfirm(false)}
                className="btn-secondary flex-1"
              >
                Continue
              </button>
              <button
                onClick={() => { setShowEndConfirm(false); handleEndSession(); }}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-negative text-white font-semibold text-sm transition-all duration-150 hover:opacity-90 active:scale-95"
              >
                End and compile report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
