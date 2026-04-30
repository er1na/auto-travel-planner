export type BudgetLevel = 'economy' | 'moderate' | 'luxury';

export interface ItineraryRequest {
  destination: string;
  startDate: string;
  endDate: string;
  numberOfPeople: number;
  budget: BudgetLevel;
  transportationModes: string[];
  interests: string[];
  additionalNotes?: string;
}

export interface SavedPlan {
  id: string;
  destination: string;
  startDate: string;
  endDate: string;
  itinerary: string;
  createdAt: string;
}

export type AppView = 'home' | 'saved' | 'plan-detail';
