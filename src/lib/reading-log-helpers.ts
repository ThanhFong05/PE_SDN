import { Prisma } from '@prisma/client';
import { VALID_GENRES, Genre } from './validation';

export function buildReadingLogsWhere(
  userId: string,
  searchParams: URLSearchParams
): Prisma.ReadingLogWhereInput {
  const where: Prisma.ReadingLogWhereInput = {
    userId,
  };

  const genre = searchParams.get('genre');
  if (genre && VALID_GENRES.includes(genre as Genre)) {
    where.genre = genre;
  }

  const favorite = searchParams.get('favorite');
  if (favorite === 'true') {
    where.favorite = true;
  }

  const q = searchParams.get('q');
  if (q && q.trim().length > 0) {
    const trimmed = q.trim();
    where.OR = [
      { bookTitle: { contains: trimmed, mode: 'insensitive' } },
      { note: { contains: trimmed, mode: 'insensitive' } },
    ];
  }

  return where;
}

export const GENRE_TIE_ORDER: Record<string, number> = {
  Fiction: 1,
  'Non-Fiction': 2,
  'Sci-Fi': 3,
  Biography: 4,
  Other: 5,
};
