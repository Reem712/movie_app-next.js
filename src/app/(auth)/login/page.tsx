'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Tv, Eye, EyeOff, LogIn, Star, Film, Bookmark } from 'lucide-react';
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
    <div className="relative min-h-[100dvh] flex items-center justify-center p-5 overflow-hidden bg-[#0f0e1a] font-sans">

      {/* ── Background blobs ── */}
      <div className="pointer-events-none absolute -top-20 -left-20 w-[340px] h-[340px] rounded-full bg-[#6c63ff]/[0.22] blur-[80px]" />
      <div className="pointer-events-none absolute -bottom-16 -right-16 w-[280px] h-[280px] rounded-full bg-[#e2b96f]/[0.14] blur-[70px]" />
      <div className="pointer-events-none absolute top-[40%] left-[55%] w-[200px] h-[200px] rounded-full bg-[#6c63ff]/[0.10] blur-[60px]" />

      {/* ── Grid ── */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.03) 1px,transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* ── Card ── */}
      <div
        className={`relative z-10 w-full max-w-[380px] rounded-[28px] border border-white/[0.09] overflow-hidden ${shaking ? 'animate-shake' : ''}`}
        style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)' } as React.CSSProperties}
      >

        {/* ── Card top ── */}
        <div className="px-8 pt-8 pb-6 border-b border-white/[0.06]">
          <div className="flex items-center gap-[10px] mb-6">
            <div className="w-9 h-9 rounded-[10px] bg-[#6c63ff] flex items-center justify-center">
              <Tv size={17} color="#fff" />
            </div>
            <span className="text-[14px] font-extrabold text-white tracking-tight">CineExplorer</span>
          </div>

          <div className="inline-flex items-center gap-[5px] bg-[#e2b96f]/[0.12] border border-[#e2b96f]/[0.22] rounded-full px-[11px] py-1 mb-[10px]">
            <Star size={11} color="#e2b96f" fill="#e2b96f" />
            <span className="text-[10px] font-bold text-[#e2b96f] tracking-[0.05em] uppercase">
              Your Cinema Universe
            </span>
          </div>

          <h1 className="text-[24px] font-extrabold text-white tracking-tight leading-tight mb-[5px]">
            Welcome back
          </h1>
          <p className="text-[12px] text-white/35">Sign in to continue exploring</p>
        </div>

        {/* ── Card body ── */}
        <div className="px-8 pt-6 pb-8">

          {/* Error */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-[10px] px-3 py-2.5 mb-4">
              <p className="text-[12px] font-medium text-red-400">{error}</p>
            </div>
          )}

          {/* Username */}
          <label className="block text-[10px] font-bold text-white/35 uppercase tracking-[0.08em] mb-[7px]">
            Username
          </label>
          <div className="relative mb-[14px]">
            <span className="absolute left-[13px] top-1/2 -translate-y-1/2 text-white/25 pointer-events-none">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
            </span>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. emilys"
              autoCapitalize="none"
              className="w-full bg-white/[0.06] border-[1.5px] border-white/[0.08] rounded-[12px] pl-[40px] pr-[13px] py-3 text-[13px] text-white outline-none placeholder:text-white/20 focus:border-[#6c63ff]/60 focus:bg-[#6c63ff]/[0.07] transition-colors"
            />
          </div>

          {/* Password */}
          <label className="block text-[10px] font-bold text-white/35 uppercase tracking-[0.08em] mb-[7px]">
            Password
          </label>
          <div className="relative mb-[6px]">
            <span className="absolute left-[13px] top-1/2 -translate-y-1/2 text-white/25 pointer-events-none">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </span>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={showPass ? 'text' : 'password'}
              placeholder="••••••••"
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              className="w-full bg-white/[0.06] border-[1.5px] border-white/[0.08] rounded-[12px] pl-[40px] pr-[40px] py-3 text-[13px] text-white outline-none placeholder:text-white/20 focus:border-[#6c63ff]/60 focus:bg-[#6c63ff]/[0.07] transition-colors"
            />
            <button
              onClick={() => setShowPass((p) => !p)}
              className="absolute right-[12px] top-1/2 -translate-y-1/2 text-white/25 hover:text-white/55 transition-colors"
            >
              {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>

          {/* Submit */}
          <button
            onClick={handleLogin}
            disabled={isLoading}
            className="relative w-full mt-[14px] bg-[#6c63ff] hover:bg-[#5b52ee] text-white rounded-[12px] py-[14px] text-[13px] font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 overflow-hidden"
          >
            <span className="btn-shine absolute top-0 left-[-100%] w-[60%] h-full" />
            <LogIn size={15} />
            {isLoading ? 'Signing in…' : 'Sign In'}
          </button>

          {/* Hint */}
          <div className="flex items-center gap-[10px] bg-white/[0.04] border border-white/[0.06] rounded-[10px] px-3 py-[10px] mt-[14px]">
            <div className="w-7 h-7 rounded-[8px] bg-[#6c63ff]/[0.18] flex items-center justify-center flex-shrink-0">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6c63ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
            </div>
            <p className="text-[11px] text-white/30 leading-relaxed">
              Try demo:{' '}
              <span className="text-white/60 font-bold">emilys</span>
              {' '}·{' '}
              <span className="text-white/60 font-bold">emilyspass</span>
            </p>
          </div>

          {/* Tags */}
          <div className="flex gap-[6px] mt-[14px] justify-center flex-wrap">
            {[
              { icon: Film,     label: '10k+ movies' },
              { icon: Star,     label: 'Ratings'     },
              { icon: Bookmark, label: 'Watchlist'   },
            ].map(({ icon: Icon, label }) => (
              <span
                key={label}
                className="flex items-center gap-1 text-[10px] font-semibold px-[10px] py-1 rounded-full border border-white/[0.07] bg-white/[0.03] text-white/30"
              >
                <Icon size={11} color="#6c63ff" />
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%,100%{transform:translateX(0)}
          20%{transform:translateX(-7px)}
          40%{transform:translateX(7px)}
          60%{transform:translateX(-4px)}
          80%{transform:translateX(4px)}
        }
        .animate-shake { animation: shake 0.4s ease; }
        @keyframes shine { 0%{left:-100%} 60%,100%{left:160%} }
        .btn-shine {
          background: linear-gradient(90deg,transparent,rgba(255,255,255,0.12),transparent);
          animation: shine 2.4s infinite;
        }
      `}</style>
    </div>
  );
}