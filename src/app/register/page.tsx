'use client';

import { useState } from 'react';
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

export default function RegisterPage() {
  const { register } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [apiError, setApiError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Dynamic field errors (only active after first submit attempt)
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
    } else if (password.length < 6) {
      passwordError = 'Password must be at least 6 characters';
    }
  }

  let confirmPasswordError = '';
  if (submitted) {
    if (!confirmPassword) {
      confirmPasswordError = 'Confirm password is required';
    } else if (confirmPassword !== password) {
      confirmPasswordError = 'Passwords do not match';
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setApiError('');
    setSuccessMsg('');

    // Check validation
    const currentEmailError = !email || email.trim() === ''
      ? 'Email is required'
      : !emailRegex.test(email.trim())
      ? 'Please enter a valid email address'
      : '';

    const currentPassError = !password
      ? 'Password is required'
      : password.length < 6
      ? 'Password must be at least 6 characters'
      : '';

    const currentConfirmError = !confirmPassword
      ? 'Confirm password is required'
      : confirmPassword !== password
      ? 'Passwords do not match'
      : '';

    if (currentEmailError || currentPassError || currentConfirmError) {
      return;
    }

    setLoading(true);
    const result = await register(email, password, confirmPassword);
    setLoading(false);

    if (result.success) {
      setSuccessMsg('Registration successful');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setSubmitted(false);
    } else {
      setApiError(result.error || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fdfbf7]">
      <Header />

      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-md bg-[#fffdfa] border-[#ede3d4]">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold tracking-tight text-[#2d231b]">
              Create an account
            </CardTitle>
            <CardDescription className="text-[#786c5e]">
              Enter your details to register for ReadLog
            </CardDescription>
          </CardHeader>

          <form
            noValidate
            data-testid="register-form"
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

              {/* Form success: only rendered when present */}
              {successMsg && (
                <div
                  data-testid="form-success"
                  className="rounded-md bg-green-50 p-3 text-sm text-green-700 border border-green-200 font-medium"
                >
                  {successMsg}
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="register-email" className="text-[#44382d]">
                  Email
                </Label>
                <Input
                  id="register-email"
                  data-testid="register-email"
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
                <Label htmlFor="register-password" className="text-[#44382d]">
                  Password
                </Label>
                <Input
                  id="register-password"
                  data-testid="register-password"
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

              <div className="space-y-1.5">
                <Label htmlFor="register-confirm-password" className="text-[#44382d]">
                  Confirm Password
                </Label>
                <Input
                  id="register-confirm-password"
                  data-testid="register-confirm-password"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (apiError) setApiError('');
                  }}
                  className="border-[#e5d9c8] focus-visible:ring-[#ea580c] bg-white"
                />
                {confirmPasswordError && (
                  <p
                    data-testid="error-confirm-password"
                    className="text-xs text-red-600 mt-1 font-medium"
                  >
                    {confirmPasswordError}
                  </p>
                )}
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4 pt-2">
              <Button
                type="submit"
                disabled={loading}
                data-testid="register-submit"
                className="w-full bg-[#ea580c] hover:bg-[#c2410c] text-white font-semibold shadow-sm"
              >
                {loading ? 'Registering...' : 'Register'}
              </Button>

              <p className="text-center text-sm text-[#786c5e]">
                Already have an account?{' '}
                <Link
                  href="/login"
                  className="font-semibold text-[#ea580c] hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </main>
    </div>
  );
}
