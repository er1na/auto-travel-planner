import { useEffect, useState } from 'react';
import { AppView, SavedPlan } from './types';
import { Layout } from './components/Layout';
import { TravelForm } from './components/TravelForm';
import { ItineraryDisplay } from './components/ItineraryDisplay';
import { SavedPlans } from './components/SavedPlans';
import { useItinerary } from './hooks/useItinerary';

function HeroSection() {
  return (
    <div style={{ padding: '56px 32px 32px', textAlign: 'center' }}>
      <svg width="56" height="56" viewBox="0 0 24 24" fill="var(--md-primary)" style={{ opacity: 0.9 }}>
        <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
      </svg>
      <h1 style={{ fontSize: '32px', fontWeight: '400', color: 'var(--md-on-surface)', marginTop: '16px', letterSpacing: '-0.5px' }}>
        旅のしおり AI
      </h1>
      <p style={{ fontSize: '15px', color: 'var(--md-on-surface-variant)', marginTop: '8px', lineHeight: '1.7' }}>
        行き先と旅行条件を入力するだけで<br />AIが詳細な旅程を自動作成します
      </p>
    </div>
  );
}

export function App() {
  const [view, setView] = useState<AppView>('home');
  const [showResult, setShowResult] = useState(false);
  const [mobileShowResult, setMobileShowResult] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SavedPlan | null>(null);
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 960 : false,
  );

  const { itinerary, isLoading, isDone, error, savedPlans, lastRequest, generate, saveCurrent, deletePlan } = useItinerary();
  const hasResult = isDone && itinerary.trim().length > 0;

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 960);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const handleGenerate = async (request: Parameters<typeof generate>[0]) => {
    setShowResult(true);
    setMobileShowResult(false);
    setIsSaved(false);
    await generate(request);
  };

  const handleSave = () => {
    if (!lastRequest) return;
    saveCurrent(lastRequest.destination, lastRequest.startDate, lastRequest.endDate);
    setIsSaved(true);
  };

  const handleNewPlan = () => {
    setShowResult(false);
    setMobileShowResult(false);
    setIsSaved(false);
  };

  const handleViewGenerated = () => {
    if (!hasResult) return;
    setMobileShowResult(true);
  };

  const handleNavigate = (v: AppView) => {
    setView(v);
    setSelectedPlan(null);
  };

  const handleSelectPlan = (plan: SavedPlan) => {
    setSelectedPlan(plan);
    setView('plan-detail');
  };

  const handleDeletePlan = (id: string) => {
    deletePlan(id);
    if (selectedPlan?.id === id) setSelectedPlan(null);
  };

  return (
    <Layout view={view} onNavigate={handleNavigate}>
      {view === 'home' && (
        <div style={{
          display: isMobile ? 'block' : 'grid',
          gridTemplateColumns: showResult ? '440px 1fr' : '1fr',
          gridTemplateRows: isMobile ? undefined : '1fr',
          height: 'calc(100dvh - 64px)',
        }}>
          {/* Form panel */}
          {(!isMobile || !mobileShowResult) && (
            <div style={{
              height: '100%',
              overflowY: 'auto',
              borderRight: !isMobile && showResult ? '1px solid var(--md-outline-variant)' : 'none',
            }}>
              {!showResult && <HeroSection />}
              <div style={showResult ? {} : { maxWidth: '560px', margin: '0 auto' }}>
                <TravelForm
                  onSubmit={handleGenerate}
                  isLoading={isLoading}
                  isDone={isDone}
                  hasResult={hasResult}
                  isMobile={isMobile}
                  onViewResult={handleViewGenerated}
                />
              </div>
            </div>
          )}

          {/* Result panel */}
          {(!isMobile && showResult) || (isMobile && mobileShowResult) ? (
            <ItineraryDisplay
              itinerary={itinerary}
              isLoading={isLoading}
              isDone={isDone}
              error={error}
              lastRequest={lastRequest}
              onSave={handleSave}
              onNewPlan={handleNewPlan}
              isSaved={isSaved}
            />
          ) : null}
        </div>
      )}

      {(view === 'saved' || view === 'plan-detail') && (
        <SavedPlans
          plans={savedPlans}
          selectedPlan={selectedPlan}
          onSelect={handleSelectPlan}
          onDelete={handleDeletePlan}
        />
      )}
    </Layout>
  );
}
