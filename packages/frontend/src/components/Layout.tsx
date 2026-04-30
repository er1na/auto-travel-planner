import { AppView } from '../types';

interface LayoutProps {
  view: AppView;
  onNavigate: (view: AppView) => void;
  children: React.ReactNode;
}

export function Layout({ view, onNavigate, children }: LayoutProps) {
  const homeActive = view === 'home';
  const savedActive = view === 'saved' || view === 'plan-detail';

  const navLink = (label: string, active: boolean, onClick: () => void) => (
    <button
      onClick={onClick}
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        fontFamily: 'inherit',
        fontSize: '14px',
        fontWeight: active ? '700' : '400',
        color: active ? 'var(--rt-accent)' : 'rgba(255,255,255,0.7)',
        padding: '4px 0',
        borderBottom: active ? '2px solid var(--rt-accent)' : '2px solid transparent',
        transition: 'color 0.2s, border-color 0.2s',
        letterSpacing: '0.5px',
      }}
    >
      {label}
    </button>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: 'var(--rt-bg)' }}>
      {/* Header */}
      <header style={{
        backgroundColor: 'var(--rt-primary)',
        borderBottom: '4px solid var(--rt-accent)',
        height: '64px',
        display: 'flex', alignItems: 'center',
        padding: '0 32px',
        gap: '40px',
      }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="var(--rt-accent)">
            <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
          </svg>
          <span style={{ fontSize: '18px', fontWeight: '700', color: 'var(--rt-white)', letterSpacing: '3px' }}>
            ROUTE
          </span>
        </div>

        {/* Nav */}
        <nav style={{ display: 'flex', gap: '24px' }}>
          {navLink('プランを作る', homeActive, () => onNavigate('home'))}
          {navLink('保存済みの旅', savedActive, () => onNavigate('saved'))}
        </nav>
      </header>

      <main style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>{children}</main>
    </div>
  );
}
