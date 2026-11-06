import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';
import { buildReadingLogsWhere, GENRE_TIE_ORDER } from '@/lib/reading-log-helpers';

export async function GET(request: Request) {
  try {
    const user = await getSessionUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const where = buildReadingLogsWhere(user.id, searchParams);

    const logs = await prisma.readingLog.findMany({
      where,
    });

    if (logs.length === 0) {
      return NextResponse.json(
        {
          count: 0,
          favoriteCount: 0,
          totalMinutes: 0,
          breakdown: [],
        },
        { status: 200 }
      );
    }

    let favoriteCount = 0;
    let totalMinutes = 0;
    const genreMap = new Map<string, { count: number; total: number }>();

    for (const log of logs) {
      if (log.favorite) {
        favoriteCount += 1;
      }
      totalMinutes += log.minutesRead;

      const current = genreMap.get(log.genre) || { count: 0, total: 0 };
      current.count += 1;
      current.total += log.minutesRead;
      genreMap.set(log.genre, current);
    }

    const breakdown: Array<{ genre: string; count: number; total: number }> = [];
    for (const [genre, data] of genreMap.entries()) {
      breakdown.push({
        genre,
        count: data.count,
        total: data.total,
      });
    }

    // Sort breakdown:
    // 1. total minutes descending
    // 2. ties broken by: Fiction, Non-Fiction, Sci-Fi, Biography, Other
    breakdown.sort((a, b) => {
      if (b.total !== a.total) {
        return b.total - a.total;
      }
      return (GENRE_TIE_ORDER[a.genre] ?? 99) - (GENRE_TIE_ORDER[b.genre] ?? 99);
    });

    return NextResponse.json(
      {
        count: logs.length,
        favoriteCount,
        totalMinutes,
        breakdown,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('GET /api/reading-logs/summary error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

