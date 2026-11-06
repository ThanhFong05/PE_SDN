import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';
import { serializeReadingLog } from '@/lib/serialize';
import { validateReadingLogInput } from '@/lib/validation';
import { buildReadingLogsWhere } from '@/lib/reading-log-helpers';

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

    // In-memory sort:
    // 1. readOn descending (most recent first)
    // 2. ties broken by bookTitle, alphabetically, case-insensitive
    logs.sort((a, b) => {
      const aTime = new Date(a.readOn).getTime();
      const bTime = new Date(b.readOn).getTime();
      if (bTime !== aTime) {
        return bTime - aTime;
      }
      return a.bookTitle.toLowerCase().localeCompare(b.bookTitle.toLowerCase());
    });

    return NextResponse.json(logs.map(serializeReadingLog), { status: 200 });
  } catch (error) {
    console.error('GET /api/reading-logs error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getSessionUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const { bookTitle, minutesRead, genre, note, readOn } = body;

    // Validate in fixed order: bookTitle -> minutesRead -> genre -> readOn
    const validationError = validateReadingLogInput({
      bookTitle,
      minutesRead,
      genre,
      readOn,
    });
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const cleanTitle = String(bookTitle).trim();
    const cleanMinutes = Number(minutesRead);
    const cleanGenre = String(genre).trim();
    const cleanNote = typeof note === 'string' ? note.trim() : '';
    const cleanDateStr = String(readOn).trim().split('T')[0];
    const parsedDate = new Date(`${cleanDateStr}T00:00:00Z`);

    // Duplicate check: same bookTitle, minutesRead and readOn already saved by this user
    const existing = await prisma.readingLog.findFirst({
      where: {
        userId: user.id,
        bookTitle: { equals: cleanTitle, mode: 'insensitive' },
        minutesRead: cleanMinutes,
        readOn: parsedDate,
      },
    });

    if (existing) {
      return NextResponse.json(
        {
          error:
            'Duplicate reading session: a reading session with the same book title, minutes and date already exists',
        },
        { status: 409 }
      );
    }

    const created = await prisma.readingLog.create({
      data: {
        userId: user.id,
        bookTitle: cleanTitle,
        minutesRead: cleanMinutes,
        genre: cleanGenre,
        note: cleanNote,
        readOn: parsedDate,
      },
    });

    return NextResponse.json(serializeReadingLog(created), { status: 201 });
  } catch (error) {
    console.error('POST /api/reading-logs error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

