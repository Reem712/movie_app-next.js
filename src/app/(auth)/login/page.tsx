'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { loginUser } from '@/services/authService';

export default function LoginPage() {
  const { setUser, setLoading, setError, isLoading, error } = useAuthStore();
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [shaking, setShaking] = useState(false);

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

  return (
    <div className="lg-root">

      {/* ── Left Panel ── */}
      <div className="lg-left">
        <div className="lg-noise" />
        <div className="lg-blob lg-blob-1" />
        <div className="lg-blob lg-blob-2" />
        <div className="lg-blob lg-blob-3" />

        {/* Grid lines */}
        <div className="lg-grid" />

        {/* Logo */}
        <div className="lg-logo">
          <div className="lg-logo-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2" />
              <path d="M16 3l-4 4-4-4" />
              <line x1="8" y1="12" x2="8" y2="16" />
              <line x1="16" y1="12" x2="16" y2="16" />
              <line x1="12" y1="11" x2="12" y2="17" />
            </svg>
          </div>
          <span className="lg-logo-txt">CineExplorer</span>
        </div>

        {/* Main copy */}
        <div className="lg-hero">
          <div className="lg-badge">
            <span className="lg-badge-dot" />
            <span>Powered by TMDB</span>
          </div>
          <h1 className="lg-h1">
            Discover your<br />
            <em>next favourite</em><br />
            film.
          </h1>
          <p className="lg-tagline">
            Track what you watch, explore what&apos;s next.<br />
            Your personal cinema universe.
          </p>
        </div>

        {/* Stats row */}
        <div className="lg-stats">
          <div className="lg-stat">
            <span className="lg-stat-num">10k+</span>
            <span className="lg-stat-lbl">Movies &amp; series</span>
          </div>
          <div className="lg-stat-div" />
          <div className="lg-stat">
            <span className="lg-stat-num">4.8</span>
            <span className="lg-stat-lbl">Avg rating</span>
          </div>
          <div className="lg-stat-div" />
          <div className="lg-stat">
            <span className="lg-stat-num">∞</span>
            <span className="lg-stat-lbl">Watchlists</span>
          </div>
        </div>

        {/* Feature pills */}
        <div className="lg-pills">
          {['Favourites', 'Watchlist', 'Ratings', 'Discover'].map((p) => (
            <span key={p} className="lg-pill">{p}</span>
          ))}
        </div>
      </div>

      {/* ── Right Panel ── */}
      <div className="lg-right">
        <div className={`lg-card ${shaking ? 'lg-shake' : ''}`}>

          {/* Card header */}
          <div className="lg-card-head">
            <div className="lg-card-logo">
              <div className="lg-card-logo-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="7" width="20" height="14" rx="2" />
                  <path d="M16 3l-4 4-4-4" />
                </svg>
              </div>
              <span>CineExplorer</span>
            </div>
          </div>

          {/* Card body */}
          <div className="lg-card-body">
            <div className="lg-card-title-wrap">
              <h2 className="lg-card-h">Welcome back</h2>
              <p className="lg-card-sub">Sign in to continue exploring</p>
            </div>

            {/* Error */}
            {error && (
              <div className="lg-error">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                <span>{error}</span>
              </div>
            )}

            {/* Username */}
            <div className="lg-field">
              <label className="lg-lbl">Username</label>
              <div className="lg-inp-wrap">
                <svg className="lg-inp-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
                <input
                  className="lg-inp"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. emilys"
                  autoCapitalize="none"
                  autoComplete="username"
                />
              </div>
            </div>

            {/* Password */}
            <div className="lg-field">
              <label className="lg-lbl">Password</label>
              <div className="lg-inp-wrap">
                <svg className="lg-inp-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                <input
                  className="lg-inp lg-inp-pass"
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                />
                <button
                  className="lg-eye"
                  type="button"
                  onClick={() => setShowPass((p) => !p)}
                  aria-label="Toggle password"
                >
                  {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              className="lg-btn"
              onClick={handleLogin}
              disabled={isLoading}
              type="button"
            >
              <span className="lg-btn-shine" />
              {isLoading ? (
                <>
                  <span className="lg-spinner" />
                  Signing in…
                </>
              ) : (
                <>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
                  Sign in
                </>
              )}
            </button>

            {/* Demo hint */}
            <div className="lg-demo">
              <div className="lg-demo-icon">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6c63ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
              </div>
              <p className="lg-demo-txt">
                Try demo: <strong>emilys</strong> · <strong>emilyspass</strong>
              </p>
            </div>
          </div>

          {/* Card footer */}
          <div className="lg-card-foot">
            {['10k+ movies', 'Ratings', 'Watchlist'].map((t) => (
              <span key={t} className="lg-tag">{t}</span>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        /* ── Reset ── */
        *, *::before, *::after { box-sizing: border-box; }

        /* ── Root ── */
        .lg-root {
          display: flex;
          min-height: 100dvh;
          font-family: 'DM Sans', system-ui, sans-serif;
        }

        /* ══════════════════════════
           LEFT PANEL
        ══════════════════════════ */
        .lg-left {
          width: 420px;
          flex-shrink: 0;
          background: #12101f;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 40px 40px 36px;
          position: relative;
          overflow: hidden;
        }

        /* Noise texture */
        .lg-noise {
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0.035;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
          background-size: 200px;
          z-index: 0;
        }

        /* Grid overlay */
        .lg-grid {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background-image:
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
          background-size: 48px 48px;
          z-index: 0;
        }

        /* Blobs */
        .lg-blob {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          z-index: 0;
        }
        .lg-blob-1 {
          width: 300px; height: 300px;
          background: radial-gradient(circle, #6c63ff30 0%, transparent 70%);
          top: -100px; left: -80px;
        }
        .lg-blob-2 {
          width: 200px; height: 200px;
          background: radial-gradient(circle, #e2b96f20 0%, transparent 70%);
          bottom: 60px; right: -40px;
        }
        .lg-blob-3 {
          width: 160px; height: 160px;
          background: radial-gradient(circle, #6c63ff18 0%, transparent 70%);
          top: 45%; left: 55%;
        }

        .lg-left > * { position: relative; z-index: 1; }

        /* Logo */
        .lg-logo {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .lg-logo-icon {
          width: 36px; height: 36px;
          border-radius: 10px;
          background: #6c63ff;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .lg-logo-txt {
          font-size: 14px;
          font-weight: 600;
          color: #fff;
          letter-spacing: -0.3px;
        }

        /* Hero */
        .lg-hero { flex: 1; display: flex; flex-direction: column; justify-content: center; padding: 48px 0 32px; }

        .lg-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(255,255,255,0.06);
          border: 0.5px solid rgba(255,255,255,0.12);
          border-radius: 100px;
          padding: 5px 12px;
          margin-bottom: 22px;
          width: fit-content;
        }
        .lg-badge-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #22c55e;
          box-shadow: 0 0 0 2px #22c55e33;
          animation: pulse 2s infinite;
        }
        .lg-badge span:last-child { font-size: 10px; font-weight: 500; color: rgba(255,255,255,0.5); letter-spacing: 0.06em; }

        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 2px #22c55e33; }
          50% { box-shadow: 0 0 0 5px #22c55e11; }
        }

        .lg-h1 {
          font-size: 36px;
          font-weight: 700;
          color: #fff;
          line-height: 1.18;
          letter-spacing: -1px;
          margin-bottom: 16px;
        }
        .lg-h1 em {
          font-style: normal;
          color: #6c63ff;
        }
        .lg-tagline {
          font-size: 13px;
          color: rgba(255,255,255,0.38);
          line-height: 1.7;
        }

        /* Stats */
        .lg-stats {
          display: flex;
          align-items: center;
          gap: 0;
          padding: 20px 0;
          border-top: 0.5px solid rgba(255,255,255,0.07);
          border-bottom: 0.5px solid rgba(255,255,255,0.07);
          margin-bottom: 20px;
        }
        .lg-stat { flex: 1; text-align: center; }
        .lg-stat-num {
          display: block;
          font-size: 20px;
          font-weight: 700;
          color: #fff;
          letter-spacing: -0.5px;
          line-height: 1.2;
        }
        .lg-stat-lbl {
          display: block;
          font-size: 10px;
          color: rgba(255,255,255,0.3);
          margin-top: 2px;
          letter-spacing: 0.04em;
        }
        .lg-stat-div {
          width: 0.5px;
          height: 28px;
          background: rgba(255,255,255,0.1);
        }

        /* Pills */
        .lg-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
        .lg-pill {
          font-size: 10px;
          font-weight: 500;
          color: rgba(255,255,255,0.35);
          border: 0.5px solid rgba(255,255,255,0.1);
          border-radius: 100px;
          padding: 4px 12px;
          letter-spacing: 0.04em;
          background: rgba(255,255,255,0.04);
        }

        /* ══════════════════════════
           RIGHT PANEL
        ══════════════════════════ */
        .lg-right {
          flex: 1;
          background: #F4F3F0;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 24px;
        }

        /* Card */
        .lg-card {
          width: 100%;
          max-width: 380px;
          background: #fff;
          border-radius: 20px;
          border: 0.5px solid rgba(0,0,0,0.08);
          overflow: hidden;
          box-shadow: 0 1px 2px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06);
        }

        @keyframes shake {
          0%,100%{transform:translateX(0)}
          20%{transform:translateX(-6px)}
          40%{transform:translateX(6px)}
          60%{transform:translateX(-3px)}
          80%{transform:translateX(3px)}
        }
        .lg-shake { animation: shake 0.42s ease; }

        /* Card header */
        .lg-card-head {
          padding: 18px 24px;
          border-bottom: 0.5px solid rgba(0,0,0,0.06);
          background: #FAFAF9;
        }
        .lg-card-logo {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .lg-card-logo-icon {
          width: 26px; height: 26px;
          border-radius: 7px;
          background: #6c63ff;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .lg-card-logo span {
          font-size: 12px;
          font-weight: 600;
          color: #1a1728;
          letter-spacing: -0.2px;
        }

        /* Card body */
        .lg-card-body { padding: 28px 24px 24px; }

        .lg-card-title-wrap { margin-bottom: 24px; }
        .lg-card-h {
          font-size: 22px;
          font-weight: 700;
          color: #0f0e1a;
          letter-spacing: -0.5px;
          margin-bottom: 4px;
          line-height: 1.2;
        }
        .lg-card-sub {
          font-size: 12px;
          color: #9CA3AF;
        }

        /* Error */
        .lg-error {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #fef2f2;
          border: 0.5px solid #fecaca;
          border-radius: 10px;
          padding: 10px 12px;
          margin-bottom: 16px;
          color: #ef4444;
          font-size: 12px;
          font-weight: 500;
        }

        /* Field */
        .lg-field { margin-bottom: 14px; }
        .lg-lbl {
          display: block;
          font-size: 10px;
          font-weight: 600;
          color: #9CA3AF;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 6px;
        }
        .lg-inp-wrap { position: relative; }
        .lg-inp-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #C4B5A5;
          pointer-events: none;
        }
        .lg-inp {
          width: 100%;
          padding: 11px 12px 11px 38px;
          background: #F9F8F6;
          border: 1px solid #E8E4DC;
          border-radius: 10px;
          font-size: 13px;
          color: #0f0e1a;
          outline: none;
          font-family: inherit;
          transition: border-color 0.15s, background 0.15s;
        }
        .lg-inp:focus {
          border-color: #6c63ff;
          background: #fff;
          box-shadow: 0 0 0 3px #6c63ff14;
        }
        .lg-inp::placeholder { color: #C4B5A5; }
        .lg-inp-pass { padding-right: 40px; }

        .lg-eye {
          position: absolute;
          right: 11px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: #C4B5A5;
          display: flex;
          align-items: center;
          padding: 2px;
          transition: color 0.13s;
        }
        .lg-eye:hover { color: #9CA3AF; }

        /* Submit button */
        .lg-btn {
          position: relative;
          width: 100%;
          margin-top: 6px;
          padding: 13px;
          background: #6c63ff;
          color: #fff;
          border: none;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 600;
          font-family: inherit;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          overflow: hidden;
          transition: background 0.15s, transform 0.1s;
          letter-spacing: -0.1px;
        }
        .lg-btn:hover:not(:disabled) { background: #5b52ee; }
        .lg-btn:active:not(:disabled) { transform: scale(0.99); }
        .lg-btn:disabled { opacity: 0.55; cursor: not-allowed; }

        @keyframes shine { 0%{left:-100%} 60%,100%{left:160%} }
        .lg-btn-shine {
          position: absolute;
          top: 0; left: -100%;
          width: 55%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
          animation: shine 2.6s infinite;
        }

        /* Spinner */
        @keyframes spin { to { transform: rotate(360deg); } }
        .lg-spinner {
          width: 14px; height: 14px;
          border: 2px solid rgba(255,255,255,0.35);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        /* Demo */
        .lg-demo {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #F9F8F6;
          border: 0.5px solid #E8E4DC;
          border-radius: 10px;
          padding: 10px 12px;
          margin-top: 14px;
        }
        .lg-demo-icon {
          width: 26px; height: 26px;
          border-radius: 7px;
          background: #EDEAF4;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .lg-demo-txt {
          font-size: 11px;
          color: #9CA3AF;
          line-height: 1.5;
        }
        .lg-demo-txt strong {
          color: #6B7280;
          font-weight: 600;
        }

        /* Card footer */
        .lg-card-foot {
          padding: 14px 24px;
          border-top: 0.5px solid rgba(0,0,0,0.06);
          background: #FAFAF9;
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }
        .lg-tag {
          font-size: 10px;
          font-weight: 500;
          color: #C4B5A5;
          border: 0.5px solid #E8E4DC;
          border-radius: 100px;
          padding: 3px 10px;
          background: #fff;
          letter-spacing: 0.04em;
        }

        /* ── Responsive ── */
        @media (max-width: 767px) {
          .lg-left { display: none; }
          .lg-right {
            background: #12101f;
            padding: 24px 16px;
          }
          .lg-card { box-shadow: none; }
        }
        @media (min-width: 768px) and (max-width: 1023px) {
          .lg-left { width: 340px; }
          .lg-h1 { font-size: 28px; }
        }
      `}</style>
    </div>
  );
}