import { Router } from 'express';
import { handleDonate, submitFeedback } from '../controllers/general.controller';

const router = Router();

// --- Feature Routes ---
// Donate (Discord Webhook)
router.post('/donate', handleDonate);
// Feedback (Discord Webhook)
router.post('/feedback', submitFeedback);

export default router;