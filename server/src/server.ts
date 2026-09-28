import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { calculateDerivedStats } from '@runevale/shared';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    game: 'Runevale Backend API',
    version: '0.1.0',
    timestamp: new Date().toISOString()
  });
});

app.post('/api/combat/preview', (req, res) => {
  const { level = 1, stats = { str: 1, agi: 1, vit: 1, int: 1, dex: 1, luk: 1 } } = req.body;
  const derived = calculateDerivedStats(level, stats);
  res.json({ level, stats, derived });
});

app.listen(port, () => {
  console.log(`[Runevale Server] Listening at http://localhost:${port}`);
});
