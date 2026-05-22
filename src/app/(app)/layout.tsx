'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Home, Film, Heart, Clock, Search, Settings, LogIn, LogOut,
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

const TABS = [
  { href: '/home',      label: 'Home',      Icon: Home     },
  { href: '/browse',    label: 'Browse',    Icon: Film     },
  { href: '/favorites', label: 'Favorites', Icon: Heart    },
  { href: '/watchlist', label: 'Watchlist', Icon: Clock    },
  { href: '/search',    label: 'Search',    Icon: Search   },
  { href: '/settings',  label: 'Settings',  Icon: Settings },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router   = useRouter();
  const user     = useAuthStore((s) => s.user);
  const logout   = useAuthStore((s) => s.logout);

  const handleAuth = () => {
    if (user) { logout(); router.push('/login'); }
    else router.push('/login');
  };

  return (
    <div className="flex min-h-screen bg-[#F8F7F4] font-sans">

      {/* ── Sidebar ── */}
      <aside className="cin-sidebar">

        {/* Logo */}
        <div className="cin-logo">
          <div className="cin-logo-icon">
            <Film size={16} color="#fff" />
          </div>
          <span className="cin-logo-txt">CineExplorer</span>
        </div>

        {/* Nav */}
        <nav className="cin-nav">
          {TABS.map(({ href, label, Icon }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`cin-item ${active ? 'cin-active' : ''}`}
                onClick={(e) => {
                  if (href === '/watchlist' && !user) {
                    e.preventDefault();
                    router.push('/login');
                  }
                }}
              >
                {active && <span className="cin-pill" />}
                <Icon size={17} strokeWidth={active ? 2.2 : 1.8} />
                <span className="cin-label">{label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="cin-divider" />

        {/* Auth */}
        <div className="cin-auth">
          <button
            className={`cin-item cin-auth-btn ${user ? 'cin-danger' : ''}`}
            onClick={handleAuth}
          >
            {user
              ? <LogOut size={17} strokeWidth={1.8} />
              : <LogIn  size={17} strokeWidth={1.8} />
            }
            <span className="cin-label">{user ? 'Sign out' : 'Sign in'}</span>
          </button>
        </div>

        <span className="cin-footer">Powered by TMDB</span>
      </aside>

      {/* ── Page ── */}
      <main className="cin-main">{children}</main>

      {/* ── Mobile bottom nav ── */}
      <nav className="cin-bottom">
        {TABS.slice(0, 5).map(({ href, label, Icon }) => {
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
              {active && <span className="cin-tab-bar" />}
              <Icon size={19} strokeWidth={active ? 2.2 : 1.8} />
              <span>{label}</span>
            </Link>
          );
        })}
        <button className="cin-tab cin-tab-btn" onClick={handleAuth}>
          {user
            ? <LogOut size={19} strokeWidth={1.8} color="#ef4444" />
            : <LogIn  size={19} strokeWidth={1.8} />
          }
          <span style={{ color: user ? '#ef4444' : 'inherit' }}>
            {user ? 'Out' : 'In'}
          </span>
        </button>
      </nav>

      <style>{`
        /* ── Sidebar ── */
        .cin-sidebar {
          width: 64px;
          flex-shrink: 0;
          position: fixed; top: 0; left: 0; bottom: 0; z-index: 50;
          background: #fff;
          border-right: 1px solid rgba(0,0,0,0.07);
          display: flex; flex-direction: column; align-items: center;
          padding: 16px 0;
          overflow: hidden;
          transition: width 0.28s cubic-bezier(.4,0,.2,1);
        }
        .cin-sidebar:hover { width: 210px; }
        .cin-sidebar:hover .cin-label    { opacity:1; max-width:140px; transform:translateX(0); }
        .cin-sidebar:hover .cin-logo-txt { opacity:1; max-width:140px; }
        .cin-sidebar:hover .cin-footer   { opacity:1; }
        .cin-sidebar:hover .cin-divider  { width: calc(100% - 20px); }

        .cin-logo {
          display:flex; align-items:center; gap:10px;
          padding:0 15px; margin-bottom:24px; width:100%;
        }
        .cin-logo-icon {
          width:32px; height:32px; border-radius:9px; flex-shrink:0;
          background:#6c63ff;
          display:flex; align-items:center; justify-content:center;
        }
        .cin-logo-txt {
          font-size:13px; font-weight:800; color:#1A1A2E;
          white-space:nowrap; opacity:0; max-width:0; overflow:hidden;
          letter-spacing:-0.4px;
          transition:opacity 0.18s 0.06s, max-width 0.28s;
        }

        .cin-nav {
          flex:1; display:flex; flex-direction:column; gap:1px;
          padding:0 8px; width:100%;
        }

        .cin-item {
          display:flex; align-items:center; gap:11px;
          padding:9px 11px; border-radius:10px;
          text-decoration:none; width:100%;
          white-space:nowrap; position:relative;
          color:#9CA3AF;
          transition:background 0.13s, color 0.13s;
          cursor:pointer; border:none; background:transparent;
          font-family:inherit;
        }
        .cin-item:hover      { background:#F3F4F6; color:#6B7280; }
        .cin-item.cin-active { background:#EDEAF4; color:#6c63ff; }
        .cin-item.cin-danger { color:#ef4444; }
        .cin-item.cin-danger:hover { background:#FEF2F2; }

        .cin-pill {
          position:absolute; left:0; top:50%; transform:translateY(-50%);
          width:3px; height:18px; border-radius:0 3px 3px 0;
          background:#6c63ff;
        }

        .cin-label {
          font-size:12px; font-weight:600; overflow:hidden;
          opacity:0; max-width:0; transform:translateX(-4px);
          transition:opacity 0.18s 0.05s, transform 0.18s 0.05s, max-width 0.28s;
          color:inherit;
        }

        .cin-divider {
          height:1px; background:rgba(0,0,0,0.06);
          width:32px; margin:8px auto;
          transition:width 0.28s; border-radius:1px;
        }

        .cin-auth { padding:0 8px; width:100%; margin-bottom:8px; }
        .cin-auth-btn { text-align:left; }

        .cin-footer {
          font-size:10px; color:#C4B5A5;
          padding:8px 15px; white-space:nowrap;
          opacity:0; transition:opacity 0.18s; margin-top:auto;
        }

        /* ── Main ── */
        .cin-main { flex:1; min-width:0; }

        /* ── Mobile bottom ── */
        .cin-bottom {
          position:fixed; bottom:0; left:0; right:0; height:56px;
          background:rgba(248,247,244,0.96);
          border-top:1px solid rgba(0,0,0,0.07);
          display:none;
          align-items:center; justify-content:space-around;
          z-index:100; backdrop-filter:blur(12px);
        }
        .cin-tab {
          display:flex; flex-direction:column; align-items:center; gap:2px;
          text-decoration:none; font-size:10px; font-weight:600;
          color:#9CA3AF; padding:4px 8px; position:relative;
          transition:color 0.13s;
        }
        .cin-tab-btn {
          background:none; border:none; cursor:pointer; font-family:inherit;
        }
        .cin-tab.cin-tab-active { color:#6c63ff; }
        .cin-tab-bar {
          position:absolute; top:-1px; left:50%; transform:translateX(-50%);
          width:20px; height:2px; border-radius:0 0 2px 2px;
          background:#6c63ff;
        }

        /* ── Responsive ── */
        @media (min-width: 768px) {
          .cin-sidebar { display:flex !important; }
          .cin-bottom  { display:none  !important; }
          .cin-main    { margin-left:64px; }
        }
        @media (max-width: 767px) {
          .cin-sidebar { display:none  !important; }
          .cin-bottom  { display:flex  !important; }
          .cin-main    { margin-left:0; padding-bottom:56px; }
        }
      `}</style>
    </div>
  );
}