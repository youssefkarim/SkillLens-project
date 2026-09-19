/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  darkMode: 'class',
  theme: {
    container: { center: true, padding: '1rem' },
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        positive: 'var(--positive)',
        negative: 'var(--negative)',
        warning: 'var(--warning)',
        info: 'var(--info)',
      },
      borderRadius: {
        DEFAULT: 'var(--radius)',
        sm: 'calc(var(--radius) - 4px)',
        md: 'var(--radius)',
        lg: 'calc(var(--radius) + 2px)',
        xl: 'calc(var(--radius) + 6px)',
        '2xl': 'calc(var(--radius) + 12px)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        mono: ['var(--font-ibm-plex-mono)', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(15, 23, 42, 0.04), 0 1px 1px rgba(15, 23, 42, 0.03)',
        elevated: '0 8px 24px rgba(15, 23, 42, 0.08), 0 2px 6px rgba(15, 23, 42, 0.04)',
        modal: '0 24px 48px rgba(15, 23, 42, 0.16)',
        glow: '0 0 20px rgba(30, 64, 175, 0.15)',
        'glow-accent': '0 0 20px rgba(124, 58, 237, 0.15)',
      },
      animation: {
        'fade-in': 'fadeIn 400ms ease forwards',
        'slide-up': 'slideUp 400ms ease forwards',
        'slide-down': 'slideDown 400ms ease forwards',
        'slide-in-left': 'slideInLeft 400ms cubic-bezier(0.33,1,0.68,1) forwards',
        'slide-in-right': 'slideInRight 400ms cubic-bezier(0.33,1,0.68,1) forwards',
        'scale-in': 'scaleIn 350ms cubic-bezier(0.34,1.56,0.64,1) forwards',
        'bounce-in': 'bounceIn 600ms cubic-bezier(0.34,1.56,0.64,1) forwards',
        'live-pulse': 'livePulse 1.5s ease-in-out infinite',
        'pulse-highlight': 'pulseHighlight 600ms ease',
        'float': 'float 3s ease-in-out infinite',
        'shimmer': 'shimmer 1.5s ease-in-out infinite',
        'gradient-shift': 'gradientShift 3s ease infinite',
      },
      transitionTimingFunction: {
        'bounce-out': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'smooth-out': 'cubic-bezier(0.33, 1, 0.68, 1)',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};