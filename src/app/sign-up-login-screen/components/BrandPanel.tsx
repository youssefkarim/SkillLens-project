import React from 'react';
import { GraduationCap, Briefcase, Video, BarChart3, Lightbulb, Mic, Eye, ClipboardList } from 'lucide-react';
import { PortalRole } from './AuthScreen';
import Logo from '@/components/Logo';

interface BrandPanelProps {
  role: PortalRole;
}

const instructorFeatures = [
  { icon: Video, title: 'Lecture coverage analysis', desc: 'Measure how completely a recording addresses stated learning objectives.' },
  { icon: BarChart3, title: 'Delivery scoring', desc: 'Evaluate pacing, clarity, structure, and audience engagement with consistent rubrics.' },
  { icon: Lightbulb, title: 'Actionable coaching', desc: 'Receive prioritized recommendations instructors can apply in the next session.' },
];

const managerFeatures = [
  { icon: Mic, title: 'Structured live interviews', desc: 'Run consistent sessions with guided questions and real-time prompts.' },
  { icon: Eye, title: 'Presence monitoring', desc: 'Track posture, eye contact, and confidence signals alongside the conversation.' },
  { icon: ClipboardList, title: 'Decision-ready reports', desc: 'Export a scored summary with evidence, highlights, and recommended next steps.' },
];

export default function BrandPanel({ role }: BrandPanelProps) {
  const features = role === 'instructor' ? instructorFeatures : managerFeatures;
  const tagline = role === 'instructor'
    ? 'Evidence-based coaching for every lecture you record.'
    : 'Consistent, defensible hiring decisions at interview scale.';
  const RoleIcon = role === 'instructor' ? GraduationCap : Briefcase;

  return (
    <div className="hidden lg:flex flex-col justify-between w-[440px] xl:w-[500px] min-h-screen bg-primary px-12 py-12 relative overflow-hidden flex-shrink-0 animate-slide-in-left">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 -right-16 w-[420px] h-[420px] rounded-full border border-white/[0.08] animate-float" />
        <div className="absolute bottom-16 -left-24 w-[320px] h-[320px] rounded-full border border-white/[0.06] animate-float" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/[0.02] rounded-full blur-3xl pointer-events-none" />
      </div>

      <div className="relative z-10">
        <Logo variant="light" size={34} className="mb-16" />

        <div className="mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 mb-6 backdrop-blur-sm transition-all duration-300 hover:bg-white/20 hover:scale-105">
            <RoleIcon size={13} className="text-white/90" />
            <span className="text-white/90 text-[11px] font-semibold tracking-wide uppercase">
              {role === 'instructor' ? 'Instruction' : 'Talent'}
            </span>
          </div>
          <h2 className="text-white text-[1.75rem] font-semibold leading-snug tracking-tight mb-4">
            {tagline}
          </h2>
          <p className="text-white/70 text-sm leading-relaxed">
            Commio applies computer vision and language models to teaching recordings and live interviews, producing structured reports your institution can review, share, and act on.
          </p>
        </div>

        <div className="space-y-4">
          {features.map((f, idx) => (
            <div 
              key={f.title} 
              className="flex gap-3.5 p-3 rounded-xl transition-all duration-300 hover:bg-white/10 hover:translate-x-1 backdrop-blur-sm group cursor-pointer border border-transparent hover:border-white/10"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="w-10 h-10 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 group-hover:bg-white/20">
                <f.icon size={18} className="text-white" strokeWidth={1.75} />
              </div>
              <div>
                <p className="text-white font-medium text-sm mb-0.5 group-hover:text-white">{f.title}</p>
                <p className="text-white/60 text-[13px] leading-relaxed group-hover:text-white/80">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 border-t border-white/10 pt-8 mt-6">
        <p className="text-white/80 text-[13px] leading-relaxed italic">
          "The coverage report showed 40% of lecture time spent on material outside the syllabus. We adjusted the module in a single review cycle."
        </p>
        <div className="flex items-center gap-3 mt-5 group cursor-pointer">
          <div className="w-9 h-9 rounded-full bg-white/15 border border-white/20 flex items-center justify-center text-[12px] font-bold text-white transition-transform duration-300 group-hover:scale-110">
            MR
          </div>
          <div>
            <p className="text-white text-[13px] font-medium group-hover:underline">Dr. Marcus Reid</p>
            <p className="text-white/50 text-[12px]">Senior Lecturer, Stanford Online</p>
          </div>
        </div>
      </div>
    </div>
  );
}
