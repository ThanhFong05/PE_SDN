'use client';

import { useReadingLogs } from '@/context/ReadingLogsContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { VALID_GENRES } from '@/lib/validation';
import { Filter, RotateCcw, Search, Star } from 'lucide-react';

export default function ReadingLogFilters() {
  const {
    filters,
    setGenreFilter,
    setFavoriteFilter,
    setSearchFilter,
    clearFilters,
  } = useReadingLogs();

  return (
    <Card className="bg-[#fffdfa] border-[#ede3d4] shadow-sm mb-6">
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-center gap-2 mb-3 text-sm font-bold text-[#2d231b]">
          <Filter className="w-4 h-4 text-[#ea580c]" />
          <span>Filters & Search</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-end">
          {/* Search box (q) */}
          <div className="lg:col-span-5 space-y-1">
            <Label htmlFor="search-input" className="text-xs font-semibold text-[#786c5e]">
              Search Title or Note
            </Label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-2.5 top-2.5 text-[#968776]" />
              <Input
                id="search-input"
                data-testid="search-input"
                type="text"
                placeholder="Search..."
                value={filters.q}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="pl-8 border-[#e5d9c8] focus-visible:ring-[#ea580c] bg-white h-9"
              />
            </div>
          </div>

          {/* Genre Filter */}
          <div className="lg:col-span-3 space-y-1">
            <Label htmlFor="filter-genre" className="text-xs font-semibold text-[#786c5e]">
              Genre
            </Label>
            <select
              id="filter-genre"
              data-testid="filter-genre"
              value={filters.genre}
              onChange={(e) => setGenreFilter(e.target.value)}
              className="w-full h-9 rounded-md border border-[#e5d9c8] bg-white px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ea580c] text-[#2d231b]"
            >
              <option value="">All</option>
              {VALID_GENRES.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          {/* Favorites Only Checkbox */}
          <div className="lg:col-span-2 flex items-center h-9 pt-3 sm:pt-0">
            <label
              htmlFor="filter-favorite"
              className="inline-flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#44382d] select-none"
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
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
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
              className="w-full h-9 border-[#e5d9c8] text-[#786c5e] hover:text-[#2d231b] hover:bg-[#f5efe6] flex items-center justify-center gap-1.5 text-xs font-semibold"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
