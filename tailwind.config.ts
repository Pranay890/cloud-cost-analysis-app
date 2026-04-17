import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#F8FAFC',
        foreground: '#0F172A',
        card: '#FFFFFF',
        'card-alt': '#FFFFFF',
        border: '#E2E8F0',
        muted: '#475569',
        primary: '#2563EB',
        'primary-light': '#DBEAFE',
        'primary-hover': '#1D4ED8',
        accent: '#16A34A',
        'accent-light': '#DCFCE7',
        secondary: '#38BDF8',
        'secondary-light': '#38BDF8',
        success: '#16A34A',
        'success-light': '#DCFCE7',
        warning: '#F59E0B',
        'warning-light': '#FEF3C7',
        error: '#EF4444',
        'error-light': '#FEE2E2',
      },
      boxShadow: {
        'sm': '0 1px 2px rgba(0, 0, 0, 0.05)',
        'card': '0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04)',
        'card-hover': '0 10px 25px -3px rgba(0, 0, 0, 0.12), 0 4px 12px -2px rgba(0, 0, 0, 0.08)',
        'md': '0 4px 12px rgba(0, 0, 0, 0.1)',
        'lg': '0 10px 30px rgba(0, 0, 0, 0.12)',
        'xl': '0 20px 40px rgba(0, 0, 0, 0.15)',
        'premium': '0 12px 32px rgba(0, 0, 0, 0.14)',
        'glow': '0 0 0 4px rgba(37, 99, 235, 0.12)',
      },
      backgroundImage: {
        gradient: 'linear-gradient(135deg, #F8FAFC 0%, #FFFFFF 100%)',
      },
    },
  },
  plugins: [],
};

export default config;
