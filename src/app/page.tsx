import Link from 'next/link';
import Header from '@/components/Header';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  BookMarked,
  Layers,
  BarChart3,
  ArrowRight,
  Sparkles,
  BookmarkCheck,
  CheckCircle2,
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#faf6f0] relative overflow-hidden">
      {/* Decorative Warm Ambient Glow Background */}
      <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-b from-amber-200/40 via-orange-200/20 to-transparent blur-3xl pointer-events-none -z-10" />

      <Header />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-20 flex flex-col items-center text-center">
        {/* Hero Tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-[#ebdccd] shadow-xs backdrop-blur-sm mb-6">
          <span className="flex h-2 w-2 rounded-full bg-[#ea580c] animate-pulse" />
          <span className="text-xs font-bold text-[#ea580c] uppercase tracking-wider">
            Your Personal Reading Journal
          </span>
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
        </div>

        {/* Hero Heading: Must have home-title with text "ReadLog" */}
        <h1
          data-testid="home-title"
          className="text-5xl sm:text-7xl font-black tracking-tight text-[#2b2520] mb-5 font-serif"
        >
          ReadLog
        </h1>

        <p className="max-w-2xl text-base sm:text-xl text-[#6e5f50] mb-10 leading-relaxed font-normal">
          Track every session, measure reading time, explore favorite genres, and cultivate a consistent, mindful daily reading habit.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3.5 mb-16">
          <Link href="/reading-logs">
            <Button
              size="lg"
              className="h-12 bg-gradient-to-r from-[#ea580c] via-[#f97316] to-[#ea580c] hover:from-[#c2410c] hover:to-[#ea580c] text-white font-bold px-7 rounded-xl shadow-lg shadow-orange-500/25 active:scale-98 transition-all flex items-center gap-2"
            >
              <span>Go to Reading Logs</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>

          <Link href="/register">
            <Button
              variant="outline"
              size="lg"
              className="h-12 bg-white/90 hover:bg-white border-[#dfd0bf] text-[#423528] hover:border-[#ea580c]/50 font-bold px-7 rounded-xl shadow-xs transition-all"
            >
              Create Free Account
            </Button>
          </Link>
        </div>

        {/* Quick Highlights Banner */}
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm font-semibold text-[#827262] mb-16 px-4 py-3 rounded-2xl bg-[#f2e9dc]/50 border border-[#ebdccd]">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#ea580c]" />
            <span>Fast REST API</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#ea580c]" />
            <span>Live Genre Analytics</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#ea580c]" />
            <span>Instant Search & Filters</span>
          </div>
        </div>

        {/* Feature Cards (3 cards per spec) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left">
          {/* Card 1 */}
          <Card className="bg-white/90 backdrop-blur border-[#ebdccd] shadow-sm hover:shadow-md hover:border-[#ea580c]/40 hover:-translate-y-1 transition-all duration-300 rounded-2xl overflow-hidden group">
            <div className="h-1.5 w-full bg-gradient-to-r from-orange-400 to-amber-500" />
            <CardHeader className="p-6">
              <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-200/60 flex items-center justify-center text-[#ea580c] mb-4 group-hover:scale-110 transition-transform">
                <BookmarkCheck className="w-6 h-6 stroke-[2.2]" />
              </div>
              <CardTitle className="text-xl font-bold text-[#2b2520]">
                Log every session
              </CardTitle>
              <CardDescription className="text-[#6e5f50] text-sm mt-2 leading-relaxed">
                Capture book title, minutes read, personal reflections, and date with a single click. Keep an immaculate record of your reading milestones.
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Card 2 */}
          <Card className="bg-white/90 backdrop-blur border-[#ebdccd] shadow-sm hover:shadow-md hover:border-[#ea580c]/40 hover:-translate-y-1 transition-all duration-300 rounded-2xl overflow-hidden group">
            <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 to-yellow-500" />
            <CardHeader className="p-6">
              <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-600 mb-4 group-hover:scale-110 transition-transform">
                <Layers className="w-6 h-6 stroke-[2.2]" />
              </div>
              <CardTitle className="text-xl font-bold text-[#2b2520]">
                Sort by genre
              </CardTitle>
              <CardDescription className="text-[#6e5f50] text-sm mt-2 leading-relaxed">
                Seamlessly segment across Fiction, Non-Fiction, Sci-Fi, Biography, or Other. Combine genre tags with favorite stars and full-text keyword search.
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Card 3 */}
          <Card className="bg-white/90 backdrop-blur border-[#ebdccd] shadow-sm hover:shadow-md hover:border-[#ea580c]/40 hover:-translate-y-1 transition-all duration-300 rounded-2xl overflow-hidden group">
            <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 to-rose-500" />
            <CardHeader className="p-6">
              <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-200/60 flex items-center justify-center text-rose-600 mb-4 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-6 h-6 stroke-[2.2]" />
              </div>
              <CardTitle className="text-xl font-bold text-[#2b2520]">
                See minutes read
              </CardTitle>
              <CardDescription className="text-[#6e5f50] text-sm mt-2 leading-relaxed">
                Watch real-time live summaries compute total time, favorite sessions, and ranked genre minutes breakdowns dynamically as you read.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </main>

      <footer className="border-t border-[#ebdccd] py-6 text-center text-xs sm:text-sm text-[#9a8b7a] bg-[#f5ede1]/60">
        ReadLog &copy; 2026. Practical Exam SDN302.
      </footer>
    </div>
  );
}
