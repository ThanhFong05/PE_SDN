'use client';

import React from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { ReadingLogsProvider } from '@/context/ReadingLogsContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ReadingLogsProvider>{children}</ReadingLogsProvider>
    </AuthProvider>
  );
}

