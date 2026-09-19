'use client';

import React, { useState } from 'react';
import RoleToggle from './RoleToggle';
import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';
import BrandPanel from './BrandPanel';
import DemoCredentials from './DemoCredentials';
import Logo from '@/components/Logo';

export type PortalRole = 'instructor' | 'manager';
export type AuthMode = 'login' | 'signup';

export default function AuthScreen() {
  const [role, setRole] = useState<PortalRole>('instructor');
  const [mode, setMode] = useState<AuthMode>('login');
  const [prefillEmail, setPrefillEmail] = useState('');
  const [prefillPassword, setPrefillPassword] = useState('');

  const handleUseDemoCredentials = (email: string, password: string) => {
    setPrefillEmail(email);
    setPrefillPassword(password);
  };

  return (
    <div className="min-h-screen flex bg-background">
      <BrandPanel role={role} />

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 lg:px-16 xl:px-24 min-h-screen overflow-y-auto">
        <div className="w-full max-w-[420px] animate-fade-in">
          <div className="mb-10 lg:hidden">
            <Logo size={32} />
          </div>

          <div className="mb-8 animate-slide-up">
            <h1 className="text-[1.5rem] font-semibold tracking-tight text-foreground mb-1.5">
              {mode === 'login' ? 'Sign in' : 'Create an account'}
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {mode === 'login'
                ? 'Access your institution workspace with your work email.'
                : 'Set up a Commio workspace for your institution or hiring team.'}
            </p>
          </div>

          <div className="animate-scale-in" style={{ animationDelay: '100ms' }}>
            <RoleToggle role={role} onChange={setRole} />
          </div>

          <div className="mt-6 animate-fade-in" style={{ animationDelay: '200ms' }}>
            {mode === 'login' ? (
              <LoginForm
                role={role}
                prefillEmail={prefillEmail}
                prefillPassword={prefillPassword}
              />
            ) : (
              <SignUpForm role={role} />
            )}
          </div>

          <p className="mt-6 text-center text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: '300ms' }}>
            {mode === 'login' ? 'Need an account?' : 'Already registered?'}{' '}
            <button
              type="button"
              onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
              className="text-primary font-medium hover-underline transition-colors duration-200 hover:text-accent"
            >
              {mode === 'login' ? 'Request access' : 'Sign in'}
            </button>
          </p>

          {mode === 'login' && (
            <div className="animate-slide-up" style={{ animationDelay: '400ms' }}>
              <DemoCredentials role={role} onUse={handleUseDemoCredentials} />
            </div>
          )}

          <p className="mt-10 text-center text-[12px] text-muted-foreground leading-relaxed animate-fade-in" style={{ animationDelay: '500ms' }}>
            By continuing you agree to the{' '}
            <a href="#" className="text-foreground hover-underline transition-colors duration-200">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-foreground hover-underline transition-colors duration-200">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
