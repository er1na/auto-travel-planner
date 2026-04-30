import { Router } from 'express';
import { GeminiService } from '../../infrastructure/ai/gemini.service';
import { GenerateItineraryUseCase } from '../../application/use-cases/generate-itinerary.use-case';
import { ItineraryController } from '../controllers/itinerary.controller';

const router = Router();

// Dependency injection
const claudeService = new GeminiService();
const generateItineraryUseCase = new GenerateItineraryUseCase(claudeService);
const itineraryController = new ItineraryController(generateItineraryUseCase);

router.post('/generate', (req, res) => itineraryController.generate(req, res));

export default router;
