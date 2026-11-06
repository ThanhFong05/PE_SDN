'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { BookOpen, LogOut, BookMarked, User as UserIcon } from 'lucide-react';

export default function Header() {
  const { user, loading, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-[#ebdccd]/80 bg-[#faf6f0]/90 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#ea580c] via-[#f97316] to-[#fb923c] flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:scale-105 group-hover:shadow-orange-500/30 transition-all duration-200">
            <BookOpen className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-xl tracking-tight text-[#2b2520] leading-none">
              Read<span className="text-[#ea580c]">Log</span>
            </span>
            <span className="text-[10px] uppercase tracking-wider font-semibold text-[#a89988] mt-0.5">
              Reading Journal
            </span>
          </div>
        </Link>

        {/* Navigation / User Controls */}
        <div className="flex items-center gap-3">
          {loading ? (
            <div className="h-9 w-28 bg-[#ede2d4] animate-pulse rounded-lg" />
          ) : user ? (
            <div className="flex items-center gap-3 sm:gap-4">
              <Link
                href="/reading-logs"
                data-testid="link-reading-logs"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#ea580c] bg-orange-50 hover:bg-orange-100 border border-orange-200/70 px-3 py-1.5 rounded-lg transition-colors"
              >
                <BookMarked className="w-4 h-4" />
                <span>Reading Logs</span>
              </Link>

              <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[#f2e9dc]/60 border border-[#ebdccd]">
                <div className="w-6 h-6 rounded-full bg-[#ea580c]/15 text-[#ea580c] flex items-center justify-center text-xs font-bold uppercase">
                  {user.email.charAt(0)}
                </div>
                <span
                  data-testid="user-email"
                  className="text-xs font-semibold text-[#54483c] max-w-[110px] sm:max-w-[160px] truncate"
                  title={user.email}
                >
                  {user.email}
                </span>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                data-testid="btn-logout"
                className="h-9 border-[#decaba] bg-white hover:bg-[#fbf7f0] text-[#54483c] hover:text-red-600 hover:border-red-200 text-xs font-semibold gap-1.5 shadow-xs transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button
                  variant="ghost"
                  size="sm"
                  data-testid="btn-login"
                  className="h-9 text-[#54483c] hover:bg-[#eee3d5] font-semibold text-xs sm:text-sm px-3.5"
                >
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  size="sm"
                  data-testid="btn-register"
                  className="h-9 bg-gradient-to-r from-[#ea580c] to-[#f97316] hover:from-[#c2410c] hover:to-[#ea580c] text-white font-bold text-xs sm:text-sm px-4 shadow-sm shadow-orange-500/25 transition-all duration-200"
                >
                  Register
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
