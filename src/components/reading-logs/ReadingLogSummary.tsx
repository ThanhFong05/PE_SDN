'use client';

import { useReadingLogs } from '@/context/ReadingLogsContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart2, BookOpen, Clock, Star, Flame } from 'lucide-react';

const GENRE_COLORS: Record<string, { bg: string; text: string; bar: string }> = {
  Fiction: { bg: 'bg-rose-50', text: 'text-rose-700', bar: 'bg-rose-500' },
  'Non-Fiction': { bg: 'bg-amber-50', text: 'text-amber-800', bar: 'bg-amber-500' },
  'Sci-Fi': { bg: 'bg-indigo-50', text: 'text-indigo-700', bar: 'bg-indigo-500' },
  Biography: { bg: 'bg-emerald-50', text: 'text-emerald-800', bar: 'bg-emerald-500' },
  Other: { bg: 'bg-stone-100', text: 'text-stone-700', bar: 'bg-stone-500' },
};

export default function ReadingLogSummary() {
  const { summary } = useReadingLogs();

  return (
    <Card className="bg-white/95 backdrop-blur border-[#ebdccd] shadow-md shadow-amber-950/5 rounded-2xl overflow-hidden">
      <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500" />

      <CardHeader className="p-5 pb-3 border-b border-[#f5ece1]">
        <CardTitle className="text-base sm:text-lg font-bold text-[#2b2520] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange-50 border border-orange-200/80 flex items-center justify-center text-[#ea580c]">
              <BarChart2 className="w-4 h-4 stroke-[2.3]" />
            </div>
            <span>Reading Summary</span>
          </div>

          <div className="flex items-center gap-1 text-[11px] font-bold text-[#ea580c] bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200/60">
            <Flame className="w-3 h-3 fill-orange-500" />
            <span>Live Stats</span>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-5 space-y-5">
        {/* Metric Cards */}
        <div className="grid grid-cols-3 gap-2.5 text-center">
          {/* Total Sessions */}
          <div className="p-3 rounded-xl bg-gradient-to-b from-[#fdfbf7] to-[#f7efe3] border border-[#ebdccd] shadow-2xs">
            <div className="w-7 h-7 rounded-lg bg-white border border-[#ebdccd] flex items-center justify-center text-[#c2410c] mx-auto mb-1.5 shadow-2xs">
              <BookOpen className="w-3.5 h-3.5" />
            </div>
            <div
              data-testid="reading-log-count"
              className="text-2xl font-black text-[#2b2520] leading-none mb-1 font-serif"
            >
              {summary.count}
            </div>
            <div className="text-[11px] font-bold text-[#786c5e] uppercase tracking-wider">
              Sessions
            </div>
          </div>

          {/* Favorites */}
          <div className="p-3 rounded-xl bg-gradient-to-b from-[#fdfbf7] to-[#f7efe3] border border-[#ebdccd] shadow-2xs">
            <div className="w-7 h-7 rounded-lg bg-white border border-[#ebdccd] flex items-center justify-center text-amber-500 mx-auto mb-1.5 shadow-2xs">
              <Star className="w-3.5 h-3.5 fill-amber-500" />
            </div>
            <div
              data-testid="favorite-count"
              className="text-2xl font-black text-[#2b2520] leading-none mb-1 font-serif"
            >
              {summary.favoriteCount}
            </div>
            <div className="text-[11px] font-bold text-[#786c5e] uppercase tracking-wider">
              Favorites
            </div>
          </div>

          {/* Total Minutes */}
          <div className="p-3 rounded-xl bg-gradient-to-b from-[#fdfbf7] to-[#f7efe3] border border-[#ebdccd] shadow-2xs">
            <div className="w-7 h-7 rounded-lg bg-white border border-[#ebdccd] flex items-center justify-center text-[#ea580c] mx-auto mb-1.5 shadow-2xs">
              <Clock className="w-3.5 h-3.5" />
            </div>
            <div
              data-testid="total-minutes"
              className="text-2xl font-black text-[#ea580c] leading-none mb-1 font-serif"
            >
              {summary.totalMinutes}
            </div>
            <div className="text-[11px] font-bold text-[#786c5e] uppercase tracking-wider">
              Total Mins
            </div>
          </div>
        </div>

        {/* Minutes by Genre Breakdown */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#9a8b7a]">
              Breakdown by Genre
            </h4>
            {summary.totalMinutes > 0 && (
              <span className="text-[11px] text-[#786c5e] font-semibold">
                Ranked by minutes
              </span>
            )}
          </div>

          <div
            data-testid="genre-breakdown"
            className="space-y-2.5"
          >
            {summary.breakdown && summary.breakdown.length > 0 ? (
              summary.breakdown.map((item) => {
                const color = GENRE_COLORS[item.genre] || GENRE_COLORS.Other;
                const percentage =
                  summary.totalMinutes > 0
                    ? Math.round((item.total / summary.totalMinutes) * 100)
                    : 0;

                return (
                  <div
                    key={item.genre}
                    data-testid="breakdown-row"
                    className="p-2.5 rounded-xl bg-[#faf6f0] border border-[#ebdccd] hover:border-[#dfd0bf] transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span
                        data-testid="breakdown-name"
                        className="font-bold text-xs sm:text-sm text-[#2b2520]"
                      >
                        {item.genre}
                      </span>

                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-[#786c5e]">
                          <span data-testid="breakdown-count" className="font-bold text-[#423528]">
                            {item.count}
                          </span>{' '}
                          {item.count === 1 ? 'log' : 'logs'}
                        </span>

                        <span className="inline-flex items-center font-extrabold text-[#ea580c] bg-white px-2 py-0.5 rounded-md border border-[#ebdccd]">
                          <span data-testid="breakdown-total">
                            {item.total}
                          </span>{' '}
                          m ({percentage}%)
                        </span>
                      </div>
                    </div>

                    {/* Proportional visual progress bar */}
                    <div className="w-full h-1.5 rounded-full bg-[#ede2d4] overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${color.bar}`}
                        style={{ width: `${Math.max(percentage, 5)}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="rounded-xl border border-dashed border-[#dfd0bf] p-5 text-center text-xs text-[#9a8b7a] italic bg-[#fcf9f5]">
                No reading breakdown available yet
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
