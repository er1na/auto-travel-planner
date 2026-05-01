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

    let aborted = false;
    res.on('close', () => { aborted = true; });

    const send = (payload: object): boolean => {
      if (aborted || res.writableEnded) return false;
      try {
        res.write(`data: ${JSON.stringify(payload)}\n\n`);
        return true;
      } catch {
        aborted = true;
        return false;
      }
    };

    // Keep-alive ping every 15s to prevent proxy timeouts
    const keepAlive = setInterval(() => {
      if (aborted || res.writableEnded) { clearInterval(keepAlive); return; }
      try { res.write(': ping\n\n'); } catch { aborted = true; }
    }, 15000);

    try {
      for await (const chunk of this.generateItineraryUseCase.execute(request)) {
        if (aborted) break;
        send({ type: 'text', content: chunk });
      }
      if (!aborted) send({ type: 'done' });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'エラーが発生しました';
      send({ type: 'error', message });
    } finally {
      clearInterval(keepAlive);
      if (!res.writableEnded) res.end();
    }
  }
}
