import express from 'express';
import { sendOtp, login, logout, getMe, getDemoAccounts } from './auth.controller.js';
import { authenticate } from '../../middleware/auth.js';
import { validateBody } from '../../middleware/validate.js';
import { z } from 'zod';

const router = express.Router();
const credentialsSchema = z.object({
  phone: z.string().trim().min(1, 'Phone number is required'),
  otp: z.string().trim().min(1, 'OTP is required'),
});
const phoneSchema = z.object({
  phone: z.string().trim().min(1, 'Phone number is required'),
});

router.post('/send-otp', validateBody(phoneSchema), sendOtp);
router.post('/login', validateBody(credentialsSchema), login);
router.post('/logout', logout);
router.get('/me', authenticate, getMe);
router.get('/demo-accounts', getDemoAccounts);

export default router;
