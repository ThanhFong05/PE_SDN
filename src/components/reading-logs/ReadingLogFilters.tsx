'use client';

import { useReadingLogs } from '@/context/ReadingLogsContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { VALID_GENRES } from '@/lib/validation';
import { Filter, RotateCcw, Search, Star, Bookmark } from 'lucide-react';

export default function ReadingLogFilters() {
  const {
    filters,
    setGenreFilter,
    setFavoriteFilter,
    setSearchFilter,
    clearFilters,
  } = useReadingLogs();

  return (
    <Card className="bg-white/95 backdrop-blur border-[#ebdccd] shadow-sm rounded-2xl mb-6 overflow-hidden">
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#2b2520]">
            <div className="w-6 h-6 rounded-md bg-orange-50 border border-orange-200/60 flex items-center justify-center text-[#ea580c]">
              <Filter className="w-3.5 h-3.5" />
            </div>
            <span>Filter & Search Sessions</span>
          </div>

          {(filters.genre || filters.favorite || filters.q) && (
            <span className="text-[11px] font-semibold text-[#ea580c] bg-orange-50 border border-orange-200/60 px-2 py-0.5 rounded-full">
              Active filters
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-end">
          {/* Search box (q) */}
          <div className="lg:col-span-5 space-y-1">
            <Label htmlFor="search-input" className="text-xs font-bold text-[#6e5f50]">
              Search Title or Notes
            </Label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-[#a89988]" />
              <Input
                id="search-input"
                data-testid="search-input"
                type="text"
                placeholder="Keyword search..."
                value={filters.q}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="pl-9 h-10 border-[#dfd0bf] focus-visible:ring-[#ea580c] focus-visible:border-[#ea580c] bg-white rounded-xl text-sm"
              />
            </div>
          </div>

          {/* Genre Filter */}
          <div className="lg:col-span-3 space-y-1">
            <Label htmlFor="filter-genre" className="text-xs font-bold text-[#6e5f50]">
              Filter by Genre
            </Label>
            <div className="relative">
              <select
                id="filter-genre"
                data-testid="filter-genre"
                value={filters.genre}
                onChange={(e) => setGenreFilter(e.target.value)}
                className="w-full h-10 rounded-xl border border-[#dfd0bf] bg-white px-3 text-xs sm:text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ea580c] focus-visible:border-[#ea580c] text-[#2b2520] cursor-pointer"
              >
                <option value="">All Genres</option>
                {VALID_GENRES.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Favorites Only Checkbox */}
          <div className="lg:col-span-2 flex items-center h-10">
            <label
              htmlFor="filter-favorite"
              className={`w-full h-10 inline-flex items-center justify-center gap-2 px-3 rounded-xl border cursor-pointer select-none text-xs font-bold transition-all ${
                filters.favorite
                  ? 'bg-amber-50 border-amber-300 text-amber-900 shadow-xs'
                  : 'bg-white border-[#dfd0bf] text-[#6e5f50] hover:bg-[#faf6f0]'
              }`}
            >
              <input
                id="filter-favorite"
                data-testid="filter-favorite"
                type="checkbox"
                checked={filters.favorite}
                onChange={(e) => setFavoriteFilter(e.target.checked)}
                className="w-4 h-4 rounded text-[#ea580c] focus:ring-[#ea580c] accent-[#ea580c] cursor-pointer"
              />
              <span className="flex items-center gap-1">
                <Star
                  className={`w-3.5 h-3.5 ${
                    filters.favorite ? 'text-amber-500 fill-amber-500' : 'text-[#a89988]'
                  }`}
                />
                Favorites only
              </span>
            </label>
          </div>

          {/* Clear button */}
          <div className="lg:col-span-2">
            <Button
              type="button"
              variant="outline"
              onClick={clearFilters}
              data-testid="btn-clear-filters"
              className="w-full h-10 border-[#dfd0bf] bg-white hover:bg-[#fbf7f0] text-[#6e5f50] hover:text-[#2b2520] flex items-center justify-center gap-1.5 text-xs font-bold rounded-xl shadow-xs transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
