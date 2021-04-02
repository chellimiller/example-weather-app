import { ObjectValidationError, Result, ServerErrorCode } from '../../../types';
import { OneCallWeather } from './types';
import validateOneCallCurrentWeather from './validateOneCallCurrentWeather';
import validateOneCallDailyWeather from './validateOneCallDailyWeather';
import validateOneCallHourlyWeather from './validateOneCallHourlyWeather';

export default function validateOneCallWeather(unvalidated: object): Result<OneCallWeather, ObjectValidationError> {

  const createInvalidTypeResult = (property: keyof OneCallWeather, expectedType: string) => ({
    error: {
      code: ServerErrorCode.VALIDATION_003,
      data: {
        message: `'data.${property}' is expected have type '${expectedType}'`,
        value: unvalidated,
      }
    }
  });

  const {
    lat,
    lon,
    timezone,
    timezone_offset,
    current,
    hourly = [],
    daily = [],
    alerts = [],
  }: OneCallWeather = unvalidated as OneCallWeather;

  if (typeof lat !== 'number') createInvalidTypeResult('lat', 'number');
  if (typeof lon !== 'number') createInvalidTypeResult('lon', 'number');
  if (typeof timezone !== 'string') createInvalidTypeResult('timezone', 'string');
  if (typeof timezone_offset !== 'number') createInvalidTypeResult('timezone_offset', 'number');
  if (typeof current !== 'object') createInvalidTypeResult('current', 'object');

  // Kind of weird that we're passing in 'array' since it's not typeof, but it's good enough for now
  if (!Array.isArray(hourly)) createInvalidTypeResult('hourly', 'array');
  if (!Array.isArray(daily)) createInvalidTypeResult('daily', 'array');
  if (!Array.isArray(alerts)) createInvalidTypeResult('alerts', 'array');

  const validateCurrentResult = validateOneCallCurrentWeather(current);
  if (validateCurrentResult.error) return validateCurrentResult;

  for (let i = 0; i < hourly.length; i++) {
    const validateHourlyResult = validateOneCallHourlyWeather(hourly[i], i);
    if (validateHourlyResult.error) return validateHourlyResult;
  }

  for (let i = 0; i < daily.length; i++) {
    const validateDailyResult = validateOneCallDailyWeather(daily[i], i);
    if (validateDailyResult.error) return validateDailyResult;
  }

  for (let i = 0; i < alerts.length; i++) {
    const validateAlertResult = validateOneCallDailyWeather(alerts[i], i);
    if (validateAlertResult.error) return validateAlertResult;
  }

  const data = {
    lat,
    lon,
    timezone,
    timezone_offset,
    current,
    hourly,
    daily,
    alerts,
  };

  return { data };
}