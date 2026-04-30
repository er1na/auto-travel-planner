import { useState, useCallback } from 'react';
import { ItineraryRequest, SavedPlan } from '../types';
import { generateItinerary } from '../services/api';

const STORAGE_KEY = 'auto-travel-planner:saved-plans';

function loadPlans(): SavedPlan[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as SavedPlan[];
  } catch {
    return [];
  }
}

function persistPlans(plans: SavedPlan[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(plans));
}

export function useItinerary() {
  const [itinerary, setItinerary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedPlans, setSavedPlans] = useState<SavedPlan[]>(loadPlans);
  const [lastRequest, setLastRequest] = useState<ItineraryRequest | null>(null);

  const generate = useCallback(async (request: ItineraryRequest) => {
    setItinerary('');
    setIsLoading(true);
    setIsDone(false);
    setError(null);
    setLastRequest(request);

    try {
      await generateItinerary(
        request,
        (chunk) => setItinerary((prev) => prev + chunk),
        () => {
          setIsLoading(false);
          setIsDone(true);
        },
        (msg) => {
          setError(msg);
          setIsLoading(false);
        },
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました');
      setIsLoading(false);
    }
  }, []);

  const saveCurrent = useCallback(
    (destination: string, startDate: string, endDate: string) => {
      if (!itinerary) return;
      const plan: SavedPlan = {
        id: crypto.randomUUID(),
        destination,
        startDate,
        endDate,
        itinerary,
        createdAt: new Date().toISOString(),
      };
      setSavedPlans((prev) => {
        const updated = [plan, ...prev].slice(0, 30);
        persistPlans(updated);
        return updated;
      });
    },
    [itinerary],
  );

  const deletePlan = useCallback((id: string) => {
    setSavedPlans((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      persistPlans(updated);
      return updated;
    });
  }, []);

  return {
    itinerary,
    isLoading,
    isDone,
    error,
    savedPlans,
    lastRequest,
    generate,
    saveCurrent,
    deletePlan,
  };
}
