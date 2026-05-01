import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ItineraryRequest } from '../types';

interface ItineraryDisplayProps {
  itinerary: string;
  isLoading: boolean;
  isDone: boolean;
  error: string | null;
  lastRequest: ItineraryRequest | null;
  onSave: () => void;
  onNewPlan: () => void;
  isSaved: boolean;
}

export function ItineraryDisplay({
  itinerary, isLoading, isDone, error, lastRequest, onSave, onNewPlan, isSaved,
}: ItineraryDisplayProps) {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      {/* Sticky toolbar */}
      <div style={{
        flexShrink: 0,
        backgroundColor: 'var(--rt-primary)',
        borderBottom: '3px solid var(--rt-accent)',
        padding: '14px 28px',
        display: 'flex', alignItems: 'center', gap: '16px',
      }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          {lastRequest ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <p style={{ fontWeight: '700', fontSize: '17px', color: 'var(--rt-white)', margin: 0 }}>
                  {lastRequest.destination}
                </p>
                {isLoading && (
                  <span style={{ display: 'inline-flex', gap: '3px' }}>
                    {[0, 1, 2].map((i) => (
                      <span key={i} style={{
                        width: '5px', height: '5px', borderRadius: '50%',
                        backgroundColor: 'var(--rt-accent)', display: 'inline-block',
                        animation: 'bounce 1s infinite', animationDelay: `${i * 0.15}s`,
                      }} />
                    ))}
                  </span>
                )}
              </div>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginTop: '2px', letterSpacing: '0.3px' }}>
                {lastRequest.startDate} 〜 {lastRequest.endDate} · {lastRequest.numberOfPeople}名
              </p>
            </>
          ) : (
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', margin: 0 }}>生成中...</p>
          )}
        </div>

        {isDone && (
          <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
            <button
              onClick={onNewPlan}
              style={{
                padding: '8px 18px', borderRadius: '4px', cursor: 'pointer',
                border: '1px solid rgba(255,255,255,0.3)',
                backgroundColor: 'transparent', color: 'var(--rt-white)',
                fontSize: '13px', fontWeight: '500', fontFamily: 'inherit',
                transition: 'border-color 0.2s',
              }}
            >
              新しいプラン
            </button>
            <button
              onClick={onSave}
              disabled={isSaved}
              style={{
                padding: '8px 18px', borderRadius: '4px', cursor: isSaved ? 'default' : 'pointer',
                border: 'none',
                backgroundColor: isSaved ? 'rgba(255,255,255,0.2)' : 'var(--rt-accent)',
                color: isSaved ? 'rgba(255,255,255,0.5)' : 'var(--rt-primary)',
                fontSize: '13px', fontWeight: '700', fontFamily: 'inherit',
                transition: 'background-color 0.2s',
              }}
            >
              {isSaved ? '保存済み' : '保存する'}
            </button>
          </div>
        )}
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', backgroundColor: 'var(--rt-bg)', padding: '32px 28px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>

          {error && (
            <div style={{
              backgroundColor: '#fff0f0', borderLeft: '4px solid #c0392b',
              borderRadius: 'var(--rt-radius)', padding: '20px', marginBottom: '16px',
            }}>
              <p style={{ fontWeight: '700', color: '#c0392b', marginBottom: '6px' }}>エラーが発生しました</p>
              <p style={{ fontSize: '14px', color: '#922b21' }}>{error}</p>
            </div>
          )}

          {isLoading && !itinerary && (
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              justifyContent: 'center', padding: '80px 16px', gap: '20px',
            }}>
              <svg width="52" height="52" viewBox="0 0 24 24" fill="var(--rt-accent)" style={{ opacity: 0.7 }}>
                <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
              </svg>
              <p style={{ color: 'var(--rt-text-muted)', fontSize: '15px', textAlign: 'center', lineHeight: '1.8' }}>
                AIがしおりを作成しています...<br />少々お待ちください
              </p>
            </div>
          )}

          {itinerary && (
            <div style={{
              backgroundColor: 'var(--rt-white)',
              borderRadius: 'var(--rt-radius)',
              borderLeft: '5px solid var(--rt-accent)',
              boxShadow: 'var(--rt-shadow)',
              padding: '32px 36px',
            }}>
              <div className="itinerary-content">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{itinerary}</ReactMarkdown>
              </div>
              {isLoading && (
                <span style={{
                  display: 'inline-block', width: '8px', height: '18px', marginTop: '12px',
                  backgroundColor: 'var(--rt-accent)', borderRadius: '2px', opacity: 0.8,
                  animation: 'pulse 1s infinite',
                }} />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
