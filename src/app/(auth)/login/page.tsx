'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Tv, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { loginUser } from '@/services/authService';

/* ─── Palette ── */
const C = {
  bg:          '#0a0a0f',
  surface:     '#13131a',
  card:        '#1a1a24',
  border:      'rgba(255,255,255,0.07)',
  text:        '#f0f0f5',
  muted:       '#7a7a90',
  primary:     '#6c63ff',
  primarySoft: 'rgba(108,99,255,0.15)',
  error:       '#ef4444',
  errorSoft:   'rgba(239,68,68,0.12)',
};

export default function LoginPage() {
  const { setUser, setLoading, setError, isLoading, error } = useAuthStore();
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [shaking, setShaking]   = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

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
    <div style={{
      minHeight:       '100dvh',
      backgroundColor: C.bg,
      fontFamily:      "'DM Sans', -apple-system, sans-serif",
      display:         'flex',
      alignItems:      'center',
      justifyContent:  'center',
      padding:         24,
      /* subtle radial glow behind the card */
      background: `radial-gradient(ellipse 80% 60% at 50% 0%, rgba(108,99,255,0.12) 0%, ${C.bg} 70%)`,
    }}>
      <div style={{ width: '100%', maxWidth: 400 }}>

        {/* ── Logo ── */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{
            width: 64, height: 64, borderRadius: 18,
            backgroundColor: C.primary,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 8px 32px rgba(108,99,255,0.35)',
          }}>
            <Tv size={28} color="#fff" />
          </div>
          <h1 style={{
            fontSize: 28, fontWeight: 800, color: C.text,
            letterSpacing: -0.5, margin: '0 0 6px',
          }}>
            CineExplorer
          </h1>
          <p style={{ fontSize: 14, color: C.muted, margin: 0 }}>
            Your personal cinema universe
          </p>
        </div>

        {/* ── Card ── */}
        <div
          ref={cardRef}
          className={shaking ? 'shake' : ''}
          style={{
            backgroundColor: C.card,
            borderRadius:    20,
            padding:         28,
            border:          `1px solid ${C.border}`,
            boxShadow:       '0 8px 40px rgba(0,0,0,0.4)',
          }}
        >
          <h2 style={{
            fontSize: 20, fontWeight: 700, color: C.text,
            margin: '0 0 22px', letterSpacing: -0.3,
          }}>
            Sign in
          </h2>

          {/* Error */}
          {error && (
            <div style={{
              backgroundColor: C.errorSoft,
              borderRadius:    10,
              padding:         12,
              marginBottom:    18,
              borderLeft:      `3px solid ${C.error}`,
            }}>
              <p style={{ color: C.error, fontSize: 13, fontWeight: 500, margin: 0 }}>{error}</p>
            </div>
          )}

          {/* Username */}
          <div style={{ marginBottom: 16 }}>
            <label style={{
              fontSize: 12, fontWeight: 600, color: C.muted,
              display: 'block', marginBottom: 7, letterSpacing: '0.03em',
            }}>
              USERNAME
            </label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. emilys"
              autoCapitalize="none"
              style={{
                width:           '100%',
                backgroundColor: C.surface,
                border:          `1px solid ${C.border}`,
                borderRadius:    12,
                padding:         '13px 14px',
                fontSize:        14,
                color:           C.text,
                outline:         'none',
                boxSizing:       'border-box',
                fontFamily:      "'DM Sans', sans-serif",
              }}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: 22 }}>
            <label style={{
              fontSize: 12, fontWeight: 600, color: C.muted,
              display: 'block', marginBottom: 7, letterSpacing: '0.03em',
            }}>
              PASSWORD
            </label>
            <div style={{ position: 'relative' }}>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPass ? 'text' : 'password'}
                placeholder="••••••••"
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                style={{
                  width:           '100%',
                  backgroundColor: C.surface,
                  border:          `1px solid ${C.border}`,
                  borderRadius:    12,
                  padding:         '13px 44px 13px 14px',
                  fontSize:        14,
                  color:           C.text,
                  outline:         'none',
                  boxSizing:       'border-box',
                  fontFamily:      "'DM Sans', sans-serif",
                }}
              />
              <button
                onClick={() => setShowPass((p) => !p)}
                style={{
                  position:   'absolute',
                  right:      12,
                  top:        '50%',
                  transform:  'translateY(-50%)',
                  background: 'none',
                  border:     'none',
                  cursor:     'pointer',
                  color:      C.muted,
                  display:    'flex',
                  padding:    0,
                }}
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={handleLogin}
            disabled={isLoading}
            style={{
              width:           '100%',
              backgroundColor: C.primary,
              color:           '#fff',
              border:          'none',
              borderRadius:    12,
              padding:         '14px 0',
              fontSize:        15,
              fontWeight:      700,
              cursor:          isLoading ? 'not-allowed' : 'pointer',
              opacity:         isLoading ? 0.65 : 1,
              letterSpacing:   0.2,
              fontFamily:      "'DM Sans', sans-serif",
              boxShadow:       isLoading ? 'none' : '0 4px 16px rgba(108,99,255,0.35)',
            }}
          >
            {isLoading ? 'Signing in…' : 'Sign In'}
          </button>

          {/* Hint */}
          <p style={{
            textAlign: 'center', color: C.muted,
            fontSize: 12, marginTop: 18, marginBottom: 0,
          }}>
            Demo: username <span style={{ color: C.text, fontWeight: 600 }}>emilys</span>
            {' '}· password <span style={{ color: C.text, fontWeight: 600 }}>emilyspass</span>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          20%      { transform: translateX(-8px); }
          40%      { transform: translateX(8px); }
          60%      { transform: translateX(-5px); }
          80%      { transform: translateX(5px); }
        }
        .shake { animation: shake 0.4s ease; }
        input::placeholder { color: #4a4a60; }
        input:focus { border-color: rgba(108,99,255,0.5) !important; }
      `}</style>
    </div>
  );
}