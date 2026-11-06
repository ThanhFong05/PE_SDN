import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';
import { serializeReadingLog } from '@/lib/serialize';
import {
  validateBookTitle,
  validateMinutesRead,
  validateGenre,
  validateReadOn,
} from '@/lib/validation';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSessionUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const existing = await prisma.readingLog.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Reading log not found' }, { status: 404 });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const { bookTitle, minutesRead, genre, note, readOn, favorite } = body;

    // Validate only fields provided
    if (bookTitle !== undefined) {
      const err = validateBookTitle(bookTitle);
      if (err) return NextResponse.json({ error: err }, { status: 400 });
    }

    if (minutesRead !== undefined) {
      const err = validateMinutesRead(minutesRead);
      if (err) return NextResponse.json({ error: err }, { status: 400 });
    }

    if (genre !== undefined) {
      const err = validateGenre(genre);
      if (err) return NextResponse.json({ error: err }, { status: 400 });
    }

    if (readOn !== undefined) {
      const err = validateReadOn(readOn);
      if (err) return NextResponse.json({ error: err }, { status: 400 });
    }

    // Prepare target merged values for duplicate check
    const targetTitle =
      bookTitle !== undefined ? String(bookTitle).trim() : existing.bookTitle;
    const targetMinutes =
      minutesRead !== undefined ? Number(minutesRead) : existing.minutesRead;
    const targetReadOn =
      readOn !== undefined
        ? new Date(`${String(readOn).trim().split('T')[0]}T00:00:00Z`)
        : existing.readOn;

    // If title, minutes, or date are being updated, check duplicates against other records
    if (
      bookTitle !== undefined ||
      minutesRead !== undefined ||
      readOn !== undefined
    ) {
      const duplicate = await prisma.readingLog.findFirst({
        where: {
          userId: user.id,
          id: { not: id },
          bookTitle: { equals: targetTitle, mode: 'insensitive' },
          minutesRead: targetMinutes,
          readOn: targetReadOn,
        },
      });

      if (duplicate) {
        return NextResponse.json(
          {
            error:
              'Duplicate reading session: a reading session with the same book title, minutes and date already exists',
          },
          { status: 409 }
        );
      }
    }

    // Build update data
    const updateData: {
      bookTitle?: string;
      minutesRead?: number;
      genre?: string;
      note?: string;
      readOn?: Date;
      favorite?: boolean;
    } = {};

    if (bookTitle !== undefined) updateData.bookTitle = targetTitle;
    if (minutesRead !== undefined) updateData.minutesRead = targetMinutes;
    if (genre !== undefined) updateData.genre = String(genre).trim();
    if (note !== undefined) updateData.note = typeof note === 'string' ? note.trim() : '';
    if (readOn !== undefined) updateData.readOn = targetReadOn;
    if (favorite !== undefined) updateData.favorite = Boolean(favorite);

    const updated = await prisma.readingLog.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(serializeReadingLog(updated), { status: 200 });
  } catch (error) {
    console.error('PATCH /api/reading-logs/:id error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSessionUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const { count } = await prisma.readingLog.deleteMany({
      where: {
        id,
        userId: user.id,
      },
    });

    if (count === 0) {
      return NextResponse.json({ error: 'Reading log not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('DELETE /api/reading-logs/:id error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

