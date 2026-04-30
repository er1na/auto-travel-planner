import { IAIService } from '../../domain/interfaces/ai-service.interface';
import { ItineraryRequest } from '../../domain/entities/travel-plan.entity';

export class GenerateItineraryUseCase {
  constructor(private readonly aiService: IAIService) {}

  async *execute(request: ItineraryRequest): AsyncGenerator<string> {
    this.validate(request);
    yield* this.aiService.streamItinerary(request);
  }

  private validate(request: ItineraryRequest): void {
    if (!request.destination?.trim()) {
      throw new Error('目的地を入力してください');
    }
    if (!request.startDate || !request.endDate) {
      throw new Error('旅行期間を入力してください');
    }
    if (new Date(request.startDate) > new Date(request.endDate)) {
      throw new Error('出発日は帰着日より前の日付を指定してください');
    }
    if (!request.numberOfPeople || request.numberOfPeople < 1) {
      throw new Error('旅行人数を正しく入力してください');
    }
  }
}
