export type Coordinates = {
  latitude: number;
  longitude: number;
}

export type WeatherCondition = {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export type WeatherTemperature = {
  main: number;
  feelsLike: number;
  min: number;
  max: number;
  pressure: number;
  humidity: number;
}

export type WeatherWind = {
  speed: number;
  direction: number;
  gust?: number;
}

export type WeatherCloudCover = {
  all: number;
}

export type Precipitation = Record<'1h' | '3h', number>;

export type Weather = {
  cloudCover: WeatherCloudCover;
  conditions: WeatherCondition[];
  coordinates: Coordinates;
  id: number;
  name: string;
  rain?: Precipitation;
  snow?: Precipitation;
  temperature: WeatherTemperature;
  timestamp: number;
  timezone: number;
  visibility: number;
  wind: WeatherWind;
}