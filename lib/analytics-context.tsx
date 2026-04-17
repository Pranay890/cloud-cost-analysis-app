'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface AnalyticsContextType {
  hasData: boolean;
  setHasData: (value: boolean) => void;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

export function AnalyticsProvider({ children }: { children: ReactNode }) {
  const [hasData, setHasData] = useState(false);

  return (
    <AnalyticsContext.Provider value={{ hasData, setHasData }}>
      {children}
    </AnalyticsContext.Provider>
  );
}

export function useAnalytics() {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalytics must be used within AnalyticsProvider');
  }
  return context;
}
