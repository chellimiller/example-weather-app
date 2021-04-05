import { ServerErrorCode } from '../types';

const createLogMessage = (type: string, loggerName: string, message: string) => `${type} ${loggerName}: ${message}`;

class Logger {
  constructor(private loggerName: string) { }

  debug(message: string, ...optionalParams: any[]) {
    console.debug(createLogMessage('DEBUG', this.loggerName, message), ...optionalParams);
  }

  error(code: ServerErrorCode, message: string, ...optionalParams: any[]) {
    console.error(createLogMessage('ERROR', this.loggerName, `${code} - ${message}`), ...optionalParams);
  }
}

export default function createLogger(loggerName: string = 'Server'): Logger {
  return new Logger(loggerName);
};