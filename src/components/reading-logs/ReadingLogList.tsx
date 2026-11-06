'use client';

import { useReadingLogs } from '@/context/ReadingLogsContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Trash2, BookOpen, Clock, Calendar, Tag, Quote } from 'lucide-react';

const GENRE_BADGES: Record<string, { bg: string; text: string; border: string; accent: string }> = {
  Fiction: {
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    border: 'border-rose-200/80',
    accent: 'bg-rose-500',
  },
  'Non-Fiction': {
    bg: 'bg-amber-50',
    text: 'text-amber-800',
    border: 'border-amber-200/80',
    accent: 'bg-amber-500',
  },
  'Sci-Fi': {
    bg: 'bg-indigo-50',
    text: 'text-indigo-700',
    border: 'border-indigo-200/80',
    accent: 'bg-indigo-500',
  },
  Biography: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-800',
    border: 'border-emerald-200/80',
    accent: 'bg-emerald-500',
  },
  Other: {
    bg: 'bg-stone-100',
    text: 'text-stone-700',
    border: 'border-stone-200/80',
    accent: 'bg-stone-400',
  },
};

export default function ReadingLogList() {
  const { logs, toggleFavorite, deleteLog } = useReadingLogs();

  if (logs.length === 0) {
    return (
      <div
        data-testid="reading-logs-empty"
        className="rounded-2xl border-2 border-dashed border-[#dfd0bf] p-12 text-center bg-white/70 backdrop-blur shadow-xs"
      >
        <div className="w-16 h-16 rounded-2xl bg-[#faf6f0] border border-[#ebdccd] flex items-center justify-center text-[#b8a795] mx-auto mb-4 shadow-2xs">
          <BookOpen className="w-8 h-8 stroke-[1.8]" />
        </div>
        <h3 className="text-xl font-bold text-[#2b2520]">
          No reading sessions found
        </h3>
        <p className="text-sm text-[#786c5e] mt-2 max-w-sm mx-auto leading-relaxed">
          Start logging your reading time above or adjust your search filter to see matching entries.
        </p>
      </div>
    );
  }

  return (
    <div
      data-testid="reading-log-list"
      className="space-y-3.5"
    >
      {logs.map((log) => {
        const badge = GENRE_BADGES[log.genre] || GENRE_BADGES.Other;

        return (
          <Card
            key={log.id}
            data-testid="reading-log-item"
            className="bg-white/95 backdrop-blur border-[#ebdccd] shadow-xs hover:shadow-md hover:border-[#dfd0bf] transition-all duration-200 rounded-2xl overflow-hidden relative group"
          >
            {/* Color Accent Spine on Left */}
            <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${badge.accent}`} />

            <CardContent className="p-4 sm:p-5 pl-5 sm:pl-6">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  {/* Title & Genre Badge */}
                  <div className="flex items-center gap-2 flex-wrap mb-1.5">
                    <span
                      data-testid="reading-log-title"
                      className="font-bold text-base sm:text-lg text-[#2b2520] tracking-tight break-words group-hover:text-[#ea580c] transition-colors"
                    >
                      {log.bookTitle}
                    </span>
                    <span
                      data-testid="reading-log-genre"
                      className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${badge.bg} ${badge.text} ${badge.border}`}
                    >
                      <Tag className="w-3 h-3" />
                      {log.genre}
                    </span>
                  </div>

                  {/* Optional Note */}
                  {log.note && (
                    <div className="flex items-start gap-2 text-xs text-[#54483c] bg-[#faf6f0] border border-[#ebdccd]/80 p-2.5 rounded-xl my-2.5 italic">
                      <Quote className="w-3.5 h-3.5 shrink-0 text-[#ea580c]/60 mt-0.5" />
                      <span className="leading-relaxed">&ldquo;{log.note}&rdquo;</span>
                    </div>
                  )}

                  {/* Metadata: Minutes & Date */}
                  <div className="flex items-center gap-4 text-xs text-[#786c5e] flex-wrap mt-2">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#faf6f0] border border-[#ebdccd]">
                      <Clock className="w-3.5 h-3.5 text-[#ea580c]" />
                      <span>
                        <span data-testid="reading-log-minutes" className="font-extrabold text-[#2b2520]">
                          {log.minutesRead}
                        </span>{' '}
                        mins
                      </span>
                    </div>

                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#faf6f0] border border-[#ebdccd]">
                      <Calendar className="w-3.5 h-3.5 text-[#a89988]" />
                      <span data-testid="reading-log-date" className="font-bold text-[#54483c]">
                        {log.readOn}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-1.5 shrink-0 pt-0.5">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    aria-pressed={log.favorite ? 'true' : 'false'}
                    data-testid="btn-toggle-favorite"
                    onClick={() => toggleFavorite(log.id, log.favorite)}
                    title={log.favorite ? 'Remove from favorites' : 'Mark as favorite'}
                    className={`h-9 w-9 p-0 rounded-xl transition-all ${
                      log.favorite
                        ? 'text-amber-500 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 shadow-xs'
                        : 'text-[#a89988] hover:text-amber-500 hover:bg-[#faf6f0] border border-transparent'
                    }`}
                  >
                    <Star
                      className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${
                        log.favorite ? 'fill-amber-500' : ''
                      }`}
                    />
                    <span className="sr-only">Toggle favorite</span>
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    data-testid="btn-delete-reading-log"
                    onClick={() => deleteLog(log.id)}
                    title="Delete session"
                    className="h-9 w-9 p-0 rounded-xl text-[#a89988] hover:text-red-600 hover:bg-red-50 hover:border hover:border-red-200 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
