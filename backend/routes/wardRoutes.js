import express from 'express';
import { getWardAnalytics, getJurisdictionHierarchy } from '../controllers/wardController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/analytics', verifyToken, getWardAnalytics);
router.get('/hierarchy', verifyToken, getJurisdictionHierarchy);

export default router;