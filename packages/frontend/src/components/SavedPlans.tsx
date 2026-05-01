import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { SavedPlan } from '../types';

interface SavedPlansProps {
  plans: SavedPlan[];
  selectedPlan: SavedPlan | null;
  onSelect: (plan: SavedPlan) => void;
  onDelete: (id: string) => void;
}

const PANEL_HEIGHT = 'calc(100dvh - 64px)';

export function SavedPlans({ plans, selectedPlan, onSelect, onDelete }: SavedPlansProps) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '300px 1fr',
      gridTemplateRows: '1fr',
      height: PANEL_HEIGHT,
    }}>
      {/* Left: list */}
      <div style={{
        height: '100%', overflowY: 'auto',
        borderRight: '1px solid var(--rt-border)',
        backgroundColor: 'var(--rt-white)',
      }}>
        <div style={{ padding: '20px 16px 16px' }}>
          <p style={{
            fontSize: '11px', fontWeight: '700', letterSpacing: '1.5px',
            textTransform: 'uppercase', color: 'var(--rt-primary)',
            marginBottom: '12px', paddingBottom: '8px',
            borderBottom: '2px solid var(--rt-accent)',
          }}>
            保存済みの旅 ({plans.length}件)
          </p>

          {plans.length === 0 ? (
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              padding: '40px 16px', gap: '12px', color: 'var(--rt-text-muted)',
            }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--rt-border)" strokeWidth="1.5">
                <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" />
              </svg>
              <p style={{ fontSize: '13px', textAlign: 'center', lineHeight: '1.7' }}>
                保存されたしおりはありません
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {plans.map((plan) => {
                const active = selectedPlan?.id === plan.id;
                return (
                  <button
                    key={plan.id}
                    onClick={() => onSelect(plan)}
                    style={{
                      width: '100%', textAlign: 'left', padding: '12px 14px',
                      borderRadius: '6px', border: 'none', cursor: 'pointer',
                      fontFamily: 'inherit',
                      backgroundColor: active ? 'var(--rt-primary)' : 'var(--rt-bg)',
                      borderLeft: active ? '4px solid var(--rt-accent)' : '4px solid transparent',
                      transition: 'all 0.15s',
                    }}
                  >
                    <p style={{
                      fontWeight: '700', fontSize: '14px',
                      color: active ? 'var(--rt-white)' : 'var(--rt-text)',
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                      margin: 0,
                    }}>
                      {plan.destination}
                    </p>
                    <p style={{
                      fontSize: '12px', marginTop: '3px',
                      color: active ? 'rgba(255,255,255,0.65)' : 'var(--rt-text-muted)',
                    }}>
                      {plan.startDate} 〜 {plan.endDate}
                    </p>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Right: detail */}
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {selectedPlan ? (
          <>
            {/* Sticky header */}
            <div style={{
              flexShrink: 0,
              backgroundColor: 'var(--rt-primary)',
              borderBottom: '3px solid var(--rt-accent)',
              padding: '14px 28px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px',
            }}>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--rt-white)', margin: 0 }}>
                  {selectedPlan.destination}
                </h2>
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginTop: '3px' }}>
                  {selectedPlan.startDate} 〜 {selectedPlan.endDate} ·{' '}
                  {new Date(selectedPlan.createdAt).toLocaleDateString('ja-JP', { year: 'numeric', month: 'short', day: 'numeric' })} 作成
                </p>
              </div>
              <button
                onClick={() => onDelete(selectedPlan.id)}
                style={{
                  padding: '7px 16px', borderRadius: '4px', flexShrink: 0,
                  border: '1px solid rgba(255,255,255,0.3)', backgroundColor: 'transparent',
                  color: 'rgba(255,255,255,0.7)', fontSize: '13px', fontFamily: 'inherit', cursor: 'pointer',
                }}
              >
                削除
              </button>
            </div>

            {/* Scrollable content */}
            <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', backgroundColor: 'var(--rt-bg)', padding: '32px 28px' }}>
              <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div style={{
                  backgroundColor: 'var(--rt-white)',
                  borderRadius: 'var(--rt-radius)',
                  borderLeft: '5px solid var(--rt-accent)',
                  boxShadow: 'var(--rt-shadow)',
                  padding: '32px 36px',
                }}>
                  <div className="itinerary-content">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{selectedPlan.itinerary}</ReactMarkdown>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div style={{
            height: '100%', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            gap: '16px', color: 'var(--rt-text-muted)',
            backgroundColor: 'var(--rt-bg)',
          }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--rt-border)" strokeWidth="1">
              <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" />
            </svg>
            <p style={{ fontSize: '14px' }}>左のリストからしおりを選択してください</p>
          </div>
        )}
      </div>
    </div>
  );
}
