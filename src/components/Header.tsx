'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { BookOpen } from 'lucide-react';

export default function Header() {
  const { user, loading, logout } = useAuth();

  return (
    <header className="border-b border-[#ede3d4] bg-[#fffdfa]/80 backdrop-blur sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-[#ea580c] to-[#fb923c] flex items-center justify-center text-white shadow-sm shadow-orange-500/20 group-hover:scale-105 transition-transform">
            <BookOpen className="w-5 h-5" />
          </div>
          <span className="font-bold text-xl tracking-tight text-[#2d231b]">
            Read<span className="text-[#ea580c]">Log</span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          {loading ? (
            <div className="h-8 w-24 bg-[#f0e9df] animate-pulse rounded-md" />
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
                className="border-[#e5d9c8] hover:bg-[#fbf7f0] text-[#44382d]"
              >
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button
                  variant="ghost"
                  size="sm"
                  data-testid="btn-login"
                  className="text-[#44382d] hover:bg-[#f5efe6] hover:text-[#2d231b]"
                >
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  size="sm"
                  data-testid="btn-register"
                  className="bg-[#ea580c] hover:bg-[#c2410c] text-white shadow-sm shadow-orange-500/20"
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
