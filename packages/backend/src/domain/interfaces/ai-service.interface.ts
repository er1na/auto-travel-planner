import { ItineraryRequest } from '../entities/travel-plan.entity';

export interface IAIService {
  streamItinerary(request: ItineraryRequest): AsyncGenerator<string>;
}
