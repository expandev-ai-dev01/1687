/**
 * @summary
 * Type definitions for weather service.
 *
 * @module services/weather/weatherTypes
 */

/**
 * @interface TemperatureData
 * @description Temperature data returned to clients
 *
 * @property {number} temperature - Temperature value with one decimal place
 * @property {string} unit - Temperature unit symbol (°C or °F)
 * @property {string} location - Location name (city, country)
 * @property {string} lastUpdate - ISO timestamp of last update
 * @property {string} status - Connection status (online, offline, outdated)
 */
export interface TemperatureData {
  temperature: number;
  unit: string;
  location: string;
  lastUpdate: string;
  status: 'online' | 'offline' | 'outdated';
}

/**
 * @type TemperatureUnit
 * @description Supported temperature units
 */
export type TemperatureUnit = 'celsius' | 'fahrenheit';

/**
 * @interface WeatherApiResponse
 * @description External weather API response structure
 *
 * @property {object} location - Location information
 * @property {object} current - Current weather data
 */
export interface WeatherApiResponse {
  location: {
    name: string;
    region: string;
    country: string;
    lat: number;
    lon: number;
    tz_id: string;
    localtime_epoch: number;
    localtime: string;
  };
  current: {
    last_updated_epoch: number;
    last_updated: string;
    temp_c: number;
    temp_f: number;
    is_day: number;
    condition: {
      text: string;
      icon: string;
      code: number;
    };
    wind_mph: number;
    wind_kph: number;
    wind_degree: number;
    wind_dir: string;
    pressure_mb: number;
    pressure_in: number;
    precip_mm: number;
    precip_in: number;
    humidity: number;
    cloud: number;
    feelslike_c: number;
    feelslike_f: number;
    vis_km: number;
    vis_miles: number;
    uv: number;
    gust_mph: number;
    gust_kph: number;
  };
}
