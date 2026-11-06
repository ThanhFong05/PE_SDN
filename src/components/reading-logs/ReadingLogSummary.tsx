'use client';

import { useReadingLogs } from '@/context/ReadingLogsContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart2, BookOpen, Clock, Star } from 'lucide-react';

export default function ReadingLogSummary() {
  const { summary } = useReadingLogs();

  return (
    <Card className="bg-[#fffdfa] border-[#ede3d4] shadow-sm">
      <CardHeader className="pb-3 border-b border-[#f5efe6]">
        <CardTitle className="text-lg font-bold text-[#2d231b] flex items-center gap-2">
          <BarChart2 className="w-5 h-5 text-[#ea580c]" />
          <span>Reading Summary</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-4 space-y-4">
        {/* Metric Cards */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2.5 rounded-lg bg-[#fdf8f2] border border-[#f5e6d6]">
            <div className="flex items-center justify-center text-[#c2410c] mb-1">
              <BookOpen className="w-4 h-4" />
            </div>
            <div
              data-testid="reading-log-count"
              className="text-xl sm:text-2xl font-extrabold text-[#2d231b]"
            >
              {summary.count}
            </div>
            <div className="text-[11px] font-medium text-[#786c5e]">Sessions</div>
          </div>

          <div className="p-2.5 rounded-lg bg-[#fdf8f2] border border-[#f5e6d6]">
            <div className="flex items-center justify-center text-amber-500 mb-1">
              <Star className="w-4 h-4 fill-amber-500" />
            </div>
            <div
              data-testid="favorite-count"
              className="text-xl sm:text-2xl font-extrabold text-[#2d231b]"
            >
              {summary.favoriteCount}
            </div>
            <div className="text-[11px] font-medium text-[#786c5e]">Favorites</div>
          </div>

          <div className="p-2.5 rounded-lg bg-[#fdf8f2] border border-[#f5e6d6]">
            <div className="flex items-center justify-center text-[#ea580c] mb-1">
              <Clock className="w-4 h-4" />
            </div>
            <div
              data-testid="total-minutes"
              className="text-xl sm:text-2xl font-extrabold text-[#2d231b]"
            >
              {summary.totalMinutes}
            </div>
            <div className="text-[11px] font-medium text-[#786c5e]">Total Mins</div>
          </div>
        </div>

        {/* Genre Breakdown */}
        <div className="pt-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#968776] mb-2">
            Minutes by Genre
          </h4>

          <div
            data-testid="genre-breakdown"
            className="space-y-2"
          >
            {summary.breakdown && summary.breakdown.length > 0 ? (
              summary.breakdown.map((item) => (
                <div
                  key={item.genre}
                  data-testid="breakdown-row"
                  className="flex items-center justify-between p-2 rounded-md bg-[#fcf9f4] border border-[#eee5d8] text-sm"
                >
                  <span
                    data-testid="breakdown-name"
                    className="font-semibold text-[#2d231b]"
                  >
                    {item.genre}
                  </span>

                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-[#786c5e]">
                      <span data-testid="breakdown-count" className="font-semibold text-[#44382d]">
                        {item.count}
                      </span>{' '}
                      {item.count === 1 ? 'session' : 'sessions'}
                    </span>

                    <span className="inline-flex items-center gap-1 font-bold text-[#c2410c] bg-[#ffede0] px-2 py-0.5 rounded">
                      <span data-testid="breakdown-total">
                        {item.total}
                      </span>{' '}
                      mins
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-[#968776] italic py-2 text-center">
                No breakdown data available
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
