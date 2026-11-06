'use client';

import { useState } from 'react';
import { useReadingLogs } from '@/context/ReadingLogsContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { VALID_GENRES } from '@/lib/validation';
import { PlusCircle } from 'lucide-react';

export default function ReadingLogForm() {
  const { addLog } = useReadingLogs();

  const [bookTitle, setBookTitle] = useState('');
  const [minutesRead, setMinutesRead] = useState('');
  const [genre, setGenre] = useState('');
  const [note, setNote] = useState('');
  const [readOn, setReadOn] = useState('');

  const [submitted, setSubmitted] = useState(false);
  const [apiError, setApiError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Dynamic field validations (only active after first submit)
  let titleError = '';
  if (submitted) {
    if (!bookTitle || bookTitle.trim() === '') {
      titleError = 'Book title is required';
    } else if (bookTitle.length > 80) {
      titleError = 'Book title must be at most 80 characters';
    }
  }

  let minutesError = '';
  if (submitted) {
    if (minutesRead === undefined || minutesRead === null || minutesRead === '') {
      minutesError = 'Minutes read is required';
    } else {
      const num = Number(minutesRead);
      if (isNaN(num)) {
        minutesError = 'Minutes read is required';
      } else if (!Number.isInteger(num) || num <= 0) {
        minutesError = 'Minutes read must be a positive number';
      }
    }
  }

  let genreError = '';
  if (submitted) {
    if (!genre || genre.trim() === '') {
      genreError = 'Please choose a genre';
    } else if (!VALID_GENRES.includes(genre as any)) {
      genreError = 'Invalid genre';
    }
  }

  let dateError = '';
  if (submitted) {
    if (!readOn || readOn.trim() === '') {
      dateError = 'Date is required';
    } else {
      const now = new Date();
      const localToday = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
        .toISOString()
        .split('T')[0];
      if (readOn > localToday) {
        dateError = 'Date cannot be in the future';
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setApiError('');
    setSuccessMsg('');

    // Check all rules
    const curTitleErr =
      !bookTitle || bookTitle.trim() === ''
        ? 'Book title is required'
        : bookTitle.length > 80
        ? 'Book title must be at most 80 characters'
        : '';

    let curMinErr = '';
    if (minutesRead === undefined || minutesRead === null || minutesRead === '') {
      curMinErr = 'Minutes read is required';
    } else {
      const num = Number(minutesRead);
      if (isNaN(num)) curMinErr = 'Minutes read is required';
      else if (!Number.isInteger(num) || num <= 0) curMinErr = 'Minutes read must be a positive number';
    }

    const curGenreErr =
      !genre || genre.trim() === ''
        ? 'Please choose a genre'
        : !VALID_GENRES.includes(genre as any)
        ? 'Invalid genre'
        : '';

    let curDateErr = '';
    if (!readOn || readOn.trim() === '') {
      curDateErr = 'Date is required';
    } else {
      const now = new Date();
      const localToday = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
        .toISOString()
        .split('T')[0];
      if (readOn > localToday) {
        curDateErr = 'Date cannot be in the future';
      }
    }

    if (curTitleErr || curMinErr || curGenreErr || curDateErr) {
      return;
    }

    setLoading(true);
    const result = await addLog({
      bookTitle: bookTitle.trim(),
      minutesRead: Number(minutesRead),
      genre: genre.trim(),
      note: note.trim(),
      readOn,
    });
    setLoading(false);

    if (result.success) {
      setSuccessMsg('Reading session added');
      setBookTitle('');
      setMinutesRead('');
      setGenre('');
      setNote('');
      setReadOn('');
      setSubmitted(false);
    } else {
      setApiError(result.error || 'Failed to add reading session');
    }
  };

  return (
    <Card className="bg-[#fffdfa] border-[#ede3d4] shadow-sm">
      <CardHeader className="pb-3 border-b border-[#f5efe6]">
        <CardTitle className="text-lg font-bold text-[#2d231b] flex items-center gap-2">
          <PlusCircle className="w-5 h-5 text-[#ea580c]" />
          <span>Add Reading Session</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-4">
        <form
          noValidate
          data-testid="reading-log-form"
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          {/* API error: only rendered when present */}
          {apiError && (
            <div
              data-testid="error-reading-log"
              className="rounded-md bg-red-50 p-3 text-sm text-red-600 border border-red-200"
            >
              {apiError}
            </div>
          )}

          {/* Success message: only rendered when present */}
          {successMsg && (
            <div
              data-testid="reading-log-success"
              className="rounded-md bg-green-50 p-3 text-sm text-green-700 border border-green-200 font-medium"
            >
              {successMsg}
            </div>
          )}

          {/* Book Title */}
          <div className="space-y-1">
            <Label htmlFor="input-book-title" className="text-xs font-semibold text-[#44382d]">
              Book Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="input-book-title"
              data-testid="input-book-title"
              type="text"
              placeholder="e.g. Atomic Habits"
              value={bookTitle}
              onChange={(e) => {
                setBookTitle(e.target.value);
                if (apiError) setApiError('');
              }}
              className="border-[#e5d9c8] focus-visible:ring-[#ea580c] bg-white h-9"
            />
            {titleError && (
              <p data-testid="error-book-title" className="text-xs text-red-600 font-medium mt-1">
                {titleError}
              </p>
            )}
          </div>

          {/* Minutes Read */}
          <div className="space-y-1">
            <Label htmlFor="input-minutes" className="text-xs font-semibold text-[#44382d]">
              Minutes Read <span className="text-red-500">*</span>
            </Label>
            <Input
              id="input-minutes"
              data-testid="input-minutes"
              type="number"
              placeholder="e.g. 45"
              value={minutesRead}
              onChange={(e) => {
                setMinutesRead(e.target.value);
                if (apiError) setApiError('');
              }}
              className="border-[#e5d9c8] focus-visible:ring-[#ea580c] bg-white h-9"
            />
            {minutesError && (
              <p data-testid="error-minutes" className="text-xs text-red-600 font-medium mt-1">
                {minutesError}
              </p>
            )}
          </div>

          {/* Genre */}
          <div className="space-y-1">
            <Label htmlFor="input-genre" className="text-xs font-semibold text-[#44382d]">
              Genre <span className="text-red-500">*</span>
            </Label>
            <select
              id="input-genre"
              data-testid="input-genre"
              value={genre}
              onChange={(e) => {
                setGenre(e.target.value);
                if (apiError) setApiError('');
              }}
              className="w-full h-9 rounded-md border border-[#e5d9c8] bg-white px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ea580c] text-[#2d231b]"
            >
              <option value="">Choose genre</option>
              {VALID_GENRES.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
            {genreError && (
              <p data-testid="error-genre" className="text-xs text-red-600 font-medium mt-1">
                {genreError}
              </p>
            )}
          </div>

          {/* Date */}
          <div className="space-y-1">
            <Label htmlFor="input-date" className="text-xs font-semibold text-[#44382d]">
              Date <span className="text-red-500">*</span>
            </Label>
            <Input
              id="input-date"
              data-testid="input-date"
              type="date"
              value={readOn}
              onChange={(e) => {
                setReadOn(e.target.value);
                if (apiError) setApiError('');
              }}
              className="border-[#e5d9c8] focus-visible:ring-[#ea580c] bg-white h-9"
            />
            {dateError && (
              <p data-testid="error-date" className="text-xs text-red-600 font-medium mt-1">
                {dateError}
              </p>
            )}
          </div>

          {/* Optional Note */}
          <div className="space-y-1">
            <Label htmlFor="input-note" className="text-xs font-semibold text-[#44382d]">
              Note (optional)
            </Label>
            <Input
              id="input-note"
              data-testid="input-note"
              type="text"
              placeholder="e.g. Chapter 3"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="border-[#e5d9c8] focus-visible:ring-[#ea580c] bg-white h-9"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            data-testid="btn-add-reading-log"
            className="w-full bg-[#ea580c] hover:bg-[#c2410c] text-white font-semibold shadow-sm mt-2"
          >
            {loading ? 'Adding...' : 'Add Session'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

