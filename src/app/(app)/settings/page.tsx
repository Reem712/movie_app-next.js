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

  return (
    <div className="min-h-[100dvh] bg-[#F8F7F4] font-sans text-[#1A1A2E]">

      {/* ── Nav ── */}
      <header className="sticky top-0 z-50 bg-[#EDE5D8] border-b border-black/[0.08]">
        <div className="mx-auto max-w-[1200px] px-5 h-14 flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="w-[34px] h-[34px] rounded-[9px] bg-white border border-black/10 flex items-center justify-center flex-shrink-0 hover:bg-black/5 transition-colors"
          >
            <ArrowLeft size={15} color="#1A1A2E" />
          </button>

          <div className="w-[30px] h-[30px] rounded-[8px] bg-[#6c63ff] flex items-center justify-center">
            <Tv size={15} color="#fff" />
          </div>
          <span className="text-[15px] font-extrabold text-[#1A1A2E] tracking-tight">
            CineExplorer
          </span>
          <span className="text-[13px] text-[#9CA3AF] ml-0.5">/ Settings</span>
        </div>
      </header>

      {/* ── Hero ── */}
      <div className="bg-gradient-to-br from-[#EDE5D8] via-[#F0EAF5] to-[#F8F7F4] border-b border-black/[0.07] px-5 py-[clamp(24px,4vw,40px)]">
        <div className="max-w-[680px] mx-auto flex items-center gap-[clamp(14px,3vw,24px)] flex-wrap">

          {/* Avatar */}
          <div className="relative flex-shrink-0">
            {user?.image ? (
              <img
                src={user.image}
                alt={user.firstName}
                className="w-[72px] h-[72px] rounded-full object-cover border-[3px] border-white shadow-[0_2px_12px_rgba(108,99,255,0.15)]"
              />
            ) : (
              <div className="w-[72px] h-[72px] rounded-full bg-[#EDEAF4] flex items-center justify-center border-[3px] border-white shadow-[0_2px_12px_rgba(108,99,255,0.15)]">
                <User size={28} color="#6c63ff" />
              </div>
            )}
            <div className="absolute bottom-[3px] right-[3px] w-[13px] h-[13px] rounded-full bg-[#10b981] border-2 border-[#F8F7F4]" />
          </div>

          {/* Name */}
          <div className="flex-1 min-w-[160px]">
            <h1 className="text-[clamp(18px,3vw,24px)] font-extrabold text-[#1A1A2E] tracking-tight mb-[3px]">
              {user?.firstName} {user?.lastName}
            </h1>
            <p className="text-[12px] text-[#9CA3AF] mb-[14px]">@{user?.username}</p>
            <div className="inline-flex items-center gap-[5px] bg-[#10b981]/10 border border-[#10b981]/20 rounded-full px-[10px] py-[3px]">
              <div className="w-[6px] h-[6px] rounded-full bg-[#10b981]" />
              <span className="text-[11px] font-bold text-[#10b981] tracking-[0.03em]">
                Active account
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main ── */}
      <main className="max-w-[680px] mx-auto px-5 py-[clamp(20px,3vw,32px)] pb-[clamp(32px,5vw,60px)]">

        {/* Account */}
        <Section title="Account">
          <InfoRow icon={User}   label="Full name" value={`${user?.firstName ?? ''} ${user?.lastName ?? ''}`} />
          <InfoRow icon={Mail}   label="Email"     value={user?.email ?? '—'} />
          <InfoRow icon={AtSign} label="Username"  value={`@${user?.username ?? '—'}`} />
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="w-8 h-8 rounded-[9px] bg-[#10b981]/10 flex items-center justify-center flex-shrink-0">
              <Shield size={14} color="#10b981" />
            </div>
            <div>
              <p className="text-[11px] text-[#9CA3AF] mb-[2px]">Account status</p>
              <p className="text-[13px] font-semibold text-[#10b981]">Active</p>
            </div>
          </div>
        </Section>

        {/* About */}
        <Section title="About">
          <div className="flex items-center gap-3 px-4 py-3 border-b border-black/[0.06]">
            <div className="w-8 h-8 rounded-[9px] bg-[#6c63ff]/10 flex items-center justify-center flex-shrink-0">
              <Tv size={14} color="#6c63ff" />
            </div>
            <div>
              <p className="text-[11px] text-[#9CA3AF] mb-[2px]">App</p>
              <p className="text-[13px] font-semibold text-[#1A1A2E]">CineExplorer</p>
            </div>
          </div>
          <p className="px-4 py-[10px] text-[12px] text-[#9CA3AF]">
            Movie data powered by{' '}
            <span className="text-[#926b1a] font-bold">TMDB</span>
            {' '}· Built with Next.js
          </p>
        </Section>

        {/* Danger zone */}
        <Section title="Danger zone">
          {!showConfirm ? (
            <button
              onClick={() => setShowConfirm(true)}
              className="w-full flex items-center justify-between px-4 py-[14px] hover:bg-red-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-[9px] bg-red-500/[0.08] flex items-center justify-center flex-shrink-0">
                  <LogOut size={14} color="#ef4444" />
                </div>
                <div className="text-left">
                  <p className="text-[13px] font-bold text-[#ef4444]">Sign out</p>
                  <p className="text-[11px] text-[#9CA3AF]">You'll need to log in again</p>
                </div>
              </div>
              <ChevronRight size={14} color="#9CA3AF" />
            </button>
          ) : (
            <div className="p-4">
              <p className="text-[13px] font-semibold text-[#1A1A2E] mb-[14px]">
                Are you sure you want to sign out?
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleLogout}
                  className="flex-1 py-[10px] bg-[#ef4444] border-none rounded-[10px] cursor-pointer text-white text-[12px] font-bold flex items-center justify-center gap-[5px]"
                >
                  <LogOut size={13} /> Yes, sign out
                </button>
                <button
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 py-[10px] bg-[#F8F7F4] border border-black/10 rounded-[10px] cursor-pointer text-[#1A1A2E] text-[12px] font-semibold flex items-center justify-center gap-[5px]"
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
    <div className="mb-6">
      <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-[0.1em] mb-2 ml-[2px]">
        {title}
      </p>
      <div className="bg-white border border-black/[0.07] rounded-[14px] overflow-hidden">
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
    <div className={`flex items-center gap-3 px-4 py-3 ${last ? '' : 'border-b border-black/[0.06]'}`}>
      <div className="w-8 h-8 rounded-[9px] bg-[#F8F7F4] flex items-center justify-center flex-shrink-0">
        <Icon size={14} color="#6B7280" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] text-[#9CA3AF] mb-[2px]">{label}</p>
        <p className="text-[13px] font-semibold text-[#1A1A2E] truncate">{value}</p>
      </div>
    </div>
  );
}