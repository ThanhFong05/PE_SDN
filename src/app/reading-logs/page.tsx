'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/Header';
import ReadingLogForm from '@/components/reading-logs/ReadingLogForm';
import ReadingLogFilters from '@/components/reading-logs/ReadingLogFilters';
import ReadingLogSummary from '@/components/reading-logs/ReadingLogSummary';
import ReadingLogList from '@/components/reading-logs/ReadingLogList';
import { BookOpen } from 'lucide-react';

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
      className="min-h-screen flex flex-col bg-[#faf6f0] relative overflow-hidden"
    >
      {/* Ambient background aura */}
      <div className="absolute top-0 right-0 w-[600px] h-[350px] bg-gradient-to-b from-orange-200/20 via-amber-200/10 to-transparent blur-3xl pointer-events-none -z-10" />

      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Page Heading */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#ea580c] uppercase tracking-wider mb-1">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Personal Library</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#2b2520]">
              My Reading Sessions
            </h1>
            <p className="text-xs sm:text-sm text-[#786c5e] mt-0.5">
              Log, filter, and track your daily reading milestones in one place.
            </p>
          </div>
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
            <div className="flex items-center justify-between mb-3 px-1">
              <h2 className="text-sm sm:text-base font-black text-[#2b2520] uppercase tracking-wider">
                Session Logbook
              </h2>
            </div>
            <ReadingLogList />
          </div>
        </div>
      </main>

      <footer className="border-t border-[#ebdccd] py-6 text-center text-xs text-[#9a8b7a] bg-[#f5ede1]/60 mt-12">
        ReadLog &copy; 2026. Practical Exam SDN302.
      </footer>
    </div>
  );
}
