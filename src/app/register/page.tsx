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
import { Mail, Lock, KeyRound, ArrowRight, AlertCircle, CheckCircle2, UserPlus } from 'lucide-react';

export default function RegisterPage() {
  const { register } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [apiError, setApiError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
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
    <div className="min-h-screen flex flex-col bg-[#faf6f0] relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[350px] bg-gradient-to-b from-orange-200/30 to-amber-200/20 blur-3xl pointer-events-none -z-10" />

      <Header />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <Card className="w-full max-w-md bg-white/95 backdrop-blur border-[#ebdccd] shadow-xl shadow-amber-900/5 rounded-2xl overflow-hidden">
          <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600" />

          <CardHeader className="space-y-1.5 pt-7 pb-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-200/80 mx-auto flex items-center justify-center text-[#ea580c] shadow-sm mb-2">
              <UserPlus className="w-6 h-6 stroke-[2.2]" />
            </div>
            <CardTitle className="text-2xl font-black tracking-tight text-[#2b2520]">
              Create an Account
            </CardTitle>
            <CardDescription className="text-sm text-[#786c5e]">
              Sign up today to start logging your personal reading journey
            </CardDescription>
          </CardHeader>

          <form
            noValidate
            data-testid="register-form"
            onSubmit={handleSubmit}
          >
            <CardContent className="space-y-4 px-6 sm:px-8">
              {/* API error: only rendered when present */}
              {apiError && (
                <div
                  data-testid="error-auth"
                  className="rounded-xl bg-red-50/90 p-3.5 text-xs sm:text-sm text-red-600 border border-red-200/80 flex items-start gap-2.5"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
                  <span className="font-medium">{apiError}</span>
                </div>
              )}

              {/* Form success: only rendered when present */}
              {successMsg && (
                <div
                  data-testid="form-success"
                  className="rounded-xl bg-emerald-50/90 p-3.5 text-xs sm:text-sm text-emerald-700 border border-emerald-200/80 flex items-center gap-2.5 font-bold"
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* Email */}
              <div className="space-y-1.5">
                <Label htmlFor="register-email" className="text-xs font-bold text-[#423528]">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-3 text-[#a89988]" />
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
                    className="pl-9 h-10 border-[#dfd0bf] focus-visible:ring-[#ea580c] focus-visible:border-[#ea580c] bg-white rounded-xl text-sm"
                  />
                </div>
                {emailError && (
                  <p
                    data-testid="error-email"
                    className="text-xs text-red-600 mt-1 font-semibold flex items-center gap-1"
                  >
                    {emailError}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <Label htmlFor="register-password" className="text-xs font-bold text-[#423528]">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-3 text-[#a89988]" />
                  <Input
                    id="register-password"
                    data-testid="register-password"
                    type="password"
                    placeholder="At least 6 characters"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (apiError) setApiError('');
                    }}
                    className="pl-9 h-10 border-[#dfd0bf] focus-visible:ring-[#ea580c] focus-visible:border-[#ea580c] bg-white rounded-xl text-sm"
                  />
                </div>
                {passwordError && (
                  <p
                    data-testid="error-password"
                    className="text-xs text-red-600 mt-1 font-semibold flex items-center gap-1"
                  >
                    {passwordError}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <Label htmlFor="register-confirm-password" className="text-xs font-bold text-[#423528]">
                  Confirm Password
                </Label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 absolute left-3 top-3 text-[#a89988]" />
                  <Input
                    id="register-confirm-password"
                    data-testid="register-confirm-password"
                    type="password"
                    placeholder="Repeat password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (apiError) setApiError('');
                    }}
                    className="pl-9 h-10 border-[#dfd0bf] focus-visible:ring-[#ea580c] focus-visible:border-[#ea580c] bg-white rounded-xl text-sm"
                  />
                </div>
                {confirmPasswordError && (
                  <p
                    data-testid="error-confirm-password"
                    className="text-xs text-red-600 mt-1 font-semibold flex items-center gap-1"
                  >
                    {confirmPasswordError}
                  </p>
                )}
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4 px-6 sm:px-8 pb-8 pt-2">
              <Button
                type="submit"
                disabled={loading}
                data-testid="register-submit"
                className="w-full h-11 bg-gradient-to-r from-[#ea580c] via-[#f97316] to-[#ea580c] hover:from-[#c2410c] hover:to-[#ea580c] text-white font-bold rounded-xl shadow-md shadow-orange-500/20 active:scale-98 transition-all flex items-center justify-center gap-2"
              >
                <span>{loading ? 'Registering...' : 'Create Account'}</span>
                {!loading && <ArrowRight className="w-4 h-4" />}
              </Button>

              <p className="text-center text-xs sm:text-sm text-[#786c5e]">
                Already have an account?{' '}
                <Link
                  href="/login"
                  className="font-bold text-[#ea580c] hover:text-[#c2410c] hover:underline"
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
