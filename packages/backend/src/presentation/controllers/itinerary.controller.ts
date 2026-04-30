import { Request, Response } from 'express';
import { GenerateItineraryUseCase } from '../../application/use-cases/generate-itinerary.use-case';
import { ItineraryRequest } from '../../domain/entities/travel-plan.entity';

export class ItineraryController {
  constructor(
    private readonly generateItineraryUseCase: GenerateItineraryUseCase,
  ) {}

  async generate(req: Request, res: Response): Promise<void> {
    const request = req.body as ItineraryRequest;

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');

    const send = (payload: object) =>
      res.write(`data: ${JSON.stringify(payload)}\n\n`);

    try {
      for await (const chunk of this.generateItineraryUseCase.execute(request)) {
        send({ type: 'text', content: chunk });
      }
      send({ type: 'done' });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'エラーが発生しました';
      send({ type: 'error', message });
    } finally {
      res.end();
    }
  }
}
