'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Upload, FileVideo, FileText, AlertCircle, Play, CheckCircle2, Sparkles, Video, Radio, Disc } from 'lucide-react';
import { toast } from 'sonner';
import { UploadedLesson } from './InstructorAnalysisScreen';
import LiveCameraFeed from '@/components/LiveCameraFeed';

interface UploadPanelProps {
  onAnalyze: (lesson: UploadedLesson) => void;
}

const SAMPLE_SYLLABUS = `Module 4: Machine Learning Fundamentals

Learning Objectives:
1. Define supervised vs unsupervised learning
2. Explain the bias-variance tradeoff
3. Describe gradient descent optimization
4. Implement a basic linear regression model
5. Evaluate model performance using precision, recall, and F1-score
6. Understand overfitting and regularization techniques (L1/L2)
7. Explain cross-validation strategies (k-fold, stratified)
8. Introduce ensemble methods: bagging, boosting, random forests

Prerequisites: Students should be comfortable with calculus, linear algebra, and Python basics.

Estimated lecture duration: 45 minutes`;

export default function UploadPanel({ onAnalyze }: UploadPanelProps) {
  const [inputMode, setInputMode] = useState<'upload' | 'live'>('upload');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedTime, setRecordedTime] = useState(0);
  const [syllabusText, setSyllabusText] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('video/')) {
      setVideoFile(file);
    } else {
      toast.error('Please upload a valid video file (MP4, MOV, AVI)');
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setVideoFile(file);
  };

  const handleAnalyze = () => {
    if (inputMode === 'upload' && !videoFile && !syllabusText.trim()) {
      toast.error('Please upload a video and enter your lesson content');
      return;
    }
    if (inputMode === 'upload' && !videoFile) {
      toast.error('Please upload a teaching video to analyze');
      return;
    }
    if (!syllabusText.trim()) {
      toast.error('Please enter your lesson syllabus or content outline');
      return;
    }

    onAnalyze({
      videoName: inputMode === 'live' ? 'Live_Lecture_Session.webm' : (videoFile?.name || 'Lecture_Recording.mp4'),
      syllabusText,
    });
  };

  const useSampleLesson = () => {
    setSyllabusText(SAMPLE_SYLLABUS);
    toast.success('Sample lesson content loaded');
  };

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      toast.success('Live recording stopped and saved for analysis!');
    } else {
      setIsRecording(true);
      toast.info('Recording started! Speak clearly toward your camera.');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Mode Switcher */}
      <div className="flex items-center justify-center sm:justify-start">
        <div className="inline-flex p-1.5 rounded-xl bg-card border border-border shadow-sm">
          <button
            type="button"
            onClick={() => setInputMode('upload')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
              inputMode === 'upload'
                ? 'bg-primary text-white shadow-md scale-[1.02]'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            <Upload size={15} />
            Upload Video File
          </button>

          <button
            type="button"
            onClick={() => setInputMode('live')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
              inputMode === 'live'
                ? 'bg-negative text-white shadow-md scale-[1.02]'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            <Radio size={15} className="animate-pulse" />
            Open Live Camera
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Video / Camera Panel */}
        <div className="card p-6 hover-glow">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-transform duration-300 hover:scale-110 ${
                inputMode === 'live' ? 'bg-negative/10 text-negative' : 'bg-primary/10 text-primary'
              }`}>
                {inputMode === 'live' ? <Radio size={16} /> : <FileVideo size={16} />}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  {inputMode === 'live' ? 'Live Camera Feed' : 'Teaching Video'}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {inputMode === 'live' ? 'Real-time webcam recording' : 'MP4, MOV, AVI — max 2GB'}
                </p>
              </div>
            </div>

            {inputMode === 'upload' && videoFile && (
              <button
                onClick={() => setVideoFile(null)}
                className="text-xs font-medium text-muted-foreground hover:text-negative transition-colors hover:underline"
              >
                Remove
              </button>
            )}
          </div>

          {/* Mode 1: Live Camera */}
          {inputMode === 'live' ? (
            <div className="space-y-4">
              <div className="aspect-video w-full">
                <LiveCameraFeed
                  className="w-full h-full"
                  overlayLabel={isRecording ? 'REC' : 'LIVE CAMERA'}
                  showTimer={isRecording}
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/40 border border-border">
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${isRecording ? 'bg-negative animate-ping' : 'bg-positive'}`} />
                  <span className="text-xs font-semibold text-foreground">
                    {isRecording ? 'Recording active…' : 'Camera ready'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={toggleRecording}
                  className={`btn-secondary text-xs px-4 py-2 hover-pop ${
                    isRecording ? 'border-negative/40 text-negative hover:bg-negative/10' : ''
                  }`}
                >
                  <Disc size={15} className={isRecording ? 'animate-spin text-negative' : 'text-primary'} />
                  {isRecording ? 'Stop Recording' : 'Start Recording'}
                </button>
              </div>
            </div>
          ) : (
            /* Mode 2: Upload File */
            videoFile ? (
              <div className="rounded-xl border border-border bg-muted/40 p-5 flex items-center gap-4 animate-scale-in transition-all duration-300 hover:border-primary/40 hover:bg-muted/60">
                <div className="w-11 h-11 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 animate-pulse">
                  <Play size={18} className="text-primary fill-primary/20" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{videoFile.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {(videoFile.size / (1024 * 1024)).toFixed(1)} MB · Ready for processing
                  </p>
                </div>
                <span className="badge-positive ml-auto flex-shrink-0 animate-scale-in">
                  <CheckCircle2 size={12} /> Queued
                </span>
              </div>
            ) : (
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleFileDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`
                  group rounded-xl border-2 border-dashed p-10 text-center cursor-pointer transition-all duration-300
                  ${isDragging
                    ? 'border-primary bg-primary/5 scale-[1.01] shadow-glow'
                    : 'border-border hover:border-primary/50 hover:bg-muted/30 hover:scale-[1.005]'
                  }
                `}
              >
                <div className="w-12 h-12 rounded-2xl bg-primary/10 mx-auto mb-3 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:bg-primary/20">
                  <Upload size={22} className="text-primary transition-transform duration-300 group-hover:-translate-y-0.5" />
                </div>
                <p className="text-sm font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                  Drop a video file here
                </p>
                <p className="text-xs text-muted-foreground mb-4">
                  or select from your computer
                </p>
                <span className="btn-secondary text-xs py-2 px-4 shadow-sm group-hover:shadow-md">
                  Browse Files
                </span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={handleFileSelect}
                />
              </div>
            )
          )}

          {/* Demo note */}
          <div className="mt-4 flex items-start gap-2.5 p-3 rounded-lg bg-muted/50 border border-border/70 transition-all duration-200 hover:bg-muted/80">
            <AlertCircle size={15} className="text-primary mt-0.5 flex-shrink-0" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              {inputMode === 'live'
                ? 'Live camera stream uses your browser webcam. Video is processed locally in your session.'
                : 'In this sandbox, any video file is accepted. The report is generated from the syllabus text you provide.'
              }
            </p>
          </div>
        </div>

        {/* Syllabus input */}
        <div className="card p-6 hover-glow">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center transition-transform duration-300 hover:scale-110 hover:rotate-6">
                <FileText size={16} className="text-accent" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">Lesson plan</h3>
                <p className="text-xs text-muted-foreground">Paste objectives, topics, and required coverage</p>
              </div>
            </div>
            <button
              onClick={useSampleLesson}
              className="inline-flex items-center gap-1 text-xs font-semibold text-accent hover:text-accent/80 hover-underline transition-all hover:scale-105 active:scale-95"
            >
              <Sparkles size={12} /> Load sample
            </button>
          </div>

          <textarea
            value={syllabusText}
            onChange={(e) => setSyllabusText(e.target.value)}
            placeholder={`Paste your lesson plan here…\n\nExample:\n- Learning objective 1\n- Learning objective 2\n- Topics to cover\n- Key concepts`}
            className="input-field resize-none h-64 font-mono text-xs leading-relaxed transition-all duration-200 focus:shadow-glow-accent"
          />

          <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-mono-data">{syllabusText.split('\n').filter(Boolean).length} lines entered</span>
            <span className="font-mono-data">{syllabusText.length} characters</span>
          </div>
        </div>
      </div>

      {/* Analysis settings */}
      <div className="card p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4">Analysis Options</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Content Coverage', desc: 'Topic-by-topic coverage analysis', enabled: true },
            { label: 'Presentation Skills', desc: 'Delivery, pacing, and clarity scoring', enabled: true },
            { label: 'Speech Analysis', desc: 'Filler words, speaking rate, pauses', enabled: true },
            { label: 'Coaching Tips', desc: 'Specific improvement recommendations', enabled: true },
          ].map((opt, idx) => (
            <div 
              key={`opt-${opt.label}`} 
              className="flex items-start gap-3 p-3 rounded-lg bg-muted/40 border border-border transition-all duration-200 hover:bg-card hover:shadow-md hover:border-primary/30 hover:-translate-y-0.5 group cursor-pointer"
              style={{ animationDelay: `${idx * 80}ms` }}
            >
              <div className="w-4 h-4 rounded bg-primary flex items-center justify-center mt-0.5 flex-shrink-0 transition-transform duration-200 group-hover:scale-110">
                <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                  <path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">{opt.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{opt.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="flex items-center justify-between p-5 rounded-xl border border-border bg-card shadow-sm transition-all duration-300 hover:shadow-md">
        <div>
          <p className="text-sm font-semibold text-foreground">
            {inputMode === 'live' ? 'Run Live Analysis' : 'Run Video Analysis'}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Typical processing time is 1–3 minutes, depending on content length.
          </p>
        </div>
        <button
          onClick={handleAnalyze}
          disabled={(inputMode === 'upload' && !videoFile) || !syllabusText.trim()}
          className="btn-primary px-6 py-3 shadow-md hover:shadow-lg disabled:opacity-40 hover-pop"
        >
          <Sparkles size={16} />
          {inputMode === 'live' ? 'Analyze Live Recording' : 'Start Video Analysis'}
        </button>
      </div>
    </div>
  );
}
