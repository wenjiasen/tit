import { isProductionModel } from './util/helper';
import { configureScope, captureMessage, captureException, Severity } from '@sentry/node';
class Logger {
  debug(...args: any): void {
    if (!isProductionModel()) {
      console.debug(args);
    }
  }

  info(msg: string): void {
    console.info(msg);
  }

  warn(msg: string): void {
    configureScope((scope) => {
      scope.setLevel(Severity.Warning);
      captureMessage(msg);
    });
  }

  error(err: Error): void {
    //TODO:
    console.error(err);
  }
}
const logger = new Logger();
export { logger as AnyLogger };
