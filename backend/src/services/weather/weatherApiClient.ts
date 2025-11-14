/**
 * @summary
 * External weather API client.
 * Handles HTTP requests to the weather data provider.
 *
 * @module services/weather/weatherApiClient
 */

import { config } from '@/config';
import { WeatherApiResponse } from '@/services/weather/weatherTypes';

/**
 * @summary
 * Fetches weather data from external API.
 *
 * @function fetchWeather
 *
 * @param {string} location - Location name
 *
 * @returns {Promise<WeatherApiResponse>} Weather API response
 *
 * @throws {Error} When API request fails or returns invalid data
 */
export async function fetchWeather(location: string): Promise<WeatherApiResponse> {
  /**
   * @validation Verify API key is configured
   * @throw {WEATHER_API_ERROR}
   */
  if (!config.weather.apiKey) {
    const error: any = new Error('Weather API key not configured');
    error.code = 'WEATHER_API_ERROR';
    throw error;
  }

  const url = `${config.weather.apiUrl}/current.json?key=${
    config.weather.apiKey
  }&q=${encodeURIComponent(location)}&aqi=no`;

  try {
    /**
     * @rule {fn-order-processing} Execute HTTP request with 5 second timeout
     */
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    clearTimeout(timeoutId);

    /**
     * @validation Verify API response status
     * @throw {WEATHER_API_ERROR}
     */
    if (!response.ok) {
      const error: any = new Error(`Weather API error: ${response.statusText}`);
      error.code = 'WEATHER_API_ERROR';
      throw error;
    }

    const data = await response.json();

    /**
     * @validation Verify temperature data is within plausible range (-90°C to +60°C)
     * @throw {WEATHER_API_ERROR}
     */
    if (data.current.temp_c < -90 || data.current.temp_c > 60) {
      const error: any = new Error('Temperature data outside plausible range');
      error.code = 'WEATHER_API_ERROR';
      throw error;
    }

    return data;
  } catch (error: any) {
    if (error.name === 'AbortError') {
      const timeoutError: any = new Error('Weather API request timeout');
      timeoutError.code = 'WEATHER_API_ERROR';
      throw timeoutError;
    }
    if (error.code === 'WEATHER_API_ERROR') {
      throw error;
    }
    const apiError: any = new Error('Failed to fetch weather data');
    apiError.code = 'WEATHER_API_ERROR';
    throw apiError;
  }
}

export const weatherApiClient = {
  fetchWeather,
};
