'use client';

import React, { useState } from 'react';
import { Copy, Check, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { PortalRole } from './AuthScreen';

const DEMO_CREDENTIALS = {
  instructor: { role: 'Instructor', email: 'instructor@commio.io', password: 'Teach@2026' },
  manager: { role: 'Hiring manager', email: 'manager@commio.io', password: 'Hire@2026' },
};

interface DemoCredentialsProps {
  role: PortalRole;
  onUse: (email: string, password: string) => void;
}

export default function DemoCredentials({ role, onUse }: DemoCredentialsProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const cred = DEMO_CREDENTIALS[role];

  const copyToClipboard = async (field: 'email' | 'password', value: string) => {
    await navigator.clipboard.writeText(value);
    setCopiedField(field);
    toast.success(`${field === 'email' ? 'Email' : 'Password'} copied`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="mt-6 rounded-xl border border-border/80 bg-card overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/30 group">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-muted/40">
        <div className="flex items-center gap-1.5">
          <Sparkles size={13} className="text-primary animate-pulse" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Sandbox credentials
          </span>
        </div>
        <button
          type="button"
          onClick={() => onUse(cred.email, cred.password)}
          className="inline-flex items-center gap-1 text-[12px] font-semibold text-primary hover:text-accent transition-colors hover:scale-105 active:scale-95"
        >
          Auto-fill
        </button>
      </div>

      <div className="px-4 py-3 space-y-2">
        {[
          { label: 'Email', field: 'email' as const, value: cred.email },
          { label: 'Password', field: 'password' as const, value: cred.password },
        ].map(({ label, field, value }) => (
          <div key={`cred-${field}`} className="flex items-center justify-between gap-3 p-1.5 rounded-lg hover:bg-muted/40 transition-colors">
            <span className="text-[12px] font-medium text-muted-foreground w-16 flex-shrink-0">{label}</span>
            <span className="font-mono text-[12px] text-foreground flex-1 truncate select-all">
              {value}
            </span>
            <button
              type="button"
              onClick={() => copyToClipboard(field, value)}
              className="flex-shrink-0 p-1.5 rounded-md hover:bg-muted transition-all duration-200 text-muted-foreground hover:text-foreground hover:scale-110 active:scale-90"
              aria-label={`Copy ${label}`}
            >
              {copiedField === field ? (
                <Check size={13} className="text-positive animate-bounce-in" />
              ) : (
                <Copy size={13} />
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
