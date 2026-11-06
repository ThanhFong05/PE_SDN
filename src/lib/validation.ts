export const VALID_GENRES = [
  'Fiction',
  'Non-Fiction',
  'Sci-Fi',
  'Biography',
  'Other',
] as const;

export type Genre = (typeof VALID_GENRES)[number];

export function validateBookTitle(title: unknown): string | null {
  if (typeof title !== 'string' || title.trim().length === 0) {
    return 'Book title is required';
  }
  if (title.length > 80) {
    return 'Book title must be at most 80 characters';
  }
  return null;
}

export function validateMinutesRead(minutes: unknown): string | null {
  if (minutes === undefined || minutes === null || minutes === '') {
    return 'Minutes read is required';
  }
  const num = typeof minutes === 'number' ? minutes : Number(minutes);
  if (isNaN(num)) {
    return 'Minutes read is required';
  }
  if (!Number.isInteger(num) || num <= 0) {
    return 'Minutes read must be a positive number';
  }
  return null;
}

export function validateGenre(genre: unknown): string | null {
  if (!genre || typeof genre !== 'string' || genre.trim() === '') {
    return 'Please choose a genre';
  }
  if (!VALID_GENRES.includes(genre as Genre)) {
    return 'Invalid genre';
  }
  return null;
}

export function validateReadOn(dateVal: unknown): string | null {
  if (!dateVal || typeof dateVal !== 'string' || dateVal.trim() === '') {
    return 'Date is required';
  }
  const dateStr = dateVal.trim().split('T')[0];
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return 'Date is required';
  }
  const parsed = new Date(`${dateStr}T00:00:00Z`);
  if (isNaN(parsed.getTime())) {
    return 'Date is required';
  }

  // Calculate current date in UTC+7 (local exam timezone)
  const now = new Date();
  const utc7 = new Date(now.getTime() + 7 * 60 * 60 * 1000);
  const todayStr = utc7.toISOString().split('T')[0];

  if (dateStr > todayStr) {
    return 'Date cannot be in the future';
  }

  return null;
}

// Order of validation for POST /api/reading-logs:
// 1. bookTitle -> 2. minutesRead -> 3. genre -> 4. readOn
export function validateReadingLogInput(data: {
  bookTitle?: unknown;
  minutesRead?: unknown;
  genre?: unknown;
  readOn?: unknown;
}): string | null {
  const titleError = validateBookTitle(data.bookTitle);
  if (titleError) return titleError;

  const minutesError = validateMinutesRead(data.minutesRead);
  if (minutesError) return minutesError;

  const genreError = validateGenre(data.genre);
  if (genreError) return genreError;

  const dateError = validateReadOn(data.readOn);
  if (dateError) return dateError;

  return null;
}
