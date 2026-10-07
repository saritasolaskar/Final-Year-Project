import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { seedDatabase } from './utils/seeder.js';

// Import Modular Routes
import authRoutes from './routes/authRoutes.js';
import issueRoutes from './routes/issueRoutes.js';
import wardRoutes from './routes/wardRoutes.js';
import workerRoutes from './routes/workerRoutes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Mount Modular API Endpoints
app.use('/api/auth', authRoutes);
app.use('/api/issues', issueRoutes);
app.use('/api/wards', wardRoutes);
app.use('/api/jurisdiction', wardRoutes);
app.use('/api/workers', workerRoutes);

app.get('/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'PCMC CivicAI (Bhosari AC 207)',
    database: 'MongoDB',
    port: process.env.PORT || 5001,
  });
});

const PORT = process.env.PORT || 5001;

// Connect to MongoDB and start the server
connectDB().then(async () => {
  await seedDatabase();
  app.listen(PORT, () => {
    console.log(`🚀 PCMC CivicAI Modular Backend running at http://localhost:${PORT}`);
  });
});