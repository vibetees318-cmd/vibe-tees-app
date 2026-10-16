import React, { useState } from 'react';
import { Phone, Mail, Lock, User, ArrowRight, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { api } from '../services/api';
import { signInWithGoogle, syncUserToFirestore } from '../services/firebase';
import { User as UserType } from '../types';

interface AuthScreenProps {
  onSuccess: (user: UserType) => void;
  onCancel?: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onSuccess, onCancel }) => {
  const [authMethod, setAuthMethod] = useState<'phone' | 'email'>('phone');
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  // Phone state (Defaulted to +91 98765 43210 for instant OTP preview)
  const [phone, setPhone] = useState('+91 98765 43210');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');

  // Email / Password state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // UI state
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Send OTP handler
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!phone || phone.replace(/\D/g, '').length < 8) {
      setError('Please enter a valid phone number (minimum 8 digits)');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setOtpSent(true);
      setOtpCode('584291'); // Auto-filled mock OTP for instant frictionless login
    }, 400);
  };

  // Verify OTP & Login
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (otpCode.length < 4) {
      setError('Please enter the verification code');
      return;
    }
    setIsLoading(true);
    try {
      const user = await api.login(phone, otpCode, true);
      syncUserToFirestore(user).catch(() => {});
      onSuccess(user);
    } catch (err: any) {
      setError(err?.message || 'Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Google Sign-In with Firebase Auth
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const user = await signInWithGoogle();
      onSuccess(user);
    } catch (err: any) {
      console.warn('Google sign-in fallback:', err);
      setError(err?.message || 'Google sign-in cancelled or failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Email Submit
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    try {
      if (authMode === 'signup') {
        if (!fullName.trim()) {
          setError('Please provide your full name');
          setIsLoading(false);
          return;
        }
        const user = await api.signup({
          fullName,
          email,
          phone: phone || '+1 (555) 000-0000',
        });
        onSuccess(user);
      } else {
        const user = await api.login(email, password, false);
        onSuccess(user);
      }
    } catch (err: any) {
      setError(err?.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Quick Demo Account Click
  const handleDemoLogin = async (role: 'Customer' | 'Admin') => {
    setIsLoading(true);
    setError(null);
    try {
      const user = await api.switchDemoUser(role);
      onSuccess(user);
    } catch (err: any) {
      setError('Failed to switch demo user');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-6 bg-zinc-950 text-white min-h-[620px]">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center font-display font-black text-amber-400 text-sm">
              V
            </div>
            <span className="font-display font-black tracking-wider text-white text-sm">
              VIBE<span className="text-amber-400">TEES</span>
            </span>
          </div>

          {onCancel && (
            <button
              onClick={onCancel}
              className="text-xs text-zinc-400 hover:text-white"
            >
              Skip
            </button>
          )}
        </div>

        <div className="mt-6">
          <h2 className="text-2xl font-display font-black text-white tracking-tight">
            {authMode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Access VIP drop notifications, track orders, or resell streetwear
          </p>
        </div>

        {/* Google Sign-in with Firebase Auth */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="mt-4 w-full h-11 rounded-xl bg-white hover:bg-zinc-100 text-zinc-900 font-bold text-xs flex items-center justify-center gap-2.5 transition-all active:scale-98 shadow-sm"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Continue with Google (Firebase)</span>
        </button>

        <div className="flex items-center gap-2 mt-4 text-[10px] uppercase font-mono text-zinc-500">
          <div className="flex-1 h-px bg-zinc-800" />
          <span>or mobile otp sign-in</span>
          <div className="flex-1 h-px bg-zinc-800" />
        </div>

        {/* Tab Switcher: Phone OTP vs Email */}
        <div className="mt-4 p-1 bg-zinc-900/90 rounded-xl border border-zinc-800/80 flex items-center gap-1">
          <button
            type="button"
            onClick={() => {
              setAuthMethod('phone');
              setError(null);
            }}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              authMethod === 'phone'
                ? 'bg-amber-400 text-zinc-950 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Mobile OTP</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMethod('email');
              setError(null);
            }}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              authMethod === 'email'
                ? 'bg-amber-400 text-zinc-950 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Email & Password</span>
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="mt-3 p-3 rounded-xl bg-red-950/60 border border-red-800/60 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Body */}
        <div className="mt-5">
          {authMethod === 'phone' ? (
            /* Phone OTP Flow */
            !otpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                    Mobile Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 transition-colors"
                      required
                    />
                  </div>
                  <p className="text-[11px] text-zinc-500 mt-1.5">
                    We'll send a 6-digit OTP code to verify your phone number.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors active:scale-95 disabled:opacity-50"
                >
                  {isLoading ? 'Sending Code...' : 'Get OTP Code'}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            ) : (
              /* OTP Verification Step */
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800 flex items-center justify-between">
                  <div className="text-xs">
                    <span className="text-zinc-400">Code sent to </span>
                    <span className="text-white font-medium">{phone}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setOtpSent(false)}
                    className="text-xs text-amber-400 hover:underline"
                  >
                    Change
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                    Enter 6-Digit Verification Code
                  </label>
                  <input
                    type="text"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="584291"
                    maxLength={6}
                    autoFocus
                    className="w-full text-center tracking-[0.5em] font-mono text-base bg-zinc-900 border border-zinc-700 rounded-xl py-3 text-amber-400 focus:outline-none focus:border-amber-400"
                    required
                  />
                  <p className="text-[11px] text-zinc-400 mt-1 text-center">
                    Demo OTP is prefilled: <strong className="text-amber-400 font-mono">584291</strong>
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors active:scale-95 disabled:opacity-50"
                >
                  {isLoading ? 'Verifying...' : 'Verify & Continue'}
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              </form>
            )
          ) : (
            /* Email & Password Flow */
            <form onSubmit={handleEmailSubmit} className="space-y-3.5">
              {authMode === 'signup' && (
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Alex Rivera"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                      required
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@vibetees.com"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors active:scale-95 disabled:opacity-50 mt-4"
              >
                {isLoading ? 'Processing...' : authMode === 'login' ? 'Sign In' : 'Create Account'}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode(authMode === 'login' ? 'signup' : 'login');
                    setError(null);
                  }}
                  className="text-xs text-zinc-400 hover:text-white"
                >
                  {authMode === 'login'
                    ? "Don't have an account? Sign up"
                    : 'Already have an account? Sign in'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* 1-Click Demo Profiles for Rapid Testing */}
      <div className="pt-6 border-t border-zinc-800/80 mt-6 space-y-2">
        <div className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
          <span>Quick 1-Click Evaluation Login</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleDemoLogin('Customer')}
            className="py-2 px-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-left text-xs transition-colors"
          >
            <div className="font-semibold text-zinc-200">Pranjit Baghwar</div>
            <div className="text-[10px] text-zinc-400">Customer & Reseller</div>
          </button>
          <button
            type="button"
            onClick={() => handleDemoLogin('Admin')}
            className="py-2 px-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-left text-xs transition-colors"
          >
            <div className="font-semibold text-amber-400">Store Lead</div>
            <div className="text-[10px] text-zinc-400">Admin Mode</div>
          </button>
        </div>
      </div>
    </div>
  );
};
