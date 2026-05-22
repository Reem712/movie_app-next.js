'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Tv, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { loginUser } from '@/services/authService';

export default function LoginPage() {
  const { setUser, setLoading, setError, isLoading, error } = useAuthStore();
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [shaking, setShaking]   = useState(false);

  const shake = () => {
    setShaking(true);
    setTimeout(() => setShaking(false), 400);
  };

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      setError('Please enter your username and password.');
      shake();
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const user = await loginUser({ username: username.trim(), password });
      await fetch('/api/auth', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ user }),
      });
      setUser(user);
      router.push('/home');
    } catch (err: any) {
      setError(err.message ?? 'Login failed. Please try again.');
      shake();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-gradient-to-br from-[#EDE5D8] via-[#F0EAF5] to-[#F8F7F4] flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-[380px]">

        {/* ── Logo ── */}
        <div className="text-center mb-8">
          <div className="w-[56px] h-[56px] rounded-[16px] bg-[#6c63ff] flex items-center justify-center mx-auto mb-3 shadow-[0_8px_24px_rgba(108,99,255,0.3)]">
            <Tv size={24} color="#fff" />
          </div>
          <h1 className="text-[22px] font-extrabold text-[#1A1A2E] tracking-tight mb-1">
            CineExplorer
          </h1>
          <p className="text-[13px] text-[#9CA3AF]">Your personal cinema universe</p>
        </div>

        {/* ── Card ── */}
        <div className={`bg-white rounded-[18px] p-6 border border-black/[0.07] ${shaking ? 'animate-shake' : ''}`}>
          <h2 className="text-[17px] font-extrabold text-[#1A1A2E] tracking-tight mb-5">
            Sign in
          </h2>

          {/* Error */}
          {error && (
            <div className="bg-red-500/[0.08] rounded-[10px] p-3 mb-4 border-l-[3px] border-red-500">
              <p className="text-[13px] font-medium text-red-500">{error}</p>
            </div>
          )}

          {/* Username */}
          <div className="mb-4">
            <label className="block text-[10px] font-bold text-[#9CA3AF] uppercase tracking-[0.08em] mb-[6px]">
              Username
            </label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. emilys"
              autoCapitalize="none"
              className="w-full bg-[#F8F7F4] border border-black/[0.08] rounded-[10px] px-[13px] py-[11px] text-[13px] text-[#1A1A2E] outline-none placeholder:text-[#C4B5A5] focus:border-[#6c63ff]/40 focus:bg-white transition-colors"
            />
          </div>

          {/* Password */}
          <div className="mb-5">
            <label className="block text-[10px] font-bold text-[#9CA3AF] uppercase tracking-[0.08em] mb-[6px]">
              Password
            </label>
            <div className="relative">
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPass ? 'text' : 'password'}
                placeholder="••••••••"
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                className="w-full bg-[#F8F7F4] border border-black/[0.08] rounded-[10px] px-[13px] py-[11px] pr-[40px] text-[13px] text-[#1A1A2E] outline-none placeholder:text-[#C4B5A5] focus:border-[#6c63ff]/40 focus:bg-white transition-colors"
              />
              <button
                onClick={() => setShowPass((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280] transition-colors"
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full bg-[#6c63ff] text-white rounded-[10px] py-[13px] text-[13px] font-bold tracking-[0.2px] disabled:opacity-50 hover:bg-[#5b52ee] transition-colors"
          >
            {isLoading ? 'Signing in…' : 'Sign In'}
          </button>

          {/* Hint */}
          <p className="text-center text-[11px] text-[#9CA3AF] mt-4">
            Demo:{' '}
            <span className="text-[#1A1A2E] font-semibold">emilys</span>
            {' '}·{' '}
            <span className="text-[#1A1A2E] font-semibold">emilyspass</span>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%,100% { transform:translateX(0); }
          20%      { transform:translateX(-7px); }
          40%      { transform:translateX(7px); }
          60%      { transform:translateX(-4px); }
          80%      { transform:translateX(4px); }
        }
        .animate-shake { animation: shake 0.4s ease; }
      `}</style>
    </div>
  );
}