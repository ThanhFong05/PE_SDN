'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/Header';
import ReadingLogForm from '@/components/reading-logs/ReadingLogForm';
import ReadingLogFilters from '@/components/reading-logs/ReadingLogFilters';
import ReadingLogSummary from '@/components/reading-logs/ReadingLogSummary';
import ReadingLogList from '@/components/reading-logs/ReadingLogList';

export default function ReadingLogsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  // While checking auth, or if not logged in: render null (no flash of content, no wrong redirect)
  if (loading || !user) {
    return null;
  }

  return (
    <div
      data-testid="reading-logs-page"
      className="min-h-screen flex flex-col bg-[#fdfbf7]"
    >
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#2d231b]">
            My Reading Sessions
          </h1>
          <p className="text-sm text-[#786c5e] mt-1">
            Log, filter, and review all your reading sessions in one place.
          </p>
        </div>

        {/* Filters and search box */}
        <ReadingLogFilters />

        {/* 2-column layout: Form & Summary on left, List on right (stacked on mobile) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-5 xl:col-span-4 space-y-6">
            <ReadingLogForm />
            <ReadingLogSummary />
          </div>

          <div className="lg:col-span-7 xl:col-span-8 min-w-0">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-[#2d231b]">
                Reading History
              </h2>
            </div>
            <ReadingLogList />
          </div>
        </div>
      </main>

      <footer className="border-t border-[#ede3d4] py-6 text-center text-sm text-[#968776] bg-[#fbf7f0] mt-12">
        ReadLog &copy; 2026. Practical Exam SDN302.
      </footer>
    </div>
  );
}
