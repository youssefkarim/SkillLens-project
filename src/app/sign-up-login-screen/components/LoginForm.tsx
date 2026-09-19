'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { PortalRole } from './AuthScreen';

interface LoginFormData {
  email: string;
  password: string;
  remember: boolean;
}

interface LoginFormProps {
  role: PortalRole;
  prefillEmail?: string;
  prefillPassword?: string;
}

const DEMO_CREDENTIALS = {
  instructor: { email: 'instructor@commio.io', password: 'Teach@2026' },
  manager: { email: 'manager@commio.io', password: 'Hire@2026' },
};

export default function LoginForm({ role, prefillEmail, prefillPassword }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm<LoginFormData>({ defaultValues: { remember: false } });

  useEffect(() => {
    if (prefillEmail) setValue('email', prefillEmail);
    if (prefillPassword) setValue('password', prefillPassword);
  }, [prefillEmail, prefillPassword, setValue]);

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    // BACKEND INTEGRATION: POST /api/auth/login { email, password, role }
    await new Promise((r) => setTimeout(r, 1000));

    const demo = DEMO_CREDENTIALS[role];
    const isDemoEmail = data.email === demo.email || data.email === demo.email.replace('commio.io', 'skilllens.io');
    const isCustomLogin = data.email.includes('@') && data.password.length >= 6;

    if (isDemoEmail || isCustomLogin) {
      toast.success('Signed in. Opening your workspace…');
      await new Promise((r) => setTimeout(r, 500));
      if (role === 'instructor') {
        router.push('/instructor-video-analysis');
      } else {
        router.push('/interview-session');
      }
    } else {
      setIsLoading(false);
      setError('email', {
        message: 'Invalid credentials. Click "Auto-fill" below or enter a valid email & password.',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {/* Email */}
      <div>
        <label htmlFor="login-email" className="block text-sm font-medium text-foreground mb-1.5">
          Email address
        </label>
        <input
          id="login-email"
          type="email"
          placeholder="name@institution.edu"
          className="input-field"
          {...register('email', {
            required: 'Email is required',
            pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' },
          })}
        />
        {errors.email && (
          <p className="mt-1.5 text-xs text-negative font-medium">{errors.email.message}</p>
        )}
      </div>

      {/* Password */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label htmlFor="login-password" className="block text-sm font-medium text-foreground">
            Password
          </label>
          <a href="#" className="text-xs text-primary font-medium hover:underline">
            Forgot password?
          </a>
        </div>
        <div className="relative">
          <input
            id="login-password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            className="input-field pr-11"
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 6, message: 'Password must be at least 6 characters' },
            })}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {errors.password && (
          <p className="mt-1.5 text-xs text-negative font-medium">{errors.password.message}</p>
        )}
      </div>

      {/* Remember me */}
      <div className="flex items-center gap-2.5">
        <input
          id="remember"
          type="checkbox"
          className="w-4 h-4 rounded border-border accent-primary cursor-pointer"
          {...register('remember')}
        />
        <label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer select-none">
          Stay signed in on this device
        </label>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading}
        className="btn-primary w-full mt-2 h-11"
      >
        {isLoading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            <span>Signing in…</span>
          </>
        ) : (
          <span>Continue</span>
        )}
      </button>
    </form>
  );
}
