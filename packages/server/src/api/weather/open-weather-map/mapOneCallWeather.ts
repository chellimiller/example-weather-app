import createLogger from '../../../logger';
import { CurrentWeather, DailyFeelsLikeTemperature, DailyTemperature, DailyWeather, HourlyWeather, ObjectValidationError, Result, Weather, WeatherAlert, WeatherCondition } from '../../../types';
import { OneCallCurrentWeather, OneCallDailyWeather, OneCallHourlyWeather, OneCallWeatherAlert, OneCallWeatherCondition } from './types';
import validateOneCallWeather from './validateOneCallWeather';

const log = createLogger('requestWeather');

function mapWeatherCondition(original: OneCallWeatherCondition): WeatherCondition {
  const {
    id,
    main: name,
    description,
  } = original;

  return { id, name, description };
}

function mapCurrentWeather(original: OneCallCurrentWeather): CurrentWeather {
  const {
    temp: temperature,
    feels_like: feelsLike,
    weather,
    humidity,
  } = original;

  return {
    temperature,
    feelsLike,
    conditions: weather.map(mapWeatherCondition),
    humidity,
  };
}

function mapHourlyWeather(original: OneCallHourlyWeather): HourlyWeather {
  const {
    temp: temperature,
    feels_like: feelsLike,
    weather,
    humidity,
    pop: precipitationChance,
  } = original;

  return {
    temperature,
    feelsLike,
    conditions: weather.map(mapWeatherCondition),
    humidity,
    precipitationChance,
  };
}

function mapDailyWeather(original: OneCallDailyWeather): DailyWeather {
  const {
    sunrise,
    sunset,
    temp,
    feels_like,
    weather,
    humidity,
    pop: precipitationChance,
  } = original;

  const temperature: DailyTemperature = {
    min: temp.min,
    max: temp.max,
    morning: temp.morn,
    day: temp.day,
    evening: temp.eve,
    night: temp.night,
  }

  const feelsLike: DailyFeelsLikeTemperature = {
    morning: feels_like.morn,
    day: feels_like.day,
    evening: feels_like.eve,
    night: feels_like.night,
  }

  return {
    sunrise,
    sunset,
    temperature,
    feelsLike,
    conditions: weather.map(mapWeatherCondition),
    humidity,
    precipitationChance,
  };
}

function mapWeatherAlert(original: OneCallWeatherAlert): WeatherAlert {
  const {
    sender_name: sender,
    event,
    start,
    end,
    description,
  } = original;

  return {
    sender,
    event,
    start,
    end,
    description,
  };
}

export default function mapOneCallWeather(unvalidated: object): Result<Weather, ObjectValidationError> {
  log.debug('Validating data');
  const validated = validateOneCallWeather(unvalidated);
  log.debug('Data validated');
  if (validated.error) return validated;

  log.debug('Mapping data');
  const {
    lat,
    lon,
    timezone,
    timezone_offset: timezoneOffset,
    current,
    hourly,
    daily,
    alerts,
  } = validated.data;

  const data: Weather = {
    lat,
    lon,
    timezone,
    timezoneOffset,
    current: mapCurrentWeather(current),
    hourly: hourly.map(mapHourlyWeather),
    daily: daily.map(mapDailyWeather),
    alerts: alerts.map(mapWeatherAlert),
  }

  log.debug('Data mapped');

  return { data };
}