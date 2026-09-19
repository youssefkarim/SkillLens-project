'use client';

import React from 'react';
import { GraduationCap, Briefcase } from 'lucide-react';
import { PortalRole } from './AuthScreen';

interface RoleToggleProps {
  role: PortalRole;
  onChange: (role: PortalRole) => void;
}

export default function RoleToggle({ role, onChange }: RoleToggleProps) {
  return (
    <div>
      <p className="section-label mb-2.5">Workspace</p>
      <div className="flex gap-1.5 p-1.5 rounded-lg bg-muted border border-border">
        {([
          { id: 'instructor' as const, label: 'Instructor', icon: GraduationCap },
          { id: 'manager' as const, label: 'Hiring manager', icon: Briefcase },
        ]).map((r) => {
          const isActive = role === r.id;
          return (
            <button
              key={`role-${r.id}`}
              type="button"
              onClick={() => onChange(r.id)}
              className={`group flex-1 flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-md text-[13px] font-medium transition-all duration-200 active:scale-95 ${
                isActive
                  ? 'bg-card text-primary shadow-sm border border-border/80 font-semibold scale-[1.02]'
                  : 'text-muted-foreground hover:text-foreground hover:bg-card/40 border border-transparent'
              }`}
            >
              <r.icon 
                size={15} 
                strokeWidth={2}
                className={`transition-transform duration-300 ${isActive ? 'scale-110 text-primary' : 'group-hover:scale-110'}`} 
              />
              <span>{r.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
