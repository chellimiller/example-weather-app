import { ObjectValidationError, Result, ServerErrorCode } from '../../../types';
import { OneCallWeatherAlert } from './types';

export default function validateOneCallWeatherAlert(unvalidated: object, index: number): Result<OneCallWeatherAlert, ObjectValidationError> {

  const createInvalidTypeResult = (property: keyof OneCallWeatherAlert, expectedType: string) => ({
    error: {
      code: ServerErrorCode.VALIDATION_003,
      data: {
        message: `'data.alerts[${index}].${property}' is expected have type '${expectedType}'`,
        value: unvalidated,
      },
    }
  });

  const data: OneCallWeatherAlert = unvalidated as OneCallWeatherAlert;

  if (typeof data.sender_name !== 'string') createInvalidTypeResult('sender_name', 'string');
  if (typeof data.event !== 'string') createInvalidTypeResult('event', 'string');
  if (typeof data.start !== 'number') createInvalidTypeResult('start', 'number');
  if (typeof data.end !== 'number') createInvalidTypeResult('end', 'number');
  if (typeof data.description !== 'string') createInvalidTypeResult('description', 'string');

  return { data };
}