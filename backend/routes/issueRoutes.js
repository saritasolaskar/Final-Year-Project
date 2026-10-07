import express from 'express';
import {
  getIssues,
  createIssue,
  assignIssue,
  updateIssue,
  upvoteIssue,
} from '../controllers/issueController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(verifyToken, getIssues)
  .post(verifyToken, createIssue);

router.post('/:id/assign', verifyToken, assignIssue);
router.patch('/:id', verifyToken, updateIssue);
router.post('/:id/upvote', verifyToken, upvoteIssue);

export default router;