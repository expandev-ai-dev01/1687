/**
 * @summary
 * Weather API routes configuration.
 * Defines routes for temperature display and refresh operations.
 *
 * @module routes/v1/weatherRoutes
 */

import { Router } from 'express';
import * as weatherController from '@/api/v1/external/weather/controller';

const router = Router();

// GET /api/v1/external/weather/current - Get current temperature
router.get('/current', weatherController.getCurrentTemperature);

// POST /api/v1/external/weather/refresh - Manually refresh temperature
router.post('/refresh', weatherController.refreshTemperature);

export default router;
