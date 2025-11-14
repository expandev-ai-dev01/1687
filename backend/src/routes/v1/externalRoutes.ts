/**
 * @summary
 * External (public) API routes configuration for V1.
 * Handles publicly accessible endpoints without authentication.
 *
 * @module routes/v1/externalRoutes
 */

import { Router } from 'express';
import weatherRoutes from './weatherRoutes';

const router = Router();

// Weather routes - /api/v1/external/weather/...
router.use('/weather', weatherRoutes);

export default router;
