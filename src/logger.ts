import { ILogger } from './interface/logger.interface';
import { isProductionModel } from './util/helper';
export default class Logger implements ILogger {
  debug(msg: string): void {
    if (!isProductionModel()) {
      console.debug(msg);
    }
  }

  info(msg: string): void {
    console.info(msg);
  }

  warn(msg: string): void {
    console.warn(msg);
  }

  error(err: Error): void {
    console.error(err);
  }
}
