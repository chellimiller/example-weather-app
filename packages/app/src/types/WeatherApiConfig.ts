export enum WeatherApiConfigType {
  OPEN_WEATHER_MAP = 'openweathermap.org',
}

export type WeatherApiConfig = {
  type: WeatherApiConfigType;
  key: string;
}