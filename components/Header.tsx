
import React from 'react';

interface HeaderProps {
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ theme, onToggleTheme }) => {
  const isLight = theme === 'light';

  return (
    <header
      style={{
        background: 'var(--header-bg)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--header-border)',
        transition: 'background 0.3s ease, border-color 0.3s ease',
      }}
      className="sticky top-0 z-20"
    >
      {/* Accent line */}
      <div
        style={{
          height: '2px',
          background: 'linear-gradient(90deg, var(--accent) 0%, #ff6060 50%, transparent 100%)',
          transition: 'background 0.3s',
        }}
      />

      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo + Name */}
        <div className="flex items-center space-x-3">
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              overflow: 'hidden',
              border: '1px solid var(--border)',
              flexShrink: 0,
              background: 'var(--surface-2)',
              transition: 'border-color 0.3s, background 0.3s',
            }}
          >
            <img
              src="/logo.png"
              alt="Georgian Linguist Pro logo"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          <div>
            <h1
              className="gradient-text font-semibold tracking-tight"
              style={{ fontSize: '1.05rem', lineHeight: 1.2 }}
            >
              Georgian Linguist Pro
            </h1>
            <p
              style={{
                color: 'var(--text-muted)',
                fontSize: '0.67rem',
                letterSpacing: '0.1em',
                transition: 'color 0.3s',
              }}
              className="uppercase font-medium"
            >
              ქართული ენის AI რედაქტორი
            </p>
          </div>
        </div>

        {/* Right side: tagline + theme toggle */}
        <div className="flex items-center gap-4">
          <div
            className="hidden sm:flex items-center space-x-2 text-xs"
            style={{ color: 'var(--text-muted)', transition: 'color 0.3s' }}
          >
            <span
              className="dot-pulse inline-block w-1.5 h-1.5 rounded-full"
              style={{ background: 'var(--green)', transition: 'background 0.3s' }}
            />
            <span style={{ color: 'var(--text-secondary)', fontStyle: 'italic', transition: 'color 0.3s' }}>
              სწორი წერა კულტურის ნაწილია
            </span>
          </div>

          {/* ── Theme Toggle Pill ── */}
          <button
            id="theme-toggle"
            onClick={onToggleTheme}
            aria-label={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
            title={isLight ? 'Dark mode' : 'Light mode'}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '5px 10px 5px 6px',
              border: '1px solid var(--border)',
              borderRadius: 99,
              background: 'var(--surface-2)',
              cursor: 'pointer',
              fontSize: '0.72rem',
              fontWeight: 600,
              color: 'var(--text-secondary)',
              letterSpacing: '0.04em',
              transition: 'all 0.25s ease',
              userSelect: 'none',
            }}
          >
            {/* Slider pill */}
            <span
              style={{
                position: 'relative',
                display: 'inline-flex',
                width: 34,
                height: 18,
                borderRadius: 99,
                background: isLight ? 'var(--accent)' : 'rgba(255,255,255,0.1)',
                transition: 'background 0.25s ease',
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  top: 2,
                  left: isLight ? 16 : 2,
                  width: 14,
                  height: 14,
                  borderRadius: '50%',
                  background: '#fff',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.25)',
                  transition: 'left 0.25s cubic-bezier(0.4,0,0.2,1)',
                }}
              />
            </span>

            {/* Icon + label */}
            {isLight ? (
              <>
                {/* Sun icon */}
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
                Light
              </>
            ) : (
              <>
                {/* Moon icon */}
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
                Dark
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
