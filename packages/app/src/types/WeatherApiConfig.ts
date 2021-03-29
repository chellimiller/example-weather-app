/**
 * Type of Weather API that is supported.
 */
export enum WeatherApiConfigType {
  OPEN_WEATHER_MAP = 'openweathermap.org',
}

/**
 * Weather API configuration that includes the API being accessed and the API key.
 */
export type WeatherApiConfig = {

  /** API being accessed. */
  type: WeatherApiConfigType;

  /** Unique key used to access the API. */
  key: string;
}