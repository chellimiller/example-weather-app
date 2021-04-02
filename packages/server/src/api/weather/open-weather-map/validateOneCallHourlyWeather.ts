import { ObjectValidationError, Result, ServerErrorCode } from '../../../types';
import { OneCallCurrentWeather, OneCallHourlyWeather } from './types';
import validateOneCallWeatherCondition from './validateOneCallWeatherCondition';

export default function validateOneCallHourlyWeather(unvalidated: object, index: number): Result<OneCallHourlyWeather, ObjectValidationError> {

  const createInvalidTypeResult = (property: keyof OneCallHourlyWeather, expectedType: string) => ({
    error: {
      code: ServerErrorCode.VALIDATION_003,
      data: {
        message: `'data.hourly[${index}].${property}' is expected have type '${expectedType}'`,
        value: unvalidated,
      },
    }
  });

  const data: OneCallHourlyWeather = unvalidated as OneCallHourlyWeather;

  if (typeof data.temp !== 'number') createInvalidTypeResult('temp', 'number');
  if (typeof data.feels_like !== 'number') createInvalidTypeResult('feels_like', 'number');
  if (typeof data.humidity !== 'number') createInvalidTypeResult('humidity', 'number');
  if (typeof data.pop !== 'number') createInvalidTypeResult('pop', 'number');

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