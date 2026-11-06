'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext';
import { SerializedReadingLog } from '@/lib/serialize';

export interface ReadingLogSummary {
  count: number;
  favoriteCount: number;
  totalMinutes: number;
  breakdown: Array<{
    genre: string;
    count: number;
    total: number;
  }>;
}

export interface ReadingLogFilters {
  genre: string;
  favorite: boolean;
  q: string;
}

interface ReadingLogsContextType {
  logs: SerializedReadingLog[];
  summary: ReadingLogSummary;
  filters: ReadingLogFilters;
  loading: boolean;
  setGenreFilter: (genre: string) => void;
  setFavoriteFilter: (favorite: boolean) => void;
  setSearchFilter: (q: string) => void;
  clearFilters: () => void;
  addLog: (data: {
    bookTitle: string;
    minutesRead: number;
    genre: string;
    note?: string;
    readOn: string;
  }) => Promise<{ success: boolean; error?: string }>;
  toggleFavorite: (id: string, currentFav: boolean) => Promise<void>;
  deleteLog: (id: string) => Promise<void>;
  refetch: () => Promise<void>;
}

const emptySummary: ReadingLogSummary = {
  count: 0,
  favoriteCount: 0,
  totalMinutes: 0,
  breakdown: [],
};

const initialFilters: ReadingLogFilters = {
  genre: '',
  favorite: false,
  q: '',
};

const ReadingLogsContext = createContext<ReadingLogsContextType | undefined>(undefined);

export function ReadingLogsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [logs, setLogs] = useState<SerializedReadingLog[]>([]);
  const [summary, setSummary] = useState<ReadingLogSummary>(emptySummary);
  const [filters, setFilters] = useState<ReadingLogFilters>(initialFilters);
  const [loading, setLoading] = useState(false);
  const previousUserIdRef = useRef<string | null>(null);

  const fetchLogsAndSummary = useCallback(
    async (currentFilters: ReadingLogFilters) => {
      if (!user) {
        setLogs([]);
        setSummary(emptySummary);
        return;
      }

      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (currentFilters.genre) params.set('genre', currentFilters.genre);
        if (currentFilters.favorite) params.set('favorite', 'true');
        if (currentFilters.q && currentFilters.q.trim()) params.set('q', currentFilters.q.trim());

        const queryString = params.toString() ? `?${params.toString()}` : '';

        const [logsRes, summaryRes] = await Promise.all([
          fetch(`/api/reading-logs${queryString}`),
          fetch(`/api/reading-logs/summary${queryString}`),
        ]);

        if (logsRes.ok && summaryRes.ok) {
          const logsData = await logsRes.json();
          const summaryData = await summaryRes.json();
          setLogs(logsData);
          setSummary(summaryData);
        }
      } catch (err) {
        console.error('Error fetching logs/summary:', err);
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  // Requirement 2.6: When user changes or logs out, clear sessions immediately
  useEffect(() => {
    const currentUserId = user?.id || null;
    if (previousUserIdRef.current !== currentUserId) {
      previousUserIdRef.current = currentUserId;
      setLogs([]);
      setSummary(emptySummary);
      setFilters(initialFilters);
      if (currentUserId) {
        fetchLogsAndSummary(initialFilters);
      }
    }
  }, [user, fetchLogsAndSummary]);

  // When filters change for current user, refetch
  const handleFilterChange = useCallback(
    (newFilters: ReadingLogFilters) => {
      setFilters(newFilters);
      if (user) {
        fetchLogsAndSummary(newFilters);
      }
    },
    [user, fetchLogsAndSummary]
  );

  const setGenreFilter = (genre: string) => {
    handleFilterChange({ ...filters, genre });
  };

  const setFavoriteFilter = (favorite: boolean) => {
    handleFilterChange({ ...filters, favorite });
  };

  const setSearchFilter = (q: string) => {
    handleFilterChange({ ...filters, q });
  };

  const clearFilters = () => {
    handleFilterChange(initialFilters);
  };

  const addLog = async (data: {
    bookTitle: string;
    minutesRead: number;
    genre: string;
    note?: string;
    readOn: string;
  }) => {
    try {
      const res = await fetch('/api/reading-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const resData = await res.json();
      if (!res.ok) {
        return { success: false, error: resData.error || 'Failed to add reading log' };
      }
      // Refresh list & summary immediately
      await fetchLogsAndSummary(filters);
      return { success: true };
    } catch {
      return { success: false, error: 'Network error occurred' };
    }
  };

  const toggleFavorite = async (id: string, currentFav: boolean) => {
    try {
      const res = await fetch(`/api/reading-logs/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ favorite: !currentFav }),
      });
      if (res.ok) {
        await fetchLogsAndSummary(filters);
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };

  const deleteLog = async (id: string) => {
    try {
      const res = await fetch(`/api/reading-logs/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        await fetchLogsAndSummary(filters);
      }
    } catch (err) {
      console.error('Error deleting log:', err);
    }
  };

  const refetch = async () => {
    await fetchLogsAndSummary(filters);
  };

  return (
    <ReadingLogsContext.Provider
      value={{
        logs,
        summary,
        filters,
        loading,
        setGenreFilter,
        setFavoriteFilter,
        setSearchFilter,
        clearFilters,
        addLog,
        toggleFavorite,
        deleteLog,
        refetch,
      }}
    >
      {children}
    </ReadingLogsContext.Provider>
  );
}

export function useReadingLogs() {
  const context = useContext(ReadingLogsContext);
  if (!context) {
    throw new Error('useReadingLogs must be used within a ReadingLogsProvider');
  }
  return context;
}

