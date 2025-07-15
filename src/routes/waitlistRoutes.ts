import { Router } from 'express';
import { addToWaitlist } from '../controllers/waitlistController';
import { validateRequest, waitlistValidationRules } from '../middleware/validationMiddleware';

const router = Router();

router.post('/', validateRequest(waitlistValidationRules), addToWaitlist);

export default router;
