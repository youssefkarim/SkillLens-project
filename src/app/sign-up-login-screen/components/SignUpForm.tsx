'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Loader2, Check } from 'lucide-react';
import { toast } from 'sonner';
import { PortalRole } from './AuthScreen';

interface SignUpFormData {
  fullName: string;
  organisation: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface SignUpFormProps {
  role: PortalRole;
}

export default function SignUpForm({ role }: SignUpFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignUpFormData>();

  const passwordValue = watch('password');

  const onSubmit = async (_data: SignUpFormData) => {
    setIsLoading(true);
    // BACKEND INTEGRATION: POST /api/auth/register { ...data, role }
    await new Promise((r) => setTimeout(r, 1600));
    setIsLoading(false);
    setSuccess(true);
    toast.success('Account created! Check your email to verify your address.');
  };

  if (success) {
    return (
      <div className="text-center py-8 fade-in">
        <div className="w-12 h-12 rounded-full bg-[var(--positive-bg)] border border-positive/20 flex items-center justify-center mx-auto mb-4">
          <Check size={20} className="text-positive" />
        </div>
        <h3 className="font-semibold text-foreground text-lg mb-2">Verify your email</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">
          A confirmation link has been sent. After verification you can sign in to the{' '}
          {role === 'instructor' ? 'instruction' : 'hiring'} workspace.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {/* Full name */}
      <div>
        <label htmlFor="signup-name" className="block text-sm font-medium text-foreground mb-1.5">
          Full name
        </label>
        <input
          id="signup-name"
          type="text"
          placeholder={role === 'instructor' ? 'Dr. Sarah Chen' : 'Alex Petrov'}
          className="input-field"
          {...register('fullName', { required: 'Full name is required' })}
        />
        {errors.fullName && (
          <p className="mt-1.5 text-xs text-negative font-medium">{errors.fullName.message}</p>
        )}
      </div>

      {/* Organisation */}
      <div>
        <label htmlFor="signup-org" className="block text-sm font-medium text-foreground mb-1.5">
          {role === 'instructor' ? 'Institution / School' : 'Company / Organisation'}
        </label>
        <input
          id="signup-org"
          type="text"
          placeholder={role === 'instructor' ? 'MIT Open Learning' : 'Acme Corp'}
          className="input-field"
          {...register('organisation', { required: 'Organisation is required' })}
        />
        {errors.organisation && (
          <p className="mt-1.5 text-xs text-negative font-medium">{errors.organisation.message}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="signup-email" className="block text-sm font-medium text-foreground mb-1.5">
          Work email
        </label>
        <input
          id="signup-email"
          type="email"
          placeholder="you@organisation.com"
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
        <label htmlFor="signup-password" className="block text-sm font-medium text-foreground mb-1.5">
          Password
        </label>
        <p className="text-xs text-muted-foreground mb-1.5">Minimum 8 characters with at least one uppercase letter and number</p>
        <div className="relative">
          <input
            id="signup-password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Create a strong password"
            className="input-field pr-11"
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 8, message: 'At least 8 characters required' },
              pattern: {
                value: /^(?=.*[A-Z])(?=.*\d)/,
                message: 'Must include one uppercase letter and one number',
              },
            })}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {errors.password && (
          <p className="mt-1.5 text-xs text-negative font-medium">{errors.password.message}</p>
        )}
      </div>

      {/* Confirm password */}
      <div>
        <label htmlFor="signup-confirm" className="block text-sm font-medium text-foreground mb-1.5">
          Confirm password
        </label>
        <div className="relative">
          <input
            id="signup-confirm"
            type={showConfirm ? 'text' : 'password'}
            placeholder="Re-enter your password"
            className="input-field pr-11"
            {...register('confirmPassword', {
              required: 'Please confirm your password',
              validate: (v) => v === passwordValue || 'Passwords do not match',
            })}
          />
          <button
            type="button"
            onClick={() => setShowConfirm((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="mt-1.5 text-xs text-negative font-medium">{errors.confirmPassword.message}</p>
        )}
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
            <span>Creating account…</span>
          </>
        ) : (
          <span>Create account</span>
        )}
      </button>
    </form>
  );
}
