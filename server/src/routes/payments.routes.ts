import { Router } from 'express';
import { webhook, simulatePayment } from '../controllers/payments.controller';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.post('/webhook', webhook);
router.post('/simulate', authMiddleware, simulatePayment);

export default router;
