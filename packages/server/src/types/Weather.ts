export type WeatherQuery = {
  lat: number;
  lon: number;
}

export type WeatherCondition = {
  id: number;
  name: string;
  description: string;
}

export type CurrentWeather = {
  temperature: number;
  feelsLike: number;
  humidity: number;
}

export type HourlyWeather = {
  temperature: number;
  feelsLike: number;
  humidity: number;
  precipitationChance: number;
}

export type DailyTemperature = {
  morning: number;
  day: number;
  evening: number;
  night: number;
  min: number;
  max: number;
}

export type DailyFeelsLikeTemperature = {
  morning: number;
  day: number;
  evening: number;
  night: number;
}

export type DailyWeather = {
  sunrise: number;
  sunset: number;
  temperature: DailyTemperature;
  feelsLike: DailyFeelsLikeTemperature;
  humidity: number;
  precipitationChance: number;
}

export type WeatherAlert = {
  sender: string;
  event: string;
  start: number;
  end: number;
  description: string;
}

export type Weather = {
  lat: number;
  lon: number;
  timezone: string;
  timezoneOffset: number;
  curent: CurrentWeather;
  hourly: HourlyWeather[];
  daily: DailyWeather[];
  alerts: WeatherAlert[];
}