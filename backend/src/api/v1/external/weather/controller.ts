/**
 * @summary
 * Weather API controller for external (public) endpoints.
 * Handles temperature display, unit conversion, and manual refresh operations.
 *
 * @module api/v1/external/weather/controller
 */

import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { weatherService } from '@/services/weather';
import { successResponse, errorResponse } from '@/utils/response';
import { HTTP_STATUS } from '@/constants/http';

/**
 * @api {get} /api/v1/external/weather/current Get Current Temperature
 * @apiName GetCurrentTemperature
 * @apiGroup Weather
 * @apiVersion 1.0.0
 *
 * @apiDescription Retrieves current temperature data for a specified location
 *
 * @apiParam {String} location Location name (city, state/country)
 * @apiParam {String} [unit=celsius] Temperature unit (celsius or fahrenheit)
 *
 * @apiSuccess {Number} temperature Current temperature value
 * @apiSuccess {String} unit Temperature unit (°C or °F)
 * @apiSuccess {String} location Location name
 * @apiSuccess {String} lastUpdate Last update timestamp
 * @apiSuccess {String} status Connection status
 *
 * @apiError {String} ValidationError Invalid parameters provided
 * @apiError {String} ServiceError External API error
 */
export async function getCurrentTemperature(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const querySchema = z.object({
      location: z.string().min(1).max(50),
      unit: z.enum(['celsius', 'fahrenheit']).optional().default('celsius'),
    });

    const validated = querySchema.parse(req.query);

    const data = await weatherService.getCurrentTemperature(validated.location, validated.unit);

    res.json(successResponse(data));
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json(errorResponse('Invalid request parameters', 'VALIDATION_ERROR', error.errors));
    } else if (error.code === 'WEATHER_API_ERROR') {
      res
        .status(HTTP_STATUS.SERVICE_UNAVAILABLE)
        .json(errorResponse(error.message, 'WEATHER_API_ERROR'));
    } else {
      next(error);
    }
  }
}

/**
 * @api {post} /api/v1/external/weather/refresh Refresh Temperature Data
 * @apiName RefreshTemperature
 * @apiGroup Weather
 * @apiVersion 1.0.0
 *
 * @apiDescription Manually refreshes temperature data for a specified location
 *
 * @apiParam {String} location Location name (city, state/country)
 * @apiParam {String} [unit=celsius] Temperature unit (celsius or fahrenheit)
 *
 * @apiSuccess {Number} temperature Updated temperature value
 * @apiSuccess {String} unit Temperature unit
 * @apiSuccess {String} location Location name
 * @apiSuccess {String} lastUpdate Update timestamp
 * @apiSuccess {String} status Update status
 *
 * @apiError {String} ThrottleError Too many refresh requests
 * @apiError {String} ServiceError External API error
 */
export async function refreshTemperature(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const bodySchema = z.object({
      location: z.string().min(1).max(50),
      unit: z.enum(['celsius', 'fahrenheit']).optional().default('celsius'),
    });

    const validated = bodySchema.parse(req.body);

    const data = await weatherService.refreshTemperature(validated.location, validated.unit);

    res.json(successResponse(data));
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json(errorResponse('Invalid request parameters', 'VALIDATION_ERROR', error.errors));
    } else if (error.code === 'THROTTLE_ERROR') {
      res
        .status(HTTP_STATUS.TOO_MANY_REQUESTS)
        .json(errorResponse(error.message, 'THROTTLE_ERROR'));
    } else if (error.code === 'WEATHER_API_ERROR') {
      res
        .status(HTTP_STATUS.SERVICE_UNAVAILABLE)
        .json(errorResponse(error.message, 'WEATHER_API_ERROR'));
    } else {
      next(error);
    }
  }
}
