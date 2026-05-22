'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Film, Heart, Clock, Search, Settings, LogIn, LogOut } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore'; // تأكد إن المسار ده صح عندك

const TABS = [
  { href: '/home',      label: 'Home',      Icon: Home      },
  { href: '/browse',    label: 'Browse',    Icon: Film      },
  { href: '/favorites', label: 'Favorites', Icon: Heart     },
  { href: '/watchlist', label: 'Watchlist', Icon: Clock     },
  { href: '/search',    label: 'Search',    Icon: Search    },
  { href: '/settings',  label: 'Settings',  Icon: Settings  },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  
  // بنجيب حالة اليوزر ودالة تسجيل الخروج من الستور بتاعك
  const { user, logout } = useAuthStore((state: any) => ({
    user: state.user,
    logout: state.logout,
  }));

  // دالة تسجيل الخروج والتوجه للوجين
  const handleAuthAction = () => {
    if (user) {
      logout(); // مسح بيانات اليوزر
      router.push('/login'); // التوجيه لصفحة اللوجين
    } else {
      router.push('/login');
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#08080f', fontFamily: "'DM Sans', system-ui, sans-serif" }}>

      {/* ── Cinematic Sidebar ── */}
      <aside className="cin-sidebar">
        {/* Logo */}
        <div className="cin-logo">
          <div className="cin-logo-icon"><Film size={18} color="#fff" /></div>
          <span className="cin-logo-text">CineExplorer</span>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, padding: '0 8px', width: '100%' }}>
          {TABS.map(({ href, label, Icon }) => {
            const active = pathname.startsWith(href);
            return (
              <Link 
                key={href} 
                href={href} 
                className={`cin-nav-item ${active ? 'cin-active' : ''}`}
                onClick={(e) => {
                  // لو اليوزر مش عامل لوجين وداغ على الـ Watchlist، وديه للوجين بيج
                  if (href === '/watchlist' && !user) {
                    e.preventDefault();
                    router.push('/login');
                  }
                }}
              >
                {active && <div className="cin-active-dot" />}
                <Icon size={19} />
                <span className="cin-label">{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* ── Auth Button (Login / Logout) ── */}
        <div style={{ padding: '0 8px', width: '100%', marginBottom: '12px' }}>
          <button onClick={handleAuthAction} className="cin-nav-item cin-auth-btn">
            {user ? <LogOut size={19} color="#ef4444" /> : <LogIn size={19} />}
            <span className="cin-label" style={{ color: user ? '#ef4444' : 'inherit' }}>
              {user ? 'Logout' : 'Login'}
            </span>
          </button>
        </div>

        <div className="cin-footer">Powered by TMDB</div>
      </aside>

      {/* ── Main ── */}
      <main className="cin-main">{children}</main>

      {/* ── Mobile bottom nav ── */}
      <nav className="cin-bottom">
        {/* هنعرض أول 4 تابات بس في الموبايل عشان الزحمة، ونضيف زرار اللوجين */}
        {TABS.slice(0, 4).map(({ href, label, Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link 
              key={href} 
              href={href} 
              className={`cin-tab ${active ? 'cin-tab-active' : ''}`}
              onClick={(e) => {
                if (href === '/watchlist' && !user) {
                  e.preventDefault();
                  router.push('/login');
                }
              }}
            >
              {active && <div className="cin-tab-dot" />}
              <Icon size={20} />
              <span>{label}</span>
            </Link>
          );
        })}
        
        {/* Mobile Auth Button */}
        <button onClick={handleAuthAction} className="cin-tab" style={{ background: 'none', border: 'none' }}>
          {user ? <LogOut size={20} color="#ef4444" /> : <LogIn size={20} />}
          <span style={{ color: user ? '#ef4444' : 'inherit' }}>{user ? 'Logout' : 'Login'}</span>
        </button>
      </nav>

      <style>{`
        /* ── Sidebar ── */
        .cin-sidebar {
          width: 72px; flex-shrink: 0;
          background: rgba(10,10,18,0.97);
          border-right: 1px solid rgba(255,255,255,0.04);
          display: flex; flex-direction: column; align-items: center;
          padding: 20px 0;
          position: fixed; top: 0; left: 0; bottom: 0; z-index: 50;
          overflow: hidden;
          transition: width 0.3s cubic-bezier(.4,0,.2,1);
        }
        .cin-sidebar:hover { width: 220px; }
        .cin-sidebar:hover .cin-label      { opacity: 1; max-width: 160px; transform: translateX(0); }
        .cin-sidebar:hover .cin-logo-text  { opacity: 1; max-width: 160px; }
        .cin-sidebar:hover .cin-footer     { opacity: 1; }

        .cin-logo { display: flex; align-items: center; gap: 12px; padding: 0 16px; margin-bottom: 32px; width: 100%; }
        .cin-logo-icon {
          width: 36px; height: 36px; border-radius: 10px; flex-shrink: 0;
          background: linear-gradient(135deg, #7c3aed, #4f46e5);
          display: flex; align-items: center; justify-content: center;
        }
        .cin-logo-text {
          font-size: 14px; font-weight: 800; color: #e0e0f0;
          white-space: nowrap; opacity: 0; max-width: 0; overflow: hidden;
          transition: opacity 0.2s 0.1s, max-width 0.3s; letter-spacing: -0.3px;
        }

        .cin-nav-item {
          display: flex; align-items: center; gap: 14px;
          padding: 11px 14px; border-radius: 12px;
          text-decoration: none; width: 100%;
          white-space: nowrap; position: relative;
          color: rgba(255,255,255,0.3);
          transition: background 0.15s, color 0.15s;
          cursor: pointer;
        }
        .cin-nav-item:hover        { background: rgba(255,255,255,0.04); color: rgba(255,255,255,0.65); }
        .cin-nav-item.cin-active   { background: rgba(108,99,255,0.14); color: #a78bfa; }

        /* Auth Button Reset */
        .cin-auth-btn { background: transparent; border: none; text-align: left; }
        .cin-auth-btn:hover { background: rgba(239,68,68,0.08); color: #ef4444; }

        .cin-label {
          font-size: 13px; font-weight: 600; overflow: hidden;
          opacity: 0; max-width: 0; transform: translateX(-6px);
          transition: opacity 0.2s 0.05s, transform 0.2s 0.05s, max-width 0.3s;
          color: inherit;
        }
        .cin-active-dot {
          position: absolute; left: 0; top: 50%; transform: translateY(-50%);
          width: 3px; height: 22px; border-radius: 0 3px 3px 0; background: #7c3aed;
        }
        .cin-footer {
          font-size: 10px; color: rgba(255,255,255,0.15);
          padding: 12px 16px; white-space: nowrap; opacity: 0;
          transition: opacity 0.2s;
        }

        /* ── Main content ── */
        .cin-main { flex: 1; min-width: 0; padding-bottom: 64px; }

        /* ── Mobile bottom ── */
        .cin-bottom {
          position: fixed; bottom: 0; left: 0; right: 0; height: 60px;
          background: rgba(10,10,18,0.97);
          border-top: 0.5px solid rgba(255,255,255,0.06);
          display: flex; align-items: center; justify-content: space-around;
          z-index: 100; display: none;
        }
        .cin-tab {
          display: flex; flex-direction: column; align-items: center; gap: 3px;
          text-decoration: none; font-size: 10px; font-weight: 500;
          color: rgba(255,255,255,0.3); padding: 4px 8px; position: relative;
          cursor: pointer;
        }
        .cin-tab.cin-tab-active { color: #a78bfa; }
        .cin-tab-dot {
          position: absolute; top: -1px; left: 50%; transform: translateX(-50%);
          width: 20px; height: 2px; border-radius: 1px; background: #7c3aed;
        }

        @media (min-width: 768px) {
          .cin-sidebar { display: flex !important; }
          .cin-bottom  { display: none  !important; }
          .cin-main    { margin-left: 72px; padding-bottom: 0 !important; }
        }
        @media (max-width: 767px) {
          .cin-sidebar { display: none   !important; }
          .cin-bottom  { display: flex   !important; }
          .cin-main    { margin-left: 0  !important; }
        }
      `}</style>
    </div>
  );
}