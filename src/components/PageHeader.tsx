import React from 'react';

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export default function PageHeader({ eyebrow, title, description, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 animate-slide-up">
      <div>
        {eyebrow && <p className="section-label mb-1.5 animate-fade-in">{eyebrow}</p>}
        <h1 className="text-2xl font-bold text-foreground tracking-tight text-gradient">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-muted-foreground mt-1.5 max-w-xl animate-fade-in" style={{ animationDelay: '150ms' }}>
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex-shrink-0 animate-scale-in">{actions}</div>}
    </div>
  );
}
