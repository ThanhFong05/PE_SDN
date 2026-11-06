import Link from 'next/link';
import Header from '@/components/Header';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookMarked, Layers, BarChart3, ArrowRight } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fdfbf7]">
      <Header />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-20 flex flex-col items-center text-center">
        {/* Hero Section */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#fceddf] border border-[#f7d6be] text-[#c2410c] text-xs font-semibold mb-6">
          <BookMarked className="w-3.5 h-3.5" />
          <span>Your Personal Reading Companion</span>
        </div>

        <h1
          data-testid="home-title"
          className="text-4xl sm:text-6xl font-extrabold tracking-tight text-[#2d231b] mb-4"
        >
          ReadLog
        </h1>

        <p className="max-w-2xl text-lg sm:text-xl text-[#786c5e] mb-8 leading-relaxed">
          Track every book, log your reading minutes, organize by genre, and discover your reading habits through insightful summaries.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
          <Link href="/reading-logs">
            <Button
              size="lg"
              className="bg-[#ea580c] hover:bg-[#c2410c] text-white font-semibold px-6 shadow-md shadow-orange-500/20 flex items-center gap-2"
            >
              <span>Go to Reading Logs</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/register">
            <Button
              variant="outline"
              size="lg"
              className="border-[#e5d9c8] text-[#44382d] hover:bg-[#f5efe6] font-semibold px-6"
            >
              Create Free Account
            </Button>
          </Link>
        </div>

        {/* Feature Cards (At least three feature cards) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left">
          <Card className="bg-[#fffdfa] border-[#ede3d4] shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="w-10 h-10 rounded-lg bg-[#fff1e7] flex items-center justify-center text-[#ea580c] mb-3">
                <BookMarked className="w-5 h-5" />
              </div>
              <CardTitle className="text-xl font-bold text-[#2d231b]">
                Log every session
              </CardTitle>
              <CardDescription className="text-[#786c5e] text-sm mt-1">
                Record the book title, minutes spent reading, session notes, and date with zero friction.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-[#fffdfa] border-[#ede3d4] shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="w-10 h-10 rounded-lg bg-[#fff1e7] flex items-center justify-center text-[#ea580c] mb-3">
                <Layers className="w-5 h-5" />
              </div>
              <CardTitle className="text-xl font-bold text-[#2d231b]">
                Sort by genre
              </CardTitle>
              <CardDescription className="text-[#786c5e] text-sm mt-1">
                Filter instantly across Fiction, Non-Fiction, Sci-Fi, Biography, or Other to find your favorites.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-[#fffdfa] border-[#ede3d4] shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="w-10 h-10 rounded-lg bg-[#fff1e7] flex items-center justify-center text-[#ea580c] mb-3">
                <BarChart3 className="w-5 h-5" />
              </div>
              <CardTitle className="text-xl font-bold text-[#2d231b]">
                See minutes read
              </CardTitle>
              <CardDescription className="text-[#786c5e] text-sm mt-1">
                Get real-time breakdown stats of total reading time and favorite sessions broken down by genre.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </main>

      <footer className="border-t border-[#ede3d4] py-6 text-center text-sm text-[#968776] bg-[#fbf7f0]">
        ReadLog &copy; 2026. Practical Exam SDN302.
      </footer>
    </div>
  );
}
