import { Location, LocationType, ResultStatus, Weather, WeatherApiConfig, WeatherCondition } from '../types';
import sendFetchRequest, { FetchResult } from './sendFetchRequest';

function buildUrl(location: Location, config: WeatherApiConfig): string {
  switch (location.type) {
    case LocationType.CITY_NAME:
      return `https://api.openweathermap.org/data/2.5/weather?q=${[location.city, location.stateCode, location.countryCode].filter(value => !!value).join(',')}&appid=${config.key}`;
    case LocationType.POSTAL_CODE:
      return `https://api.openweathermap.org/data/2.5/weather?zip=${[location.code, location.countryCode].filter(value => !!value).join(',')}&appid=${config.key}`;
    default:
      return '';
  }
}

type OpenWeatherMapData = {
  coord: {
    lat: number;
    lon: number;
  },
  weather: WeatherCondition[],
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  },
  visibility: number,
  wind: {
    speed: number;
    deg: number;
    gust?: number;
  },
  clouds: {
    all: number;
  }
  dt: number;
  timezone: number;
  id: number;
  name: string;
  rain?: Record<'1h' | '3h', number>;
  snow?: Record<'1h' | '3h', number>;
};

function mapData(data: OpenWeatherMapData): Weather {
  const { coord, dt, id, name, timezone, weather, main, visibility, clouds, wind, snow, rain } = data;
  return {
    coordinates: {
      latitude: coord.lat,
      longitude: coord.lon,
    },
    timestamp: dt,
    id,
    name,
    timezone,
    snow,
    rain,
    conditions: weather,
    cloudCover: clouds,
    visibility,
    wind: {
      speed: wind.speed,
      gust: wind.gust,
      direction: wind.deg,
    },
    temperature: {
      main: main.temp,
      feelsLike: main.feels_like,
      min: main.temp_min,
      max: main.temp_max,
      pressure: main.pressure,
      humidity: main.humidity,
    }
  }
}

/**
 * Get the weather for a location.
 *
 * @param location Location to get the weather for.
 * @param config Weather API configuration
 * @returns Promise with the result from requesting the weather for a city.
 */
export default function getCurrentWeather(location: Location, config: WeatherApiConfig): Promise<FetchResult<Weather>> {
  const url = buildUrl(location, config);

  // @todo #6 Fix this
  if (!url) return Promise.reject();

  return sendFetchRequest(url).then(
    (result: FetchResult<Response>) => {
      if (result.status === ResultStatus.DATA_LOAD) {
        return result.data.json().then(
          (data) => ({
            status: ResultStatus.DATA_LOAD,
            message: 'Successfully accessed Weather API configuration',
            data: mapData(data),
          }),

          // @todo #5 Figure out why this needs to be casted as any.
          (error) => ({
            status: ResultStatus.ERROR,
            message: 'Cannot parse Weather API configuration',
            error,
          } as any),
        )
      }

      return result;
    }
  );
}