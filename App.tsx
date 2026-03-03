
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ResultView from './components/ResultView';
import { processGeorgianText } from './services/geminiService';
import { CorrectionResult, HistoryItem } from './types';

type Theme = 'dark' | 'light';

const App: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CorrectionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // ── Theme ──
  const [theme, setTheme] = useState<Theme>(() => {
    try { return (localStorage.getItem('glp_theme') as Theme) || 'dark'; } catch { return 'dark'; }
  });

  const toggleTheme = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    try { localStorage.setItem('glp_theme', next); } catch { }
    document.documentElement.setAttribute('data-theme', next === 'light' ? 'light' : '');
  };

  // Apply theme on mount
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme === 'light' ? 'light' : '');
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('geo_editor_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load history');
      }
    }
  }, []);

  const handleProcess = async () => {
    if (!inputText.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const correction = await processGeorgianText(inputText);
      setResult(correction);
      const newItem: HistoryItem = {
        ...correction,
        id: crypto.randomUUID(),
        timestamp: Date.now(),
      };
      const updated = [newItem, ...history.slice(0, 9)];
      setHistory(updated);
      localStorage.setItem('geo_editor_history', JSON.stringify(updated));
    } catch (err: any) {
      setError(err.message || 'დაფიქსირდა შეცდომა');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setResult(null);
    setInputText('');
  };

  const deleteHistoryItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = history.filter((item) => item.id !== id);
    setHistory(updated);
    localStorage.setItem('geo_editor_history', JSON.stringify(updated));
  };

  const charCount = inputText.length;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1 }}>
      <Header theme={theme} onToggleTheme={toggleTheme} />

      <main style={{ flexGrow: 1, maxWidth: 1024, margin: '0 auto', width: '100%', padding: '32px 16px' }}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Main Column ── */}
          <div className="lg:col-span-2 space-y-5">
            {!result ? (
              <div className="glass" style={{ padding: '24px' }}>
                {/* Section header */}
                <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h2 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    შეიყვანეთ ქართული ტექსტი
                  </h2>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {charCount} სიმბოლო
                  </span>
                </div>

                {/* Textarea */}
                <div style={{ position: 'relative' }}>
                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder=""
                    className="focus-ring"
                    style={{
                      width: '100%',
                      minHeight: 200,
                      padding: '14px 16px',
                      fontSize: '1rem',
                      lineHeight: 1.75,
                      background: 'var(--surface-2)',
                      border: '1px solid var(--border)',
                      borderRadius: 10,
                      color: 'var(--text-primary)',
                      resize: 'vertical',
                      fontFamily: 'inherit',
                      transition: 'border-color 0.2s',
                    }}
                    onFocus={(e) => { e.target.style.borderColor = 'rgba(228,26,26,0.45)'; }}
                    onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; }}
                  />
                </div>

                {/* Error */}
                {error && (
                  <div
                    style={{
                      marginTop: 12,
                      padding: '10px 14px',
                      background: 'rgba(239,68,68,0.1)',
                      border: '1px solid rgba(239,68,68,0.25)',
                      borderRadius: 8,
                      color: '#fca5a5',
                      fontSize: '0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                    }}
                  >
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {error}
                  </div>
                )}

                {/* Submit */}
                <button
                  id="analyze-btn"
                  onClick={handleProcess}
                  disabled={loading || !inputText.trim()}
                  className="btn-accent"
                  style={{
                    marginTop: 16,
                    width: '100%',
                    padding: '14px',
                    borderRadius: 10,
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    border: 'none',
                    cursor: loading || !inputText.trim() ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    letterSpacing: '0.02em',
                  }}
                >
                  {loading ? (
                    <>
                      <svg
                        style={{ animation: 'spin 0.8s linear infinite', width: 18, height: 18 }}
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <style>{`@keyframes spin { from{ transform: rotate(0deg) } to{ transform: rotate(360deg) } }`}</style>
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
                        <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                      </svg>
                      მუშავდება...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      ტექსტის შემოწმება
                    </>
                  )}
                </button>
              </div>
            ) : (
              <ResultView result={result} onClear={handleClear} />
            )}

            {/* What does it check */}
            <div
              style={{
                background: 'var(--surface-2)',
                border: '1px solid var(--border)',
                borderRadius: 12,
                padding: '18px 20px',
              }}
            >
              <h3
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  marginBottom: 12,
                }}
              >
                რას ამოწმებს პროგრამა?
              </h3>
              <ul style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px' }}>
                {[
                  'ორთოგრაფიული შეცდომები',
                  'ზმნის უმართებულო ფორმები',
                  'სასვენი ნიშნები',
                  'ბარბარიზმები და ჟარგონი',
                ].map((item) => (
                  <li
                    key={item}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      fontSize: '0.82rem',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    <span
                      style={{
                        width: 5,
                        height: 5,
                        borderRadius: '50%',
                        background: 'var(--accent)',
                        flexShrink: 0,
                        opacity: 0.7,
                      }}
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ── Sidebar: History ── */}
          <div className="lg:col-span-1">
            <div
              className="glass"
              style={{ padding: '20px', position: 'sticky', top: 76 }}
            >
              <h2
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  marginBottom: 14,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                ბოლო შემოწმებები
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {history.length === 0 ? (
                  <div
                    style={{
                      textAlign: 'center',
                      padding: '36px 0',
                      color: 'var(--text-muted)',
                      fontSize: '0.8rem',
                    }}
                  >
                    <svg
                      style={{ width: 28, height: 28, margin: '0 auto 8px', opacity: 0.4 }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    ისტორია ცარიელია
                  </div>
                ) : (
                  history.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        setResult(item);
                        setInputText(item.originalText);
                      }}
                      className="history-item"
                      style={{
                        padding: '10px 12px',
                        background: 'var(--surface-2)',
                        border: '1px solid var(--border)',
                        borderRadius: 8,
                        cursor: 'pointer',
                        position: 'relative',
                        overflow: 'hidden',
                      }}
                    >
                      <p
                        style={{
                          fontSize: '0.82rem',
                          color: 'var(--text-secondary)',
                          lineClamp: 2,
                          overflow: 'hidden',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical' as const,
                          paddingRight: 20,
                        }}
                      >
                        {item.originalText}
                      </p>
                      <div
                        style={{
                          marginTop: 6,
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          fontSize: '0.7rem',
                          color: 'var(--text-muted)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.06em',
                          fontWeight: 600,
                        }}
                      >
                        <span>{new Date(item.timestamp).toLocaleDateString('ka-GE')}</span>
                        {item.isCorrect ? (
                          <span style={{ color: '#4ade80' }}>გამართული</span>
                        ) : (
                          <span style={{ color: '#60a5fa' }}>შესწორებული</span>
                        )}
                      </div>

                      {/* Delete */}
                      <button
                        onClick={(e) => deleteHistoryItem(item.id, e)}
                        title="წაშლა"
                        style={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          color: 'var(--text-muted)',
                          padding: 2,
                          borderRadius: 4,
                          opacity: 0,
                          transition: 'opacity 0.15s, color 0.15s',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                        }}
                        className="group-hover:opacity-100"
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLElement).style.opacity = '1';
                          (e.currentTarget as HTMLElement).style.color = '#f87171';
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLElement).style.opacity = '0';
                          (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)';
                        }}
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer
        style={{
          borderTop: '1px solid var(--border)',
          padding: '20px 16px',
          textAlign: 'center',
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        © {new Date().getFullYear()} Georgian Linguist Pro{' '}
        <span style={{ color: 'var(--border-hover)', margin: '0 6px' }}>•</span>
        ყველა უფლება დაცულია
      </footer>
    </div>
  );
};

export default App;
