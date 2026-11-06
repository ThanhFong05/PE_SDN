'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { BookMarked } from 'lucide-react';

export default function Header() {
  const { user, loading, logout } = useAuth();

  return (
    <header className="border-b border-[#f3ede4] bg-[#fffaf5]/90 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-[#ea580c] flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
            <BookMarked className="w-4 h-4 stroke-[2.5]" />
          </div>
          <span className="font-bold text-xl tracking-tight text-[#1c1917]">
            ReadLog
          </span>
        </Link>

        {/* Auth Navigation */}
        <div className="flex items-center gap-3">
          {loading ? (
            <div className="h-9 w-24 bg-[#f2eae0] animate-pulse rounded-full" />
          ) : user ? (
            <div className="flex items-center gap-3 sm:gap-4">
              <Link
                href="/reading-logs"
                data-testid="link-reading-logs"
                className="text-sm font-semibold text-[#ea580c] hover:text-[#c2410c] hover:underline"
              >
                Reading Logs
              </Link>
              <span
                data-testid="user-email"
                className="text-sm text-[#786c5e] font-medium hidden sm:inline"
              >
                {user.email}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                data-testid="btn-logout"
                className="rounded-full border-[#e7ddd1] hover:bg-[#fbf7f0] text-[#44382d] px-4"
              >
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2 sm:gap-3">
              <Link href="/login">
                <button
                  type="button"
                  data-testid="btn-login"
                  className="px-5 py-2 text-sm font-medium text-[#c2410c] hover:text-[#9a3412] hover:bg-[#fff2e5] border border-[#fed7aa] rounded-full transition-colors cursor-pointer"
                >
                  Login
                </button>
              </Link>
              <Link href="/register">
                <button
                  type="button"
                  data-testid="btn-register"
                  className="px-5 py-2 text-sm font-semibold text-white bg-[#f97316] hover:bg-[#ea580c] rounded-full shadow-xs transition-colors cursor-pointer"
                >
                  Register
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
