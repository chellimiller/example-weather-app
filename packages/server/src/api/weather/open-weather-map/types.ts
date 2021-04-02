
export type OneCallWeatherCondition = {
  id: number;
  main: string;
  description: string;
}

export type OneCallCurrentWeather = {
  temp: number;
  feels_like: number;
  humidity: number;
  weather: OneCallWeatherCondition[];
}

export type OneCallHourlyWeather = {
  temp: number;
  feels_like: number;
  humidity: number;
  pop: number;
  weather: OneCallWeatherCondition[];
}

export type OneCallDailyWeatherTemperature = {
  morn: number;
  day: number;
  eve: number;
  night: number;
  min: number;
  max: number;
}

export type OneCallDailyWeatherFeelsLike = {
  morn: number;
  day: number;
  eve: number;
  night: number;
}

export type OneCallDailyWeather = {
  sunrise: number;
  sunset: number;
  temp: OneCallDailyWeatherTemperature;
  feels_like: OneCallDailyWeatherFeelsLike;
  humidity: number;
  pop: number;
  weather: OneCallWeatherCondition[];
}

export type OneCallWeatherAlert = {
  sender_name: string;
  event: string;
  start: number;
  end: number;
  description: string;
}

export type OneCallWeather = {
  lat: number;
  lon: number;
  timezone: string;
  timezone_offset: number;
  current: OneCallCurrentWeather;
  hourly: OneCallHourlyWeather[];
  daily: OneCallDailyWeather[];
  alerts: OneCallWeatherAlert[];
};