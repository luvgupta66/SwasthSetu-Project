import express from 'express';
import {
  createPatient,
  getPatients,
  getPatientById,
  updatePatient,
  getPatientTimeline,
} from './patient.controller.js';
import { authenticate } from '../../middleware/auth.js';
import { validateBody } from '../../middleware/validate.js';
import { z } from 'zod';

const router = express.Router();
const patientSchema = z.object({
  name: z.string().trim().min(1),
  age: z.coerce.number().int().min(0).max(130),
  gender: z.enum(['Male', 'Female', 'Other']),
  phone: z.string().trim().min(1),
  village: z.string().trim().min(1),
  district: z.string().trim().min(1),
  address: z.string().optional(),
  conditions: z.union([z.array(z.string()), z.string()]).optional(),
  allergies: z.union([z.array(z.string()), z.string()]).optional(),
  pregnancy: z.object({
    isPregnant: z.boolean().optional(),
    trimester: z.number().nullable().optional(),
    dueDate: z.string().nullable().optional(),
  }).optional(),
  emergencyContact: z.object({
    name: z.string().optional(),
    phone: z.string().optional(),
    relation: z.string().optional(),
  }).optional(),
  demoAbhaId: z.string().optional(),
  consentForSharing: z.boolean().optional(),
});

router.use(authenticate);

router.post('/', validateBody(patientSchema), createPatient);
router.get('/', getPatients);
router.get('/:id', getPatientById);
router.patch('/:id', updatePatient);
router.get('/:id/timeline', getPatientTimeline);

export default router;
