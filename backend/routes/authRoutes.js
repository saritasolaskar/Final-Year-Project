import express from 'express';
import { registerCitizen, loginUser } from '../controllers/authController.js';

const router = express.Router();
router.post('/register', registerCitizen);
router.post('/login', loginUser);

export default router;