'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, User, Mail, AtSign, Shield,
  LogOut, ChevronRight, Tv, Check,
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

export default function SettingsPage() {
  const router           = useRouter();
  const { user, logout } = useAuthStore();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleLogout = async () => {
    await fetch('/api/auth', { method: 'DELETE' });
    logout();
    router.push('/onboarding');
  };

  const accent = '#6c63ff';
  const font   = "inherit";

  return (
    <div style={{ minHeight: '100dvh', background: '#F8F7F4', fontFamily: font, color: '#1A1A2E' }}>

      {/* ── Nav ── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: '#EDE5D8',
        borderBottom: '1px solid rgba(0,0,0,0.08)',
      }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto',
          padding: '0 20px', height: 56,
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <button
            onClick={() => router.back()}
            style={{
              width: 34, height: 34, borderRadius: 9,
              background: '#fff', border: '1px solid rgba(0,0,0,0.10)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, cursor: 'pointer', transition: 'background 0.15s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(0,0,0,0.05)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#fff')}
          >
            <ArrowLeft size={15} color="#1A1A2E" />
          </button>

          <div style={{
            width: 30, height: 30, borderRadius: 8,
            background: accent,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Tv size={15} color="#fff" />
          </div>

          <span style={{ fontSize: 15, fontWeight: 800, color: '#1A1A2E', letterSpacing: -0.4 }}>
            CineExplorer
          </span>
          <span style={{ fontSize: 13, color: '#9CA3AF' }}>/ Settings</span>
        </div>
      </header>

      {/* ── Hero ── */}
      <div style={{
        background: 'linear-gradient(135deg, #EDE5D8 0%, #F0EAF5 50%, #F8F7F4 100%)',
        borderBottom: '1px solid rgba(0,0,0,0.07)',
        padding: 'clamp(24px,4vw,40px) 20px',
      }}>
        <div style={{
          maxWidth: 680, margin: '0 auto',
          display: 'flex', alignItems: 'center',
          gap: 'clamp(14px,3vw,24px)', flexWrap: 'wrap',
        }}>

          {/* Avatar */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            {user?.image ? (
              <img
                src={user.image}
                alt={user.firstName}
                style={{
                  width: 72, height: 72, borderRadius: '50%',
                  objectFit: 'cover',
                  border: '3px solid #fff',
                  boxShadow: '0 2px 12px rgba(108,99,255,0.15)',
                }}
              />
            ) : (
              <div style={{
                width: 72, height: 72, borderRadius: '50%',
                background: '#EDEAF4',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '3px solid #fff',
                boxShadow: '0 2px 12px rgba(108,99,255,0.15)',
              }}>
                <User size={28} color={accent} />
              </div>
            )}
            <div style={{
              position: 'absolute', bottom: 3, right: 3,
              width: 13, height: 13, borderRadius: '50%',
              background: '#10b981', border: '2px solid #F8F7F4',
            }} />
          </div>

          {/* Name */}
          <div style={{ flex: 1, minWidth: 160 }}>
            <h1 style={{
              fontSize: 'clamp(18px,3vw,24px)', fontWeight: 800,
              color: '#1A1A2E', letterSpacing: -0.5,
              margin: '0 0 3px',
            }}>
              {user?.firstName} {user?.lastName}
            </h1>
            <p style={{ fontSize: 12, color: '#9CA3AF', margin: '0 0 14px' }}>
              @{user?.username}
            </p>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              background: 'rgba(16,185,129,0.10)',
              border: '1px solid rgba(16,185,129,0.20)',
              borderRadius: 99, padding: '3px 10px',
            }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981' }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: '#10b981', letterSpacing: '0.03em' }}>
                Active account
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main ── */}
      <main style={{
        maxWidth: 680, margin: '0 auto',
        padding: 'clamp(20px,3vw,32px) 20px clamp(32px,5vw,60px)',
      }}>

        {/* Account */}
        <Section title="Account">
          <InfoRow icon={User}   label="Full name" value={`${user?.firstName ?? ''} ${user?.lastName ?? ''}`} />
          <InfoRow icon={Mail}   label="Email"     value={user?.email ?? '—'} />
          <InfoRow icon={AtSign} label="Username"  value={`@${user?.username ?? '—'}`} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px' }}>
            <div style={{
              width: 32, height: 32, borderRadius: 9,
              background: 'rgba(16,185,129,0.10)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <Shield size={14} color="#10b981" />
            </div>
            <div>
              <p style={{ fontSize: 11, color: '#9CA3AF', margin: '0 0 2px' }}>Account status</p>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#10b981', margin: 0 }}>Active</p>
            </div>
          </div>
        </Section>

        {/* About */}
        <Section title="About">
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '12px 16px',
            borderBottom: '1px solid rgba(0,0,0,0.06)',
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: 9,
              background: 'rgba(108,99,255,0.10)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <Tv size={14} color={accent} />
            </div>
            <div>
              <p style={{ fontSize: 11, color: '#9CA3AF', margin: '0 0 2px' }}>App</p>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#1A1A2E', margin: 0 }}>CineExplorer</p>
            </div>
          </div>
          <p style={{ padding: '10px 16px', fontSize: 12, color: '#9CA3AF', margin: 0 }}>
            Movie data powered by{' '}
            <span style={{ color: '#926b1a', fontWeight: 700 }}>TMDB</span>
            {' '}· Built with Next.js
          </p>
        </Section>

        {/* Danger zone */}
        <Section title="Danger zone">
          {!showConfirm ? (
            <button
              onClick={() => setShowConfirm(true)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 16px',
                background: 'transparent', border: 'none', cursor: 'pointer',
                transition: 'background 0.15s', fontFamily: 'inherit',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#fef2f2')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 9,
                  background: 'rgba(239,68,68,0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <LogOut size={14} color="#ef4444" />
                </div>
                <div style={{ textAlign: 'left' }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#ef4444', margin: '0 0 2px' }}>Sign out</p>
                  <p style={{ fontSize: 11, color: '#9CA3AF', margin: 0 }}>You'll need to log in again</p>
                </div>
              </div>
              <ChevronRight size={14} color="#9CA3AF" />
            </button>
          ) : (
            <div style={{ padding: 16 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#1A1A2E', margin: '0 0 14px' }}>
                Are you sure you want to sign out?
              </p>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={handleLogout}
                  style={{
                    flex: 1, padding: '10px 0',
                    background: '#ef4444', border: 'none', borderRadius: 10,
                    cursor: 'pointer', color: '#fff', fontSize: 12, fontWeight: 700,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                    fontFamily: 'inherit',
                  }}
                >
                  <LogOut size={13} /> Yes, sign out
                </button>
                <button
                  onClick={() => setShowConfirm(false)}
                  style={{
                    flex: 1, padding: '10px 0',
                    background: '#F8F7F4', border: '1px solid rgba(0,0,0,0.10)', borderRadius: 10,
                    cursor: 'pointer', color: '#1A1A2E', fontSize: 12, fontWeight: 600,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                    fontFamily: 'inherit',
                  }}
                >
                  <Check size={13} /> Cancel
                </button>
              </div>
            </div>
          )}
        </Section>

      </main>
    </div>
  );
}

/* ─── Sub-components ─────────────────────────────────────────────────────── */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <p style={{
        fontSize: 10, fontWeight: 700, color: '#9CA3AF',
        textTransform: 'uppercase', letterSpacing: '0.1em',
        margin: '0 0 8px 2px',
      }}>
        {title}
      </p>
      <div style={{
        background: '#fff',
        border: '1px solid rgba(0,0,0,0.07)',
        borderRadius: 14,
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
  icon: React.ElementType;
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '12px 16px',
      borderBottom: last ? 'none' : '1px solid rgba(0,0,0,0.06)',
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: 9,
        background: '#F8F7F4',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <Icon size={14} color="#6B7280" />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 11, color: '#9CA3AF', margin: '0 0 2px' }}>{label}</p>
        <p style={{
          fontSize: 13, fontWeight: 600, color: '#1A1A2E', margin: 0,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {value}
        </p>
      </div>
    </div>
  );
}