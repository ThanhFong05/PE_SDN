'use client';

import { useReadingLogs } from '@/context/ReadingLogsContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Trash2, BookOpen, Clock, Calendar, Tag } from 'lucide-react';

export default function ReadingLogList() {
  const { logs, toggleFavorite, deleteLog } = useReadingLogs();

  if (logs.length === 0) {
    return (
      <div
        data-testid="reading-logs-empty"
        className="rounded-xl border border-dashed border-[#e5d9c8] p-12 text-center bg-[#fffdfa]"
      >
        <BookOpen className="w-10 h-10 mx-auto text-[#c2b6a6] mb-3" />
        <h3 className="text-lg font-semibold text-[#44382d]">
          No reading sessions found
        </h3>
        <p className="text-sm text-[#786c5e] mt-1 max-w-sm mx-auto">
          Add your first reading session using the form or try clearing your filters.
        </p>
      </div>
    );
  }

  return (
    <div
      data-testid="reading-log-list"
      className="space-y-3"
    >
      {logs.map((log) => (
        <Card
          key={log.id}
          data-testid="reading-log-item"
          className="bg-[#fffdfa] border-[#ede3d4] shadow-xs hover:shadow-sm transition-all overflow-hidden"
        >
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span
                    data-testid="reading-log-title"
                    className="font-bold text-base sm:text-lg text-[#2d231b] break-words"
                  >
                    {log.bookTitle}
                  </span>
                  <span
                    data-testid="reading-log-genre"
                    className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#fceddf] text-[#c2410c] border border-[#f7d6be]"
                  >
                    <Tag className="w-3 h-3" />
                    {log.genre}
                  </span>
                </div>

                {log.note && (
                  <p className="text-xs text-[#786c5e] bg-[#fbf8f2] border border-[#f2e9dc] p-2 rounded-md mb-2 italic">
                    &ldquo;{log.note}&rdquo;
                  </p>
                )}

                <div className="flex items-center gap-4 text-xs text-[#786c5e] flex-wrap mt-2">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#ea580c]" />
                    <span>
                      <span data-testid="reading-log-minutes" className="font-semibold text-[#44382d]">
                        {log.minutesRead}
                      </span>{' '}
                      mins
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#968776]" />
                    <span data-testid="reading-log-date" className="font-medium text-[#44382d]">
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
                  className={`h-8 w-8 p-0 rounded-full transition-colors ${
                    log.favorite
                      ? 'text-amber-500 hover:text-amber-600 bg-amber-50 hover:bg-amber-100'
                      : 'text-[#968776] hover:text-amber-500 hover:bg-[#fbf7f0]'
                  }`}
                >
                  <Star
                    className={`w-4 h-4 ${
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
                  className="h-8 w-8 p-0 rounded-full text-[#968776] hover:text-red-600 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="sr-only">Delete</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

