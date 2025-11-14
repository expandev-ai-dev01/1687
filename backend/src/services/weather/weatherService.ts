/**
 * @summary
 * Weather service business logic.
 * Handles temperature retrieval, unit conversion, caching, and throttling.
 *
 * @module services/weather/weatherService
 */

import { weatherApiClient } from '@/services/weather/weatherApiClient';
import { cacheService } from '@/services/weather/cacheService';
import { throttleService } from '@/services/weather/throttleService';
import {
  TemperatureData,
  TemperatureUnit,
  WeatherApiResponse,
} from '@/services/weather/weatherTypes';

/**
 * @summary
 * Retrieves current temperature for a location.
 * Uses cached data when available and valid.
 *
 * @function getCurrentTemperature
 *
 * @param {string} location - Location name
 * @param {TemperatureUnit} unit - Temperature unit
 *
 * @returns {Promise<TemperatureData>} Temperature data
 *
 * @throws {Error} When API request fails
 */
export async function getCurrentTemperature(
  location: string,
  unit: TemperatureUnit = 'celsius'
): Promise<TemperatureData> {
  /**
   * @rule {fn-order-processing} Check cache first for performance optimization
   */
  const cachedData = cacheService.get(location, unit);
  if (cachedData) {
    return cachedData;
  }

  /**
   * @rule {fn-order-processing} Fetch fresh data from external API
   */
  const apiResponse = await weatherApiClient.fetchWeather(location);

  /**
   * @rule {fn-order-processing} Transform and cache the response
   */
  const temperatureData = transformApiResponse(apiResponse, location, unit);
  cacheService.set(location, unit, temperatureData);

  return temperatureData;
}

/**
 * @summary
 * Manually refreshes temperature data for a location.
 * Implements throttling to prevent excessive API calls.
 *
 * @function refreshTemperature
 *
 * @param {string} location - Location name
 * @param {TemperatureUnit} unit - Temperature unit
 *
 * @returns {Promise<TemperatureData>} Updated temperature data
 *
 * @throws {Error} When throttle limit exceeded or API request fails
 */
export async function refreshTemperature(
  location: string,
  unit: TemperatureUnit = 'celsius'
): Promise<TemperatureData> {
  /**
   * @validation Check throttle limit (30 seconds between manual refreshes)
   * @throw {THROTTLE_ERROR}
   */
  if (!throttleService.canRefresh(location)) {
    const error: any = new Error('Please wait 30 seconds before refreshing again');
    error.code = 'THROTTLE_ERROR';
    throw error;
  }

  /**
   * @rule {fn-order-processing} Fetch fresh data from external API
   */
  const apiResponse = await weatherApiClient.fetchWeather(location);

  /**
   * @rule {fn-order-processing} Transform, cache, and record refresh timestamp
   */
  const temperatureData = transformApiResponse(apiResponse, location, unit);
  cacheService.set(location, unit, temperatureData);
  throttleService.recordRefresh(location);

  return temperatureData;
}

/**
 * @summary
 * Transforms external API response to internal temperature data format.
 * Handles unit conversion and data formatting.
 *
 * @function transformApiResponse
 *
 * @param {WeatherApiResponse} apiResponse - External API response
 * @param {string} location - Location name
 * @param {TemperatureUnit} unit - Desired temperature unit
 *
 * @returns {TemperatureData} Formatted temperature data
 */
function transformApiResponse(
  apiResponse: WeatherApiResponse,
  location: string,
  unit: TemperatureUnit
): TemperatureData {
  const tempCelsius = apiResponse.current.temp_c;
  const temperature = unit === 'fahrenheit' ? celsiusToFahrenheit(tempCelsius) : tempCelsius;

  return {
    temperature: parseFloat(temperature.toFixed(1)),
    unit: unit === 'fahrenheit' ? '°F' : '°C',
    location: `${apiResponse.location.name}, ${apiResponse.location.country}`,
    lastUpdate: new Date().toISOString(),
    status: 'online',
  };
}

/**
 * @summary
 * Converts temperature from Celsius to Fahrenheit.
 *
 * @function celsiusToFahrenheit
 *
 * @param {number} celsius - Temperature in Celsius
 *
 * @returns {number} Temperature in Fahrenheit
 */
function celsiusToFahrenheit(celsius: number): number {
  return (celsius * 9) / 5 + 32;
}

export const weatherService = {
  getCurrentTemperature,
  refreshTemperature,
};
