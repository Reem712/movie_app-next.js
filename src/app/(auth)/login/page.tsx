'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { loginUser } from '@/services/authService';

/* ─── keyframes injected once ───────────────────────────────────────────── */
const injectKeyframes = () => {
  if (typeof document === 'undefined') return;
  if (document.getElementById('login-keyframes')) return;
  const style = document.createElement('style');
  style.id = 'login-keyframes';
  style.textContent = `
    @keyframes shake {
      0%,100% { transform: translateX(0); }
      20%,60%  { transform: translateX(-6px); }
      40%,80%  { transform: translateX(6px); }
    }
    @keyframes shine {
      0%   { left: -100%; }
      100% { left: 150%; }
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    @keyframes pulse {
      0%,100% { opacity: 1; }
      50%      { opacity: 0.4; }
    }
  `;
  document.head.appendChild(style);
};

export default function LoginPage() {
  injectKeyframes();

  const { setUser, setLoading, setError, isLoading, error } = useAuthStore();
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [shaking, setShaking]   = useState(false);

  const shake = () => {
    setShaking(true);
    setTimeout(() => setShaking(false), 420);
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
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user }),
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

  /* ── shared tokens ───────────────────────────────────────────────────── */
  const accent = '#6c63ff';

  const inputStyle: React.CSSProperties = {
    width: '100%',
    paddingLeft: 38,
    paddingRight: 12,
    paddingTop: 11,
    paddingBottom: 11,
    background: '#F9F8F6',
    border: '1px solid #E8E4DC',
    borderRadius: 10,
    fontSize: 13,
    color: '#0f0e1a',
    outline: 'none',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
    transition: 'border-color 0.15s, background 0.15s, box-shadow 0.15s',
  };

  return (
    <div style={{ display: 'flex', minHeight: '100dvh' }}>

      {/* ══════════════════════════
          LEFT PANEL
      ══════════════════════════ */}
      <div style={{
        display: 'none',
        width: 420,
        flexShrink: 0,
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: '#12101f',
        padding: '40px 40px',
        position: 'relative',
        overflow: 'hidden',
      }}
        className="md-left-panel"
      >
        {/* Blobs */}
        <div style={{
          position: 'absolute', top: -96, left: -80,
          width: 300, height: 300, borderRadius: '50%',
          background: 'radial-gradient(circle,rgba(108,99,255,0.19) 0%,transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: 56, right: -40,
          width: 200, height: 200, borderRadius: '50%',
          background: 'radial-gradient(circle,rgba(226,185,111,0.13) 0%,transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* Grid overlay */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)',
          backgroundSize: '48px 48px',
        }} />

        {/* Logo */}
        <div style={{ position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10, background: accent,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2" />
              <path d="M16 3l-4 4-4-4" />
              <line x1="8" y1="12" x2="8" y2="16" />
              <line x1="16" y1="12" x2="16" y2="16" />
              <line x1="12" y1="11" x2="12" y2="17" />
            </svg>
          </div>
          <span style={{ fontSize: 14, fontWeight: 600, color: '#fff', letterSpacing: -0.2 }}>CineExplorer</span>
        </div>

        {/* Hero */}
        <div style={{ position: 'relative', zIndex: 10, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '48px 0' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 99, padding: '6px 12px', marginBottom: 20, width: 'fit-content',
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: '50%', background: '#34d399',
              animation: 'pulse 2s ease-in-out infinite',
              display: 'inline-block',
            }} />
            <span style={{ fontSize: 10, fontWeight: 500, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.06em' }}>
              Powered by TMDB
            </span>
          </div>

          <h1 style={{
            fontSize: 'clamp(28px,3vw,36px)', fontWeight: 800, color: '#fff',
            lineHeight: 1.18, letterSpacing: -1, marginBottom: 16,
          }}>
            Discover your<br />
            <em style={{ fontStyle: 'normal', color: accent }}>next favourite</em><br />
            film.
          </h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', lineHeight: 1.7 }}>
            Track what you watch, explore what&apos;s next.<br />
            Your personal cinema universe.
          </p>
        </div>

        {/* Stats */}
        <div style={{ position: 'relative', zIndex: 10 }}>
          <div style={{
            display: 'flex', alignItems: 'center',
            borderTop: '1px solid rgba(255,255,255,0.07)',
            borderBottom: '1px solid rgba(255,255,255,0.07)',
            padding: '20px 0', marginBottom: 20,
          }}>
            {[
              { num: '10k+', lbl: 'Movies & series' },
              { num: '4.8',  lbl: 'Avg rating'      },
              { num: '∞',    lbl: 'Watchlists'       },
            ].map((s, i) => (
              <React.Fragment key={s.lbl}>
                {i > 0 && <div style={{ width: 1, height: 28, background: 'rgba(255,255,255,0.1)' }} />}
                <div style={{ flex: 1, textAlign: 'center' }}>
                  <span style={{ display: 'block', fontSize: 20, fontWeight: 800, color: '#fff', letterSpacing: -0.5, lineHeight: 1.2 }}>{s.num}</span>
                  <span style={{ display: 'block', fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 2, letterSpacing: '0.04em' }}>{s.lbl}</span>
                </div>
              </React.Fragment>
            ))}
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {['Favourites', 'Watchlist', 'Ratings', 'Discover'].map((p) => (
              <span key={p} style={{
                fontSize: 10, fontWeight: 500, color: 'rgba(255,255,255,0.35)',
                border: '1px solid rgba(255,255,255,0.1)', borderRadius: 99,
                padding: '4px 12px', letterSpacing: '0.04em', background: 'rgba(255,255,255,0.04)',
              }}>
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════
          RIGHT PANEL
      ══════════════════════════ */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 16px',
        background: '#F4F3F0',
      }}>
        {/* Card */}
        <div style={{
          width: '100%',
          maxWidth: 380,
          background: '#fff',
          borderRadius: 20,
          border: '1px solid rgba(0,0,0,0.08)',
          overflow: 'hidden',
          boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06)',
          animation: shaking ? 'shake 0.42s ease' : 'none',
        }}>

          {/* Card header */}
          <div style={{
            padding: '18px 24px',
            borderBottom: '1px solid rgba(0,0,0,0.06)',
            background: '#FAFAF9',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}>
            <div style={{
              width: 26, height: 26, borderRadius: 7, background: accent,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" />
                <path d="M16 3l-4 4-4-4" />
              </svg>
            </div>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#1a1728', letterSpacing: -0.2 }}>CineExplorer</span>
          </div>

          {/* Card body */}
          <div style={{ padding: '28px 24px 24px' }}>

            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: '#0f0e1a', letterSpacing: -0.5, margin: '0 0 4px', lineHeight: 1.2 }}>
                Welcome back
              </h2>
              <p style={{ fontSize: 12, color: '#9CA3AF', margin: 0 }}>Sign in to continue exploring</p>
            </div>

            {/* Error */}
            {error && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: '#fef2f2', border: '1px solid #fecaca',
                borderRadius: 10, padding: '10px 12px', marginBottom: 16,
                color: '#ef4444', fontSize: 12, fontWeight: 500,
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* Username */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 10, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
                Username
              </label>
              <div style={{ position: 'relative' }}>
                <svg style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#C4B5A5', pointerEvents: 'none' }} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                </svg>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. emilys"
                  autoCapitalize="none"
                  autoComplete="username"
                  style={inputStyle}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = accent;
                    e.currentTarget.style.background = '#fff';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(108,99,255,0.08)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#E8E4DC';
                    e.currentTarget.style.background = '#F9F8F6';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 10, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <svg style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#C4B5A5', pointerEvents: 'none' }} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                  style={{ ...inputStyle, paddingRight: 40 }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = accent;
                    e.currentTarget.style.background = '#fff';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(108,99,255,0.08)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#E8E4DC';
                    e.currentTarget.style.background = '#F9F8F6';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((p) => !p)}
                  aria-label="Toggle password"
                  style={{
                    position: 'absolute', right: 11, top: '50%', transform: 'translateY(-50%)',
                    display: 'flex', alignItems: 'center', padding: 2,
                    color: '#C4B5A5', background: 'transparent', border: 'none', cursor: 'pointer',
                  }}
                >
                  {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="button"
              onClick={handleLogin}
              disabled={isLoading}
              style={{
                position: 'relative',
                width: '100%',
                marginTop: 6,
                padding: '13px 0',
                background: isLoading ? 'rgba(108,99,255,0.55)' : accent,
                color: '#fff',
                borderRadius: 10,
                fontSize: 13,
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 7,
                overflow: 'hidden',
                border: 'none',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit',
                letterSpacing: -0.1,
                transition: 'background 0.15s, transform 0.1s',
              }}
              onMouseEnter={(e) => { if (!isLoading) (e.currentTarget as HTMLElement).style.background = '#5b52ee'; }}
              onMouseLeave={(e) => { if (!isLoading) (e.currentTarget as HTMLElement).style.background = accent; }}
              onMouseDown={(e) => { if (!isLoading) (e.currentTarget as HTMLElement).style.transform = 'scale(0.99)'; }}
              onMouseUp={(e) => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; }}
            >
              {/* Shine overlay */}
              <span style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: '-100%',
                width: '55%',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
                animation: 'shine 2.6s infinite',
                pointerEvents: 'none',
              }} />

              {isLoading ? (
                <>
                  <span style={{
                    width: 14, height: 14, borderRadius: '50%',
                    border: '2px solid rgba(255,255,255,0.35)',
                    borderTopColor: '#fff',
                    animation: 'spin 0.7s linear infinite',
                    display: 'inline-block',
                    flexShrink: 0,
                  }} />
                  Signing in…
                </>
              ) : (
                <>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                    <polyline points="10 17 15 12 10 7"/>
                    <line x1="15" y1="12" x2="3" y2="12"/>
                  </svg>
                  Sign in
                </>
              )}
            </button>

            {/* Demo hint */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              background: '#F9F8F6', border: '1px solid #E8E4DC',
              borderRadius: 10, padding: '10px 12px', marginTop: 14,
            }}>
              <div style={{
                width: 26, height: 26, borderRadius: 7, background: '#EDEAF4',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
                </svg>
              </div>
              <p style={{ fontSize: 11, color: '#9CA3AF', lineHeight: 1.5, margin: 0 }}>
                Try demo:{' '}
                <strong style={{ color: '#6B7280', fontWeight: 600 }}>emilys</strong>
                {' · '}
                <strong style={{ color: '#6B7280', fontWeight: 600 }}>emilyspass</strong>
              </p>
            </div>
          </div>

          {/* Card footer */}
          <div style={{
            padding: '14px 24px',
            borderTop: '1px solid rgba(0,0,0,0.06)',
            background: '#FAFAF9',
            display: 'flex', gap: 6, flexWrap: 'wrap',
          }}>
            {['10k+ movies', 'Ratings', 'Watchlist'].map((t) => (
              <span key={t} style={{
                fontSize: 10, fontWeight: 500, color: '#C4B5A5',
                border: '1px solid #E8E4DC', borderRadius: 99,
                padding: '3px 10px', background: '#fff', letterSpacing: '0.04em',
              }}>
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Responsive: show left panel on md+ */}
      <style>{`
        @media (min-width: 768px) {
          .md-left-panel { display: flex !important; }
        }
      `}</style>
    </div>
  );
}