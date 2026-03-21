import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#060816',
        foreground: '#f8fafc',
        card: '#0c1124',
        border: '#1f2940',
        muted: '#94a3b8',
        primary: '#60a5fa',
        accent: '#1d4ed8',
        success: '#22c55e',
        warning: '#f59e0b',
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(96,165,250,0.15), 0 12px 60px rgba(15,23,42,0.45)',
      },
      backgroundImage: {
        grid: 'linear-gradient(rgba(148, 163, 184, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(148, 163, 184, 0.08) 1px, transparent 1px)',
      },
    },
  },
  plugins: [],
};

export default config;
