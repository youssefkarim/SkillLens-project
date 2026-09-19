import React from 'react';

interface LogoProps {
  size?: number;
  variant?: 'dark' | 'light';
  className?: string;
}

export default function Logo({ size = 28, variant = 'dark', className = '' }: LogoProps) {
  const textColor = variant === 'light' ? 'text-white' : 'text-foreground';
  const markBg = variant === 'light' ? 'bg-white/15' : 'bg-primary';
  const markColor = variant === 'light' ? 'text-white' : 'text-primary-foreground';

  return (
    <div className={`flex items-center gap-2.5 group ${className}`}>
      <div
        className={`flex items-center justify-center rounded-lg ${markBg} flex-shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-glow`}
        style={{ width: size, height: size }}
      >
        <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 24 24" fill="none">
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" className={markColor} />
          <line x1="16.2" y1="16.2" x2="21" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={markColor} />
        </svg>
      </div>
      <span className={`font-bold tracking-tight ${textColor} transition-all duration-300 group-hover:tracking-normal`} style={{ fontSize: size * 0.6 }}>
        Commio
      </span>
    </div>
  );
}
