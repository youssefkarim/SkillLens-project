'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Video, Users, LogOut } from 'lucide-react';
import Logo from './Logo';

interface AppLayoutProps {
  role: 'instructor' | 'manager';
  children: React.ReactNode;
}

const navItems = [
  { href: '/instructor-video-analysis', label: 'Video Analysis', icon: Video },
  { href: '/interview-session', label: 'Interview Session', icon: Users },
];

export default function AppLayout({ role, children }: AppLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className="w-60 border-r border-border bg-card hidden lg:flex lg:flex-col flex-shrink-0 animate-slide-in-left">
        <div className="h-16 flex items-center px-5 border-b border-border">
          <Logo size={26} />
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item, idx) => {
            const isActive = pathname?.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ease-smooth-out ${
                  isActive
                    ? 'bg-secondary text-primary shadow-sm'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground hover:translate-x-1'
                }`}
                style={{ animationDelay: `${idx * 80}ms` }}
              >
                <span className={`transition-transform duration-200 ${!isActive ? 'group-hover:scale-110' : ''}`}>
                  <item.icon size={17} />
                </span>
                {item.label}
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary animate-scale-in" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-border">
          <div className="flex items-center gap-2.5 px-3 py-2 mb-1 group">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0 transition-all duration-300 group-hover:bg-primary/20 group-hover:scale-110">
              {role === 'instructor' ? 'IN' : 'HM'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-foreground truncate">
                {role === 'instructor' ? 'Instructor' : 'Hiring Manager'}
              </p>
              <p className="text-[11px] text-muted-foreground">Sandbox account</p>
            </div>
          </div>
          <Link
            href="/sign-up-login-screen"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-muted-foreground hover:bg-negative/10 hover:text-negative transition-all duration-200"
          >
            <LogOut size={15} className="transition-transform duration-200 hover:rotate-12" />
            Sign out
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="h-16 border-b border-border bg-card flex items-center justify-between px-5 lg:hidden flex-shrink-0">
          <Logo size={24} />
        </header>
        <main className="flex-1 animate-fade-in">{children}</main>
      </div>
    </div>
  );
}
