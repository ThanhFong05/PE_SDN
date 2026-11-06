'use client';

import { useState } from 'react';
import { useReadingLogs } from '@/context/ReadingLogsContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { VALID_GENRES } from '@/lib/validation';
import { PlusCircle, Book, Clock, Calendar, Bookmark, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

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
    <Card className="bg-white/95 backdrop-blur border-[#ebdccd] shadow-md shadow-amber-950/5 rounded-2xl overflow-hidden">
      <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 to-amber-500" />

      <CardHeader className="p-5 pb-3 border-b border-[#f5ece1]">
        <CardTitle className="text-base sm:text-lg font-bold text-[#2b2520] flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-orange-50 border border-orange-200/80 flex items-center justify-center text-[#ea580c]">
            <PlusCircle className="w-4 h-4 stroke-[2.3]" />
          </div>
          <span>Add Reading Session</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-5">
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
              className="rounded-xl bg-red-50/90 p-3 text-xs text-red-600 border border-red-200 flex items-start gap-2"
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
              <span className="font-medium">{apiError}</span>
            </div>
          )}

          {/* Success message: only rendered when present */}
          {successMsg && (
            <div
              data-testid="reading-log-success"
              className="rounded-xl bg-emerald-50/90 p-3 text-xs text-emerald-700 border border-emerald-200 flex items-center gap-2 font-bold"
            >
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Book Title */}
          <div className="space-y-1">
            <Label htmlFor="input-book-title" className="text-xs font-bold text-[#423528] flex items-center gap-1.5">
              <Book className="w-3.5 h-3.5 text-[#ea580c]" />
              <span>Book Title</span>
              <span className="text-red-500">*</span>
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
              className="border-[#dfd0bf] focus-visible:ring-[#ea580c] focus-visible:border-[#ea580c] bg-white h-9.5 rounded-xl text-sm"
            />
            {titleError && (
              <p data-testid="error-book-title" className="text-xs text-red-600 font-semibold mt-1">
                {titleError}
              </p>
            )}
          </div>

          {/* Minutes Read & Genre in 2 cols */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Minutes Read */}
            <div className="space-y-1">
              <Label htmlFor="input-minutes" className="text-xs font-bold text-[#423528] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#ea580c]" />
                <span>Minutes</span>
                <span className="text-red-500">*</span>
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
                className="border-[#dfd0bf] focus-visible:ring-[#ea580c] focus-visible:border-[#ea580c] bg-white h-9.5 rounded-xl text-sm"
              />
              {minutesError && (
                <p data-testid="error-minutes" className="text-xs text-red-600 font-semibold mt-1">
                  {minutesError}
                </p>
              )}
            </div>

            {/* Genre */}
            <div className="space-y-1">
              <Label htmlFor="input-genre" className="text-xs font-bold text-[#423528] flex items-center gap-1.5">
                <Bookmark className="w-3.5 h-3.5 text-[#ea580c]" />
                <span>Genre</span>
                <span className="text-red-500">*</span>
              </Label>
              <select
                id="input-genre"
                data-testid="input-genre"
                value={genre}
                onChange={(e) => {
                  setGenre(e.target.value);
                  if (apiError) setApiError('');
                }}
                className="w-full h-9.5 rounded-xl border border-[#dfd0bf] bg-white px-3 text-xs sm:text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ea580c] focus-visible:border-[#ea580c] text-[#2b2520] cursor-pointer"
              >
                <option value="">Choose genre</option>
                {VALID_GENRES.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
              {genreError && (
                <p data-testid="error-genre" className="text-xs text-red-600 font-semibold mt-1">
                  {genreError}
                </p>
              )}
            </div>
          </div>

          {/* Date */}
          <div className="space-y-1">
            <Label htmlFor="input-date" className="text-xs font-bold text-[#423528] flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#ea580c]" />
              <span>Date Read</span>
              <span className="text-red-500">*</span>
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
              className="border-[#dfd0bf] focus-visible:ring-[#ea580c] focus-visible:border-[#ea580c] bg-white h-9.5 rounded-xl text-sm"
            />
            {dateError && (
              <p data-testid="error-date" className="text-xs text-red-600 font-semibold mt-1">
                {dateError}
              </p>
            )}
          </div>

          {/* Optional Note */}
          <div className="space-y-1">
            <Label htmlFor="input-note" className="text-xs font-bold text-[#423528] flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-[#a89988]" />
              <span>Notes / Key takeaway (optional)</span>
            </Label>
            <Input
              id="input-note"
              data-testid="input-note"
              type="text"
              placeholder="e.g. Finished Chapter 4, great insights on habits"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="border-[#dfd0bf] focus-visible:ring-[#ea580c] focus-visible:border-[#ea580c] bg-white h-9.5 rounded-xl text-sm"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            data-testid="btn-add-reading-log"
            className="w-full h-10.5 bg-gradient-to-r from-[#ea580c] to-[#f97316] hover:from-[#c2410c] hover:to-[#ea580c] text-white font-bold rounded-xl shadow-md shadow-orange-500/20 active:scale-98 transition-all mt-2"
          >
            {loading ? 'Adding Session...' : 'Add Session'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
