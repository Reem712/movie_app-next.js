'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, User, Mail, AtSign, Shield,
  LogOut, ChevronRight, Tv, Check,
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

/* ─── Palette (identical to HomePage) ────────────────────────────────────── */
const C = {
  bg:          '#0a0a0f',
  surface:     '#13131a',
  card:        '#1a1a24',
  border:      'rgba(255,255,255,0.07)',
  text:        '#f0f0f5',
  muted:       '#7a7a90',
  primary:     '#6c63ff',
  primarySoft: 'rgba(108,99,255,0.15)',
  accent:      '#e2b96f',
  accentSoft:  'rgba(226,185,111,0.1)',
  error:       '#ef4444',
  errorSoft:   'rgba(239,68,68,0.12)',
  success:     '#10b981',
  successSoft: 'rgba(16,185,129,0.12)',
};

/* ─── Reusable sub-components ─────────────────────────────────────────────── */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <p style={{
        fontSize: 10, fontWeight: 700, color: C.muted,
        letterSpacing: '0.1em', textTransform: 'uppercase',
        margin: '0 0 10px 2px',
      }}>
        {title}
      </p>
      <div style={{
        backgroundColor: C.card,
        border: `1px solid ${C.border}`,
        borderRadius: 16,
        overflow: 'hidden',
      }}>
        {children}
      </div>
    </div>
  );
}

function InfoRow({
  icon: Icon, label, value, last = false,
}: {
  icon: React.ElementType; label: string; value: string; last?: boolean;
}) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 14,
      padding: '14px 18px',
      borderBottom: last ? 'none' : `1px solid ${C.border}`,
    }}>
      <div style={{
        width: 34, height: 34, borderRadius: 10,
        backgroundColor: C.surface,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <Icon size={15} color={C.muted} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 11, color: C.muted, margin: '0 0 2px' }}>{label}</p>
        <p style={{
          fontSize: 14, fontWeight: 600, color: C.text, margin: 0,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {value}
        </p>
      </div>
    </div>
  );
}

/* ─── Page ────────────────────────────────────────────────────────────────── */
export default function SettingsPage() {
  const router            = useRouter();
  const { user, logout }  = useAuthStore();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleLogout = async () => {
    await fetch('/api/auth', { method: 'DELETE' });
    logout();
    router.push('/onboarding');
  };

  return (
    <div style={{
      minHeight: '100dvh',
      backgroundColor: C.bg,
      fontFamily: "'DM Sans', -apple-system, sans-serif",
      color: C.text,
    }}>

      {/* ── Nav ── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(10,10,15,0.88)',
        backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
        borderBottom: `1px solid ${C.border}`,
      } as React.CSSProperties}>
        <div style={{
          maxWidth: 1200, margin: '0 auto',
          padding: '0 20px', height: 60,
          display: 'flex', alignItems: 'center', gap: 14,
        }}>
          <button
            onClick={() => router.back()}
            style={{
              width: 36, height: 36, borderRadius: 9,
              background: C.surface, border: `1px solid ${C.border}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', flexShrink: 0,
            }}
          >
            <ArrowLeft size={16} color={C.text} />
          </button>

          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 9,
              backgroundColor: C.primary,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Tv size={16} color="#fff" />
            </div>
            <span style={{ fontSize: 16, fontWeight: 800, color: C.text, letterSpacing: -0.5 }}>
              CineExplorer
            </span>
          </div>

          <span style={{ fontSize: 14, color: C.muted, marginLeft: 4 }}>/ Settings</span>
        </div>
      </header>

      {/* ── Profile Hero ── */}
      <div style={{
        background: 'linear-gradient(160deg, #110d2a 0%, #0d1a30 60%, #0a0a0f 100%)',
        borderBottom: `1px solid ${C.border}`,
        padding: 'clamp(28px,5vw,48px) 20px',
      }}>
        <div style={{
          maxWidth: 680, margin: '0 auto',
          display: 'flex', alignItems: 'center',
          gap: 'clamp(16px,4vw,28px)', flexWrap: 'wrap',
        }}>
          {/* Avatar */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            {user?.image ? (
              <img
                src={user.image}
                alt={user.firstName}
                style={{
                  width: 80, height: 80, borderRadius: '50%',
                  objectFit: 'cover',
                  border: `3px solid ${C.card}`,
                  boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
                }}
              />
            ) : (
              <div style={{
                width: 80, height: 80, borderRadius: '50%',
                backgroundColor: C.primarySoft,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: `3px solid ${C.card}`,
              }}>
                <User size={34} color={C.primary} />
              </div>
            )}
            {/* Online dot */}
            <div style={{
              position: 'absolute', bottom: 4, right: 4,
              width: 14, height: 14, borderRadius: '50%',
              backgroundColor: C.success,
              border: `2px solid ${C.bg}`,
            }} />
          </div>

          {/* Name block */}
          <div style={{ flex: '1 1 180px', minWidth: 0 }}>
            <h1 style={{
              fontSize: 'clamp(20px,3vw,28px)', fontWeight: 800,
              color: '#fff', letterSpacing: -0.5, margin: '0 0 4px',
            }}>
              {user?.firstName} {user?.lastName}
            </h1>
            <p style={{ fontSize: 13, color: C.muted, margin: '0 0 18px' }}>
              @{user?.username}
            </p>

            {/* Status badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: C.successSoft,
              border: '1px solid rgba(16,185,129,0.25)',
              borderRadius: 20, padding: '4px 12px',
            }}>
              <div style={{ width: 6, height: 6, borderRadius: 3, background: C.success }} />
              <span style={{ fontSize: 11, fontWeight: 600, color: C.success, letterSpacing: '0.03em' }}>
                Active account
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main ── */}
      <main style={{
        maxWidth: 680, margin: '0 auto',
        padding: 'clamp(24px,4vw,40px) 20px clamp(40px,6vw,80px)',
      }}>

        {/* Account info */}
        <Section title="Account">
          <InfoRow icon={User}   label="Full name" value={`${user?.firstName ?? ''} ${user?.lastName ?? ''}`} />
          <InfoRow icon={Mail}   label="Email"     value={user?.email ?? '—'} />
          <InfoRow icon={AtSign} label="Username"  value={`@${user?.username ?? '—'}`} />
          <div style={{
            display: 'flex', alignItems: 'center', gap: 14,
            padding: '14px 18px',
          }}>
            <div style={{
              width: 34, height: 34, borderRadius: 10,
              backgroundColor: C.successSoft,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Shield size={15} color={C.success} />
            </div>
            <div>
              <p style={{ fontSize: 11, color: C.muted, margin: '0 0 2px' }}>Account status</p>
              <p style={{ fontSize: 14, fontWeight: 600, color: C.success, margin: 0 }}>Active</p>
            </div>
          </div>
        </Section>

        {/* About */}
        <Section title="About">
          <div style={{
            display: 'flex', alignItems: 'center', gap: 14,
            padding: '14px 18px', borderBottom: `1px solid ${C.border}`,
          }}>
            <div style={{
              width: 34, height: 34, borderRadius: 10,
              backgroundColor: C.primarySoft,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Tv size={15} color={C.primary} />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 11, color: C.muted, margin: '0 0 2px' }}>App</p>
              <p style={{ fontSize: 14, fontWeight: 600, color: C.text, margin: 0 }}>CineExplorer</p>
            </div>
          </div>
          <div style={{ padding: '14px 18px' }}>
            <p style={{ fontSize: 12, color: C.muted, margin: 0 }}>
              Movie data powered by{' '}
              <span style={{ color: C.accent, fontWeight: 600 }}>TMDB</span>
              {' '}· Built with Next.js
            </p>
          </div>
        </Section>

        {/* Danger zone */}
        <Section title="Danger zone">
          {!showConfirm ? (
            <button
              onClick={() => setShowConfirm(true)}
              style={{
                width: '100%',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '16px 18px',
                background: 'none', border: 'none', cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{
                  width: 34, height: 34, borderRadius: 10,
                  backgroundColor: C.errorSoft,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <LogOut size={15} color={C.error} />
                </div>
                <div style={{ textAlign: 'left' }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: C.error, margin: 0 }}>Sign Out</p>
                  <p style={{ fontSize: 12, color: C.muted, margin: 0 }}>You'll need to log in again</p>
                </div>
              </div>
              <ChevronRight size={16} color={C.muted} />
            </button>
          ) : (
            <div style={{ padding: '18px 18px' }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: C.text, margin: '0 0 16px' }}>
                Are you sure you want to sign out?
              </p>
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  onClick={handleLogout}
                  style={{
                    flex: 1, padding: '11px 0',
                    background: C.error, border: 'none',
                    borderRadius: 10, cursor: 'pointer',
                    color: '#fff', fontSize: 13, fontWeight: 700,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  <LogOut size={14} /> Yes, sign out
                </button>
                <button
                  onClick={() => setShowConfirm(false)}
                  style={{
                    flex: 1, padding: '11px 0',
                    background: C.surface,
                    border: `1px solid ${C.border}`,
                    borderRadius: 10, cursor: 'pointer',
                    color: C.text, fontSize: 13, fontWeight: 600,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  <Check size={14} /> Cancel
                </button>
              </div>
            </div>
          )}
        </Section>

      </main>
    </div>
  );
}