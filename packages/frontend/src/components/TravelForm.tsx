import { useState, FormEvent } from 'react';
import { ItineraryRequest, BudgetLevel } from '../types';

const INTERESTS = [
  '観光スポット', 'グルメ・食事', '自然・アウトドア', '歴史・文化',
  'ショッピング', 'アクティビティ', '温泉・スパ', 'アート・美術館',
  'テーマパーク', '街歩き・散策',
];

const TRANSPORTATION_MODES = [
  { value: '電車', icon: '🚃' },
  { value: 'バス', icon: '🚌' },
  { value: 'レンタカー', icon: '🚗' },
  { value: 'タクシー', icon: '🚕' },
  { value: '徒歩', icon: '🚶' },
  { value: '自転車', icon: '🚲' },
];

const BUDGET_OPTIONS: { value: BudgetLevel; label: string; sub: string }[] = [
  { value: 'economy', label: '節約', sub: 'コスパ重視' },
  { value: 'moderate', label: '普通', sub: 'バランス型' },
  { value: 'luxury', label: 'ぜいたく', sub: '質を重視' },
];

interface TravelFormProps {
  onSubmit: (request: ItineraryRequest) => void;
  isLoading: boolean;
  isDone: boolean;
  hasResult: boolean;
  isMobile: boolean;
  onViewResult: () => void;
}

const sectionLabel: React.CSSProperties = {
  fontSize: '11px',
  fontWeight: '700',
  letterSpacing: '1.5px',
  textTransform: 'uppercase' as const,
  color: 'var(--rt-primary)',
  marginBottom: '10px',
  display: 'block',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 14px',
  border: '1px solid var(--rt-border)',
  borderRadius: '6px',
  backgroundColor: 'var(--rt-white)',
  color: 'var(--rt-text)',
  fontSize: '15px',
  fontFamily: 'inherit',
  outline: 'none',
  transition: 'border-color 0.2s',
};

export function TravelForm({ onSubmit, isLoading, isDone, hasResult, isMobile, onViewResult }: TravelFormProps) {
  const today = new Date().toISOString().split('T')[0];

  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [numberOfPeople, setNumberOfPeople] = useState(2);
  const [budget, setBudget] = useState<BudgetLevel>('moderate');
  const [transportationModes, setTransportationModes] = useState<string[]>(['電車']);
  const [interests, setInterests] = useState<string[]>(['観光スポット', 'グルメ・食事']);
  const [additionalNotes, setAdditionalNotes] = useState('');

  const toggleTransportationMode = (mode: string) => {
    setTransportationModes((prev) =>
      prev.includes(mode) ? prev.filter((m) => m !== mode) : [...prev, mode],
    );
  };

  const toggleInterest = (interest: string) => {
    setInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest],
    );
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (isMobile && isDone && hasResult && !isLoading) {
      onViewResult();
      return;
    }
    if (!destination.trim()) return;
    onSubmit({
      destination,
      startDate,
      endDate,
      numberOfPeople,
      budget,
      transportationModes,
      interests,
      additionalNotes,
    });
  };

  const focus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.currentTarget.style.borderColor = 'var(--rt-primary)';
    e.currentTarget.style.borderWidth = '2px';
  };
  const blur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.currentTarget.style.borderColor = 'var(--rt-border)';
    e.currentTarget.style.borderWidth = '1px';
  };

  const isViewResultMode = isMobile && isDone && hasResult && !isLoading;
  const canSubmit = isViewResultMode || (!isLoading && destination.trim().length > 0);

  const cardSection = (children: React.ReactNode) => (
    <div style={{
      backgroundColor: 'var(--rt-white)',
      borderRadius: 'var(--rt-radius)',
      padding: '20px',
      boxShadow: 'var(--rt-shadow)',
      borderLeft: '4px solid var(--rt-accent)',
    }}>
      {children}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '24px' }}>

      {/* Destination */}
      {cardSection(
        <>
          <label style={sectionLabel}>目的地</label>
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="例：京都、沖縄、北海道..."
            required
            style={inputStyle}
            onFocus={focus} onBlur={blur}
          />
        </>
      )}

      {/* Dates */}
      {cardSection(
        <>
          <label style={sectionLabel}>旅行期間</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input
              type="date" value={startDate} min={today}
              onChange={(e) => { setStartDate(e.target.value); if (e.target.value > endDate) setEndDate(e.target.value); }}
              style={{ ...inputStyle, flex: 1, fontSize: '14px' }}
              onFocus={focus} onBlur={blur}
            />
            <span style={{ color: 'var(--rt-text-muted)', flexShrink: 0, fontSize: '14px' }}>〜</span>
            <input
              type="date" value={endDate} min={startDate}
              onChange={(e) => setEndDate(e.target.value)}
              style={{ ...inputStyle, flex: 1, fontSize: '14px' }}
              onFocus={focus} onBlur={blur}
            />
          </div>
        </>
      )}

      {/* People */}
      {cardSection(
        <>
          <label style={sectionLabel}>旅行人数</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              type="button"
              onClick={() => setNumberOfPeople((n) => Math.max(1, n - 1))}
              style={{
                width: '36px', height: '36px', borderRadius: '18px',
                border: '1px solid var(--rt-border)', backgroundColor: 'transparent',
                color: 'var(--rt-text)', fontSize: '18px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'inherit',
              }}
            >−</button>
            <span style={{ fontSize: '20px', fontWeight: '700', color: 'var(--rt-primary)', minWidth: '52px', textAlign: 'center' }}>
              {numberOfPeople}名
            </span>
            <button
              type="button"
              onClick={() => setNumberOfPeople((n) => Math.min(20, n + 1))}
              style={{
                width: '36px', height: '36px', borderRadius: '18px',
                border: '1px solid var(--rt-border)', backgroundColor: 'transparent',
                color: 'var(--rt-text)', fontSize: '18px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'inherit',
              }}
            >＋</button>
          </div>
        </>
      )}

      {/* Budget */}
      {cardSection(
        <>
          <label style={sectionLabel}>予算感</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            {BUDGET_OPTIONS.map((opt) => {
              const active = budget === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setBudget(opt.value)}
                  style={{
                    flex: 1, padding: '12px 8px', borderRadius: '6px', cursor: 'pointer',
                    border: active ? '2px solid var(--rt-primary)' : '1px solid var(--rt-border)',
                    backgroundColor: active ? 'var(--rt-primary)' : 'var(--rt-white)',
                    color: active ? 'var(--rt-white)' : 'var(--rt-text)',
                    fontFamily: 'inherit', transition: 'all 0.2s',
                  }}
                >
                  <div style={{ fontWeight: '700', fontSize: '14px' }}>{opt.label}</div>
                  <div style={{ fontSize: '11px', marginTop: '2px', opacity: 0.7 }}>{opt.sub}</div>
                </button>
              );
            })}
          </div>
        </>
      )}

      {/* Transportation */}
      {cardSection(
        <>
          <label style={sectionLabel}>交通手段（複数選択可）</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {TRANSPORTATION_MODES.map((mode) => {
              const selected = transportationModes.includes(mode.value);
              return (
                <button
                  key={mode.value}
                  type="button"
                  onClick={() => toggleTransportationMode(mode.value)}
                  style={{
                    padding: '7px 14px', borderRadius: '20px', cursor: 'pointer',
                    border: selected ? '2px solid var(--rt-primary)' : '1px solid var(--rt-border)',
                    backgroundColor: selected ? 'var(--rt-primary)' : 'transparent',
                    color: selected ? 'var(--rt-white)' : 'var(--rt-text-muted)',
                    fontSize: '13px', fontWeight: selected ? '500' : '400',
                    fontFamily: 'inherit', transition: 'all 0.15s',
                  }}
                >
                  <span style={{ marginRight: '6px' }} aria-hidden="true">{mode.icon}</span>
                  {mode.value}
                </button>
              );
            })}
          </div>
        </>
      )}

      {/* Interests */}
      {cardSection(
        <>
          <label style={sectionLabel}>興味・関心</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {INTERESTS.map((interest) => {
              const selected = interests.includes(interest);
              return (
                <button
                  key={interest}
                  type="button"
                  onClick={() => toggleInterest(interest)}
                  style={{
                    padding: '6px 14px', borderRadius: '20px', cursor: 'pointer',
                    border: selected ? '2px solid var(--rt-primary)' : '1px solid var(--rt-border)',
                    backgroundColor: selected ? 'var(--rt-primary)' : 'transparent',
                    color: selected ? 'var(--rt-white)' : 'var(--rt-text-muted)',
                    fontSize: '13px', fontWeight: selected ? '500' : '400',
                    fontFamily: 'inherit', transition: 'all 0.15s',
                  }}
                >
                  {interest}
                </button>
              );
            })}
          </div>
        </>
      )}

      {/* Notes */}
      {cardSection(
        <>
          <label style={sectionLabel}>その他のご要望（任意）</label>
          <textarea
            value={additionalNotes}
            onChange={(e) => setAdditionalNotes(e.target.value)}
            placeholder="例：子連れ旅行、ペット同伴、バリアフリー希望..."
            rows={3}
            style={{ ...inputStyle, resize: 'none', lineHeight: '1.6' }}
            onFocus={focus} onBlur={blur}
          />
        </>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={!canSubmit}
        style={{
          width: '100%', padding: '16px', borderRadius: '6px', border: 'none',
          backgroundColor: canSubmit ? 'var(--rt-primary)' : 'var(--rt-border)',
          color: canSubmit ? 'var(--rt-white)' : 'var(--rt-text-muted)',
          fontSize: '14px', fontWeight: '700', fontFamily: 'inherit',
          letterSpacing: '1px', cursor: canSubmit ? 'pointer' : 'not-allowed',
          transition: 'background-color 0.2s',
          borderBottom: canSubmit ? '3px solid var(--rt-accent)' : '3px solid transparent',
        }}
      >
        {isLoading ? 'しおりを作成中...' : isViewResultMode ? '作成されたしおりを見る' : 'しおりを作成する'}
      </button>
    </form>
  );
}
