import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { SavedPlan } from '../types';

interface SavedPlansProps {
  plans: SavedPlan[];
  selectedPlan: SavedPlan | null;
  onSelect: (plan: SavedPlan) => void;
  onDelete: (id: string) => void;
  onBackToList?: () => void;
}

const PANEL_HEIGHT = 'calc(100dvh - 64px)';
const MOBILE_BREAKPOINT = 960;

export function SavedPlans({ plans, selectedPlan, onSelect, onDelete, onBackToList }: SavedPlansProps) {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < MOBILE_BREAKPOINT : false,
  );

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const showList = !isMobile || !selectedPlan;
  const showDetail = !isMobile || !!selectedPlan;
  const detailPadding = isMobile ? '16px 14px' : '32px 28px';
  const cardPadding = isMobile ? '20px 16px' : '32px 36px';

  const listPanel = (
    <div style={{
      height: '100%', overflowY: 'auto',
      borderRight: isMobile ? 'none' : '1px solid var(--rt-border)',
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
  );

  const detailPanel = (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {selectedPlan ? (
        <>
          <div style={{
            flexShrink: 0,
            backgroundColor: 'var(--rt-primary)',
            borderBottom: '3px solid var(--rt-accent)',
            padding: isMobile ? '12px 14px' : '14px 28px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, flex: 1 }}>
              {isMobile && onBackToList && (
                <button
                  type="button"
                  onClick={onBackToList}
                  aria-label="一覧に戻る"
                  style={{
                    flexShrink: 0,
                    width: '40px', height: '40px', borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.35)', backgroundColor: 'rgba(255,255,255,0.08)',
                    color: 'var(--rt-white)', fontSize: '18px', lineHeight: 1, cursor: 'pointer',
                    fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  ‹
                </button>
              )}
              <div style={{ minWidth: 0 }}>
                <h2 style={{
                  fontSize: isMobile ? '16px' : '18px', fontWeight: '700', color: 'var(--rt-white)', margin: 0,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {selectedPlan.destination}
                </h2>
                <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', marginTop: '3px' }}>
                  {selectedPlan.startDate} 〜 {selectedPlan.endDate} ·{' '}
                  {new Date(selectedPlan.createdAt).toLocaleDateString('ja-JP', { year: 'numeric', month: 'short', day: 'numeric' })} 作成
                </p>
              </div>
            </div>
            <button
              onClick={() => onDelete(selectedPlan.id)}
              style={{
                padding: isMobile ? '8px 12px' : '7px 16px', borderRadius: '4px', flexShrink: 0,
                border: '1px solid rgba(255,255,255,0.3)', backgroundColor: 'transparent',
                color: 'rgba(255,255,255,0.85)', fontSize: '12px', fontFamily: 'inherit', cursor: 'pointer',
              }}
            >
              削除
            </button>
          </div>

          <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', backgroundColor: 'var(--rt-bg)', padding: detailPadding }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
              <div style={{
                backgroundColor: 'var(--rt-white)',
                borderRadius: 'var(--rt-radius)',
                borderLeft: '5px solid var(--rt-accent)',
                boxShadow: 'var(--rt-shadow)',
                padding: cardPadding,
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
          padding: '24px 16px',
        }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--rt-border)" strokeWidth="1">
            <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" />
          </svg>
          <p style={{ fontSize: '14px', textAlign: 'center', lineHeight: '1.7' }}>
            {isMobile ? '一覧からしおりを選んでください' : '左のリストからしおりを選択してください'}
          </p>
        </div>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <div style={{ height: PANEL_HEIGHT, display: 'flex', flexDirection: 'column' }}>
        {showList && listPanel}
        {showDetail && selectedPlan && detailPanel}
      </div>
    );
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '300px 1fr',
      gridTemplateRows: '1fr',
      height: PANEL_HEIGHT,
    }}>
      {listPanel}
      {detailPanel}
    </div>
  );
}
