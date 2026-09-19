'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Users, Briefcase, Clock, ChevronRight, Upload, Radio, FileVideo, Sparkles, CheckCircle2 } from 'lucide-react';
import { CandidateProfile } from './InterviewSessionScreen';
import LiveCameraFeed from '@/components/LiveCameraFeed';
import { toast } from 'sonner';

interface PreSessionSetupProps {
  onStart: (candidate: CandidateProfile) => void;
}

interface SetupFormData {
  candidateName: string;
  candidateEmail: string;
  roleApplying: string;
  experienceLevel: string;
  interviewDuration: string;
  focusAreas: string;
  linkedIn: string;
}

const recentCandidates: CandidateProfile[] = [
  { id: 'cand-001', name: 'Priya Subramaniam', role: 'Senior ML Engineer', experience: '5 years', email: 'p.subramaniam@email.com', linkedIn: 'linkedin.com/in/priya-s', initials: 'PS' },
  { id: 'cand-002', name: 'Tobias Kirchner', role: 'Product Manager', experience: '7 years', email: 't.kirchner@email.com', linkedIn: 'linkedin.com/in/tobias-k', initials: 'TK' },
  { id: 'cand-003', name: 'Amara Osei', role: 'Frontend Engineer', experience: '3 years', email: 'a.osei@email.com', linkedIn: 'linkedin.com/in/amara-o', initials: 'AO' },
];

export default function PreSessionSetup({ onStart }: PreSessionSetupProps) {
  const [inputMode, setInputMode] = useState<'live' | 'upload'>('live');
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateProfile | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SetupFormData>({
    defaultValues: {
      interviewDuration: '45',
      experienceLevel: 'mid',
      focusAreas: 'Technical skills, Problem solving, Communication, Cultural fit',
    },
  });

  const prefillCandidate = (c: CandidateProfile) => {
    setSelectedCandidate(c);
    setValue('candidateName', c.name);
    setValue('candidateEmail', c.email);
    setValue('roleApplying', c.role);
    setValue('linkedIn', c.linkedIn);
    setValue('experienceLevel', c.experience.includes('5') || c.experience.includes('7') ? 'senior' : 'mid');
  };

  const onSubmit = (data: SetupFormData) => {
    if (inputMode === 'upload' && !videoFile) {
      toast.error('Please upload an interview video file to proceed');
      return;
    }

    const initials = data.candidateName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
    onStart({
      id: `cand-${Date.now()}`,
      name: data.candidateName,
      role: data.roleApplying,
      experience: data.experienceLevel,
      email: data.candidateEmail,
      linkedIn: data.linkedIn || '',
      initials,
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Mode Switcher */}
      <div className="flex items-center justify-center sm:justify-start">
        <div className="inline-flex p-1.5 rounded-xl bg-card border border-border shadow-sm">
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
            Live Camera Session
          </button>

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
            Upload Interview Video
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left: mode preview & candidate selection */}
        <div className="space-y-4">
          {/* Live Camera Preview or Upload dropzone */}
          <div className="card p-4 hover-glow">
            <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground mb-3">
              {inputMode === 'live' ? 'Live Camera Feed' : 'Recorded Video File'}
            </h3>

            {inputMode === 'live' ? (
              <div className="aspect-video w-full rounded-lg overflow-hidden">
                <LiveCameraFeed className="w-full h-full" overlayLabel="CAMERA PREVIEW" showTimer={false} />
              </div>
            ) : (
              <div>
                {videoFile ? (
                  <div className="p-4 rounded-xl border border-primary/30 bg-primary/5 flex items-center gap-3">
                    <FileVideo size={24} className="text-primary flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-foreground truncate">{videoFile.name}</p>
                      <p className="text-[11px] text-muted-foreground">{(videoFile.size / (1024 * 1024)).toFixed(1)} MB</p>
                    </div>
                    <span className="badge-positive text-[10px]">Ready</span>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-border hover:border-primary/40 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors text-center">
                    <Upload size={24} className="text-primary mb-2" />
                    <p className="text-xs font-semibold text-foreground">Upload Candidate Recording</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">MP4, MOV up to 2GB</p>
                    <input
                      type="file"
                      accept="video/*"
                      className="hidden"
                      onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                    />
                  </label>
                )}
              </div>
            )}
          </div>

          {/* Recent candidates */}
          <div className="card p-5">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users size={14} className="text-primary" />
              </div>
              <h3 className="text-sm font-semibold text-foreground">Recent candidates</h3>
            </div>
            <div className="space-y-2">
              {recentCandidates.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => prefillCandidate(c)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all duration-150 text-left ${
                    selectedCandidate?.id === c.id
                      ? 'border-primary bg-primary/5 shadow-sm scale-[1.01]'
                      : 'border-border hover:border-primary/30 hover:bg-muted/50'
                  }`}
                >
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold flex-shrink-0">
                    {c.initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-foreground truncate">{c.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{c.role}</p>
                  </div>
                  <ChevronRight size={14} className="text-muted-foreground flex-shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: setup form */}
        <div className="xl:col-span-2">
          <form onSubmit={handleSubmit(onSubmit)} className="card p-6 space-y-5">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-7 h-7 rounded-lg bg-accent/10 flex items-center justify-center">
                <Briefcase size={14} className="text-accent" />
              </div>
              <h3 className="text-sm font-semibold text-foreground">Candidate & Session Parameters</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Candidate name <span className="text-negative">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Priya Subramaniam"
                  className="input-field"
                  {...register('candidateName', { required: 'Candidate name is required' })}
                />
                {errors.candidateName && (
                  <p className="mt-1.5 text-xs text-negative">{errors.candidateName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Candidate email <span className="text-negative">*</span>
                </label>
                <input
                  type="email"
                  placeholder="candidate@email.com"
                  className="input-field"
                  {...register('candidateEmail', {
                    required: 'Email is required',
                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' },
                  })}
                />
                {errors.candidateEmail && (
                  <p className="mt-1.5 text-xs text-negative">{errors.candidateEmail.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Role applying for <span className="text-negative">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Senior ML Engineer"
                  className="input-field"
                  {...register('roleApplying', { required: 'Role is required' })}
                />
                {errors.roleApplying && (
                  <p className="mt-1.5 text-xs text-negative">{errors.roleApplying.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Experience level
                </label>
                <select className="input-field cursor-pointer" {...register('experienceLevel')}>
                  <option value="junior">Junior (1–2 years)</option>
                  <option value="mid">Mid-level (3–5 years)</option>
                  <option value="senior">Senior (5+ years)</option>
                  <option value="lead">Lead / Principal</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Evaluation focus areas
              </label>
              <textarea
                rows={2}
                className="input-field resize-none"
                {...register('focusAreas')}
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="btn-primary px-6 py-3 shadow-md hover:shadow-lg hover-pop"
              >
                <Sparkles size={16} />
                {inputMode === 'live' ? 'Open Live Camera Session' : 'Analyze Uploaded Interview'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
