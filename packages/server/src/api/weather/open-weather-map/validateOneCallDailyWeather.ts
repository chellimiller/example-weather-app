import { ObjectValidationError, Result, ServerErrorCode } from '../../../types';
import { OneCallDailyWeather } from './types';
import validateOneCallWeatherCondition from './validateOneCallWeatherCondition';

export default function validateOneCallDailyWeather(unvalidated: object, index: number): Result<OneCallDailyWeather, ObjectValidationError> {

  const createInvalidTypeResult = (property: string, expectedType: string) => ({
    error: {
      code: ServerErrorCode.VALIDATION_003,
      data: {
        message: `'data.daily[${index}].${property}' is expected have type '${expectedType}'`,
        value: unvalidated,
      },
    }
  });

  const data: OneCallDailyWeather = unvalidated as OneCallDailyWeather;

  if (typeof data.sunrise !== 'number') createInvalidTypeResult('sunrise', 'number');
  if (typeof data.sunset !== 'number') createInvalidTypeResult('sunset', 'number');
  if (typeof data.pop !== 'number') createInvalidTypeResult('pop', 'number');
  if (typeof data.humidity !== 'number') createInvalidTypeResult('humidity', 'number');

  if (typeof data.temp !== 'object') createInvalidTypeResult('temp', 'object');
  if (typeof data.temp.morn !== 'number') createInvalidTypeResult('temp.morn', 'number');
  if (typeof data.temp.day !== 'number') createInvalidTypeResult('temp.day', 'number');
  if (typeof data.temp.eve !== 'number') createInvalidTypeResult('temp.eve', 'number');
  if (typeof data.temp.night !== 'number') createInvalidTypeResult('temp.night', 'number');
  if (typeof data.temp.min !== 'number') createInvalidTypeResult('temp.min', 'number');
  if (typeof data.temp.max !== 'number') createInvalidTypeResult('temp.max', 'number');

  if (typeof data.feels_like !== 'object') createInvalidTypeResult('feels_like', 'object');
  if (typeof data.feels_like.morn !== 'number') createInvalidTypeResult('feels_like.morn', 'number');
  if (typeof data.feels_like.day !== 'number') createInvalidTypeResult('feels_like.day', 'number');
  if (typeof data.feels_like.eve !== 'number') createInvalidTypeResult('feels_like.eve', 'number');
  if (typeof data.feels_like.night !== 'number') createInvalidTypeResult('feels_like.night', 'number');

  // Kind of weird that we're passing in 'array' since it's not typeof, but it's good enough for now
  if (!Array.isArray(data.weather)) createInvalidTypeResult('weather', 'array');

  // There is definitely a faster way to do this so we don't keep going if we get a bad result.
  // However, the array is pretty small usually anyway so it's not a big deal.
  // Below is probably more readable.
  const badConditionResult = data.weather
    .map((condition, index) => validateOneCallWeatherCondition(condition, `data.current.weather[${index}]`))
    .find(result => !!result.error);

  if (badConditionResult && badConditionResult.error) return badConditionResult;

  return { data };
}