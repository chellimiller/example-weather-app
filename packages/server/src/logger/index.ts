import { ServerErrorCode } from "../types";

const createLogMessage = (type: string, loggerName: string, message: string) => `${type} ${loggerName}: ${message}`;

class Logger {
  constructor(private loggerName: string) { }

  debug(message: string, ...optionalParams: any[]) {
    console.debug(createLogMessage('DEBUG', this.loggerName, message), ...optionalParams);
  }

  info(message: string, ...optionalParams: any[]) {
    console.info(createLogMessage('INFO', this.loggerName, message), ...optionalParams);
  }

  log(message: string, ...optionalParams: any[]) {
    console.log(createLogMessage('LOG', this.loggerName, message), ...optionalParams);
  }

  error(code: ServerErrorCode, message: string, ...optionalParams: any[]) {
    console.error(createLogMessage('ERROR', this.loggerName, `${code} - ${message}`), ...optionalParams);
  }

  warn(message: string, ...optionalParams: any[]) {
    console.warn(createLogMessage('WARN', this.loggerName, message), ...optionalParams);
  }

  trace(message: string, ...optionalParams: any[]) {
    console.trace(createLogMessage('TRACE', this.loggerName, message), ...optionalParams);
  }
}

export default function createLogger(loggerName: string = 'Server'): Logger {
  return new Logger(loggerName);
};