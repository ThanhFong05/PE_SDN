'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  let emailError = '';
  if (submitted) {
    if (!email || email.trim() === '') {
      emailError = 'Email is required';
    } else if (!emailRegex.test(email.trim())) {
      emailError = 'Please enter a valid email address';
    }
  }

  let passwordError = '';
  if (submitted) {
    if (!password) {
      passwordError = 'Password is required';
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setApiError('');

    const currentEmailError = !email || email.trim() === ''
      ? 'Email is required'
      : !emailRegex.test(email.trim())
      ? 'Please enter a valid email address'
      : '';

    const currentPassError = !password ? 'Password is required' : '';

    if (currentEmailError || currentPassError) {
      return;
    }

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      router.push('/reading-logs');
      router.refresh();
    } else {
      setApiError(result.error || 'Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fdfbf7]">
      <Header />

      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-md bg-[#fffdfa] border-[#ede3d4]">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold tracking-tight text-[#2d231b]">
              Sign In
            </CardTitle>
            <CardDescription className="text-[#786c5e]">
              Enter your email and password to access your reading sessions
            </CardDescription>
          </CardHeader>

          <form
            noValidate
            data-testid="login-form"
            onSubmit={handleSubmit}
          >
            <CardContent className="space-y-4">
              {/* API error: only rendered when present */}
              {apiError && (
                <div
                  data-testid="error-auth"
                  className="rounded-md bg-red-50 p-3 text-sm text-red-600 border border-red-200"
                >
                  {apiError}
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="login-email" className="text-[#44382d]">
                  Email
                </Label>
                <Input
                  id="login-email"
                  data-testid="login-email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (apiError) setApiError('');
                  }}
                  className="border-[#e5d9c8] focus-visible:ring-[#ea580c] bg-white"
                />
                {emailError && (
                  <p
                    data-testid="error-email"
                    className="text-xs text-red-600 mt-1 font-medium"
                  >
                    {emailError}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="login-password" className="text-[#44382d]">
                  Password
                </Label>
                <Input
                  id="login-password"
                  data-testid="login-password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (apiError) setApiError('');
                  }}
                  className="border-[#e5d9c8] focus-visible:ring-[#ea580c] bg-white"
                />
                {passwordError && (
                  <p
                    data-testid="error-password"
                    className="text-xs text-red-600 mt-1 font-medium"
                  >
                    {passwordError}
                  </p>
                )}
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4 pt-2">
              <Button
                type="submit"
                disabled={loading}
                data-testid="login-submit"
                className="w-full bg-[#ea580c] hover:bg-[#c2410c] text-white font-semibold shadow-sm"
              >
                {loading ? 'Logging in...' : 'Sign In'}
              </Button>

              <p className="text-center text-sm text-[#786c5e]">
                Don&apos;t have an account?{' '}
                <Link
                  href="/register"
                  className="font-semibold text-[#ea580c] hover:underline"
                >
                  Register
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </main>
    </div>
  );
}
