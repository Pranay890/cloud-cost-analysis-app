import './globals.css';
import type { Metadata } from 'next';
import { AuthProvider } from '@/lib/auth-context';
import { AnalyticsProvider } from '@/lib/analytics-context';

export const metadata: Metadata = {
  title: 'Cloud Cost Analysis & Optimization Platform',
  description: 'Production-ready demo platform for cloud billing analytics and AI-powered cost optimization.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <AnalyticsProvider>{children}</AnalyticsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
