import { ReadingLog } from '@prisma/client';

export interface SerializedReadingLog {
  id: string;
  bookTitle: string;
  minutesRead: number;
  genre: string;
  note: string;
  favorite: boolean;
  readOn: string;
  createdAt: string;
}

export function serializeReadingLog(log: ReadingLog): SerializedReadingLog {
  const readOnStr =
    log.readOn instanceof Date
      ? log.readOn.toISOString().split('T')[0]
      : String(log.readOn).split('T')[0];

  return {
    id: log.id,
    bookTitle: log.bookTitle,
    minutesRead: log.minutesRead,
    genre: log.genre,
    note: log.note ?? '',
    favorite: log.favorite,
    readOn: readOnStr,
    createdAt: log.createdAt instanceof Date ? log.createdAt.toISOString() : new Date(log.createdAt).toISOString(),
  };
}

