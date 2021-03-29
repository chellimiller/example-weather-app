import { WeatherApiConfig } from '../types';
import sendFetchRequest, { FetchResult } from './sendFetchRequest';

export default function getWeatherByCity(city: string, config: WeatherApiConfig): Promise<FetchResult> {
  return sendFetchRequest(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${config.key}`);
}