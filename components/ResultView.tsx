
import React, { useState } from 'react';
import { CorrectionResult } from '../types';

interface ResultViewProps {
  result: CorrectionResult;
  onClear: () => void;
}

const ResultView: React.FC<ResultViewProps> = ({ result, onClear }) => {
  const [copied, setCopied] = useState(false);

  const renderCorrectedText = (text: string) => {
    const parts = text.split(/(\*\*\[.*?\]\*\*)/g);
    return parts.map((part, index) => {
      const match = part.match(/\*\*\[(.*?)\]\*\*/);
      if (match) {
        return (
          <span
            key={index}
            style={{
              background: 'rgba(228,26,26,0.15)',
              color: '#ff8080',
              padding: '0 4px',
              borderRadius: 4,
              fontWeight: 600,
              borderBottom: '1.5px solid rgba(228,26,26,0.5)',
            }}
          >
            {match[1]}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result.correctedText.replace(/\*\*\[|\]\*\*/g, ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="glass animate-fade-up overflow-hidden"
      style={{ animationDuration: '0.35s' }}
    >
      {/* Status bar */}
      <div
        style={{
          padding: '12px 20px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div className="flex items-center space-x-2" style={{ fontSize: '0.875rem', fontWeight: 500 }}>
          {result.isCorrect ? (
            <>
              <span style={{ color: 'var(--green)' }}>
                <svg className="w-4 h-4 inline mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                ტექსტი გამართულია
              </span>
            </>
          ) : (
            <>
              <span style={{ color: 'var(--blue)' }}>
                <svg className="w-4 h-4 inline mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                რედაქტირებული ტექსტი
              </span>
            </>
          )}
        </div>

        <button
          onClick={onClear}
          title="წაშლა"
          style={{
            color: 'var(--text-muted)',
            padding: 6,
            borderRadius: 6,
            transition: 'color 0.15s, background 0.15s',
          }}
          className="hover:text-white hover:bg-white/5"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Corrected text */}
      <div style={{ padding: '20px' }}>
        <div
          style={{
            background: 'var(--surface-2)',
            border: '1px solid var(--border)',
            borderRadius: 10,
            padding: '16px 18px',
            minHeight: 120,
            lineHeight: 1.8,
            color: 'var(--text-primary)',
            fontSize: '1rem',
          }}
        >
          {renderCorrectedText(result.correctedText)}
        </div>

        {result.explanation && !result.isCorrect && (
          <div
            style={{
              marginTop: 12,
              padding: '10px 14px',
              background: 'rgba(59,130,246,0.08)',
              border: '1px solid rgba(59,130,246,0.18)',
              borderRadius: 8,
              color: '#93c5fd',
              fontSize: '0.82rem',
              lineHeight: 1.6,
            }}
          >
            <strong style={{ color: '#bfdbfe' }}>შენიშვნა: </strong>
            {result.explanation}
          </div>
        )}

        {/* Actions */}
        <div className="mt-5 flex gap-3">
          <button
            onClick={handleCopy}
            style={{
              flex: 1,
              padding: '10px 18px',
              background: copied ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.05)',
              border: `1px solid ${copied ? 'rgba(34,197,94,0.3)' : 'var(--border)'}`,
              borderRadius: 8,
              color: copied ? '#86efac' : 'var(--text-secondary)',
              fontWeight: 500,
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              transition: 'all 0.2s',
              cursor: 'pointer',
            }}
          >
            {copied ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                დაკოპირდა!
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
                ასლის გადაღება
              </>
            )}
          </button>

          <button
            onClick={() => window.location.reload()}
            style={{
              flex: 1,
              padding: '10px 18px',
              background: 'var(--accent)',
              borderRadius: 8,
              color: '#fff',
              fontWeight: 600,
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              transition: 'all 0.2s',
              cursor: 'pointer',
              border: 'none',
            }}
            className="btn-accent"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            ახალი ტექსტი
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultView;
