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

export interface TravelPlan {
  id: string;
  request: ItineraryRequest;
  itinerary: string;
  createdAt: string;
}
