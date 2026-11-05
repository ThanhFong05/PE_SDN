import Link from 'next/link';
import { getSession } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import LogoutButton from '@/components/auth/LogoutButton';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const session = await getSession();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="font-bold text-xl text-gray-900">
            Exam Portal
          </Link>
          <div className="flex items-center gap-4">
            {session ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600" data-testid="user-email">
                  {session.email}
                </span>
                <LogoutButton />
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost" data-testid="nav-login">Login</Button>
                </Link>
                <Link href="/register">
                  <Button data-testid="nav-register">Register</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full p-6 flex flex-col justify-center items-center">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-3xl font-extrabold tracking-tight">
              Application Dashboard
            </CardTitle>
            <CardDescription>
              Next.js (App Router) + Prisma + PostgreSQL (Supabase) + Custom Auth
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {session ? (
              <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                <p className="font-medium text-green-900">
                  Welcome back, <span className="font-semibold">{session.name || session.email}</span>!
                </p>
                <p className="text-sm text-green-700 mt-1">
                  Status: Authenticated (Role: <span className="font-mono">{session.role || 'user'}</span>)
                </p>
              </div>
            ) : (
              <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                <p className="font-medium text-blue-900">You are currently browsing as a guest.</p>
                <p className="text-sm text-blue-700 mt-1">
                  Please sign in or register an account to access authenticated features.
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              <div className="p-4 border rounded-lg bg-white shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-1">Architecture</h3>
                <p className="text-sm text-gray-600">
                  Built with Next.js App Router, Route Handlers, Prisma Client, and ShadCN UI.
                </p>
              </div>
              <div className="p-4 border rounded-lg bg-white shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-1">Authentication</h3>
                <p className="text-sm text-gray-600">
                  Custom JWT-based authentication signed via AUTH_SECRET stored in secure httpOnly cookies.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
