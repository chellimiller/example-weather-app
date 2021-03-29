import { WeatherApiConfig } from '../types';
import sendFetchRequest, { FetchResult } from './sendFetchRequest';

/**
 * Get the weather for a city.
 *
 * @param city City to get the weather for.
 * @param config Weather API configuration
 * @todo #6 Support city, state, and country.
 * @todo #6 Extract actual type instead of returning a plain `FetchResult`
 * @returns Promise with the result from requesting the weather for a city.
 */
export default function getWeatherByCity(city: string, config: WeatherApiConfig): Promise<FetchResult> {
  return sendFetchRequest(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${config.key}`);
}