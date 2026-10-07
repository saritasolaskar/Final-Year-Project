import express from 'express';
import { getWorkers } from '../controllers/workerController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', verifyToken, getWorkers);

export default router;