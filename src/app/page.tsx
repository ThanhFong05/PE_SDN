import Link from 'next/link';
import Header from '@/components/Header';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BookOpen, Tag, Clock, Bookmark, Sparkles } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fffaf5] text-[#1c1917]">
      <Header />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-14 sm:py-20 flex flex-col items-center text-center">
        {/* Sanctuary Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f5ebe0] text-[#7c4422] text-xs font-semibold mb-6 shadow-xs">
          <Bookmark className="w-3.5 h-3.5 fill-[#7c4422]" />
          <span>Your quiet reading sanctuary</span>
        </div>

        {/* Main Title (Mandatory testid: home-title, exact text: ReadLog) */}
        <h1
          data-testid="home-title"
          className="text-5xl sm:text-7xl font-extrabold tracking-tight text-[#1c1917] mb-5"
        >
          ReadLog
        </h1>

        {/* Subtitle */}
        <p className="max-w-xl text-base sm:text-lg text-[#6b5e52] mb-8 leading-relaxed font-normal">
          Track every reading session, see which genres you love, and watch your minutes add up.
        </p>

        {/* Get started CTA button */}
        <div className="flex flex-col items-center mb-16">
          <Link href="/reading-logs">
            <button
              type="button"
              className="px-8 py-3.5 rounded-2xl bg-[#f97316] hover:bg-[#ea580c] text-white font-bold text-base shadow-sm hover:shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              Get started
            </button>
          </Link>
          <p className="text-xs text-[#a89c8f] mt-3 font-medium">
            Free for avid readers &bull; No credit card required
          </p>
        </div>

        {/* 3 Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left max-w-5xl">
          {/* Card 1: Log every session */}
          <Card className="bg-white rounded-3xl p-6 sm:p-7 border border-[#f0e8de] shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#faede1] flex items-center justify-center text-[#c2410c] mb-5">
                <BookOpen className="w-5 h-5" />
              </div>
              <CardTitle className="text-xl font-bold text-[#1c1917] mb-2">
                Log every session
              </CardTitle>
              <CardDescription className="text-sm text-[#786c5e] leading-normal">
                Record the book, minutes, genre and date.
              </CardDescription>
            </div>

            {/* Widget preview: Atomic Habits log row */}
            <div className="mt-8 rounded-xl bg-[#fff7ef] border border-[#fdecdb] p-3 flex items-center justify-between text-xs text-[#574c42]">
              <span className="font-semibold flex items-center gap-1.5 truncate mr-2">
                <BookOpen className="w-3.5 h-3.5 text-[#c2410c] shrink-0" />
                Atomic Habits
              </span>
              <span className="text-[#8c7b6d] shrink-0 font-medium mr-2">45m</span>
              <span className="shrink-0 text-[#8c4b18] bg-[#fdecdb] px-2 py-0.5 rounded text-[11px] font-medium">
                Non-Fiction
              </span>
            </div>
          </Card>

          {/* Card 2: Sort by genre */}
          <Card className="bg-white rounded-3xl p-6 sm:p-7 border border-[#f0e8de] shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#faede1] flex items-center justify-center text-[#c2410c] mb-5">
                <Tag className="w-5 h-5" />
              </div>
              <CardTitle className="text-xl font-bold text-[#1c1917] mb-2">
                Sort by genre
              </CardTitle>
              <CardDescription className="text-sm text-[#786c5e] leading-normal">
                Filter and search your reading history instantly.
              </CardDescription>
            </div>

            {/* Widget preview: Genre pill badges */}
            <div className="mt-8 rounded-xl bg-[#fff7ef] border border-[#fdecdb] p-3 flex items-center justify-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[#fdecdb] text-[#8c4b18] font-semibold text-[11px]">
                Sci-Fi
              </span>
              <span className="px-3 py-1 rounded-full bg-[#fdecdb] text-[#8c4b18] font-semibold text-[11px]">
                Biography
              </span>
              <span className="px-3 py-1 rounded-full bg-[#fdecdb] text-[#8c4b18] font-semibold text-[11px]">
                Fiction
              </span>
            </div>
          </Card>

          {/* Card 3: See minutes read */}
          <Card className="bg-white rounded-3xl p-6 sm:p-7 border border-[#f0e8de] shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#faede1] flex items-center justify-center text-[#c2410c] mb-5">
                <Clock className="w-5 h-5" />
              </div>
              <CardTitle className="text-xl font-bold text-[#1c1917] mb-2">
                See minutes read
              </CardTitle>
              <CardDescription className="text-sm text-[#786c5e] leading-normal">
                Live summary of minutes read by genre.
              </CardDescription>
            </div>

            {/* Widget preview: Genre progress bars */}
            <div className="mt-8 rounded-xl bg-[#fff7ef] border border-[#fdecdb] p-3 space-y-2.5 text-xs">
              <div>
                <div className="flex justify-between text-[#574c42] font-semibold mb-1 text-[11px]">
                  <span>Fiction</span>
                  <span>320m</span>
                </div>
                <div className="w-full h-1.5 bg-[#fdecdb] rounded-full overflow-hidden">
                  <div className="h-full bg-[#f97316] rounded-full w-[75%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[#574c42] font-semibold mb-1 text-[11px]">
                  <span>Non-Fiction</span>
                  <span>180m</span>
                </div>
                <div className="w-full h-1.5 bg-[#fdecdb] rounded-full overflow-hidden">
                  <div className="h-full bg-[#a88265] rounded-full w-[45%]" />
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Subtle decorative quote divider */}
        <div className="w-full max-w-xl my-16 flex items-center gap-4 text-xs text-[#a89c8f]">
          <div className="h-px bg-[#ede2d5] flex-1" />
          <span className="flex items-center gap-1.5 italic font-medium">
            <Sparkles className="w-3.5 h-3.5 text-[#f97316]" />
            Crafted for calm and mindful reading journeys
          </span>
          <div className="h-px bg-[#ede2d5] flex-1" />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#f0e8de] py-6 px-4 sm:px-8 bg-[#fbf6ed] text-xs text-[#8c7e70]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="font-semibold text-[#1c1917]">
            ReadLog <span className="font-normal text-[#8c7e70]">&mdash; Crafted for book lovers</span>
          </div>
          <div>
            &copy; 2026 ReadLog Inc. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
