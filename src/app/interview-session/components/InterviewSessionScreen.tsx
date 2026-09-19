'use client';

import React, { useState } from 'react';
import PreSessionSetup from './PreSessionSetup';
import LiveInterviewPanel from './LiveInterviewPanel';
import PostInterviewReport from './PostInterviewReport';
import PageHeader from '@/components/PageHeader';

export type SessionState = 'setup' | 'live' | 'complete';

export interface CandidateProfile {
  id: string;
  name: string;
  role: string;
  experience: string;
  email: string;
  linkedIn: string;
  initials: string;
}

export default function InterviewSessionScreen() {
  const [sessionState, setSessionState] = useState<SessionState>('setup');
  const [candidate, setCandidate] = useState<CandidateProfile | null>(null);

  const handleStartSession = (c: CandidateProfile) => {
    setCandidate(c);
    setSessionState('live');
  };

  const handleEndSession = () => {
    setSessionState('complete');
  };

  const handleNewSession = () => {
    setSessionState('setup');
    setCandidate(null);
  };

  const title =
    sessionState === 'setup' ? 'Interview session' :
    sessionState === 'live' ? 'Live interview' :
    'Interview report';

  const description =
    sessionState === 'setup' ? 'Configure candidate details and evaluation parameters before the session begins.' :
    sessionState === 'live' && candidate ? `${candidate.name}  ·  ${candidate.role}` :
    candidate ? `Post-session evaluation for ${candidate.name}` :
    undefined;

  return (
    <div className="px-6 lg:px-8 xl:px-10 py-8 max-w-[1440px] mx-auto">
      <PageHeader
        eyebrow="Talent"
        title={title}
        description={description}
        actions={
          sessionState === 'complete' ? (
            <button onClick={handleNewSession} className="btn-secondary">
              New session
            </button>
          ) : undefined
        }
      />

      {sessionState === 'setup' && (
        <PreSessionSetup onStart={handleStartSession} />
      )}
      {sessionState === 'live' && candidate && (
        <LiveInterviewPanel candidate={candidate} onEnd={handleEndSession} />
      )}
      {sessionState === 'complete' && candidate && (
        <PostInterviewReport candidate={candidate} />
      )}
    </div>
  );
}
