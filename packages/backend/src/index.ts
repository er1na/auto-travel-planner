import path from 'path';
import { config } from 'dotenv';

// Load .env from monorepo root
config({ path: path.join(__dirname, '../../../.env') });

import express from 'express';
import cors from 'cors';
import itineraryRoutes from './presentation/routes/itinerary.routes';

const app = express();
const PORT = process.env.PORT ?? 3001;

app.use(
  cors({
    origin: process.env.FRONTEND_URL ?? 'http://localhost:5173',
  }),
);
app.use(express.json());

app.use('/api/itinerary', itineraryRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
