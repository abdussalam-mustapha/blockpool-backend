import { Router } from 'express';
import { registerUser, loginUser } from '../controllers/authController';
import { validateRequest, authValidationRules } from '../middleware/validationMiddleware';

const router = Router();

router.post('/register', validateRequest(authValidationRules), registerUser);
router.post('/login', validateRequest(authValidationRules), loginUser);

export default router;
