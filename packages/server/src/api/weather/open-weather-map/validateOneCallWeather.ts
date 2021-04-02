import { ObjectValidationError, Result, ServerErrorCode } from '../../../types';
import { OneCallWeather } from './types';
import validateOneCallCurrentWeather from './validateOneCallCurrentWeather';
import validateOneCallDailyWeather from './validateOneCallDailyWeather';
import validateOneCallHourlyWeather from './validateOneCallHourlyWeather';

export default function validateOneCallWeather(unvalidated: object): Result<OneCallWeather, ObjectValidationError> {

  const data: OneCallWeather = unvalidated as OneCallWeather;

  const createInvalidTypeResult = (property: keyof OneCallWeather, expectedType: string) => ({
    error: {
      code: ServerErrorCode.VALIDATION_003,
      data: {
        message: `'data.${property}' is expected have type '${expectedType}'`,
        value: unvalidated,
      }
    }
  });

  if (typeof data.lat !== 'number') createInvalidTypeResult('lat', 'number');
  if (typeof data.lon !== 'number') createInvalidTypeResult('lon', 'number');
  if (typeof data.timezone !== 'string') createInvalidTypeResult('timezone', 'string');
  if (typeof data.timezone_offset !== 'number') createInvalidTypeResult('timezone_offset', 'number');
  if (typeof data.current !== 'object') createInvalidTypeResult('current', 'object');

  // Kind of weird that we're passing in 'array' since it's not typeof, but it's good enough for now
  if (!Array.isArray(data.hourly)) createInvalidTypeResult('hourly', 'array');
  if (!Array.isArray(data.daily)) createInvalidTypeResult('hourly', 'array');
  if (!Array.isArray(data.alerts)) createInvalidTypeResult('hourly', 'array');

  const validateCurrentResult = validateOneCallCurrentWeather(data.current);
  if (validateCurrentResult.error) return validateCurrentResult;

  for (let i = 0; i < data.hourly.length; i++) {
    const validateHourlyResult = validateOneCallHourlyWeather(data.hourly[i], i);
    if (validateHourlyResult.error) return validateHourlyResult;
  }

  for (let i = 0; i < data.daily.length; i++) {
    const validateDailyResult = validateOneCallDailyWeather(data.daily[i], i);
    if (validateDailyResult.error) return validateDailyResult;
  }

  for (let i = 0; i < data.alerts.length; i++) {
    const validateAlertResult = validateOneCallDailyWeather(data.alerts[i], i);
    if (validateAlertResult.error) return validateAlertResult;
  }

  return { data };
}