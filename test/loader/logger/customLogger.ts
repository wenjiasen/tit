import { ILogger } from '../../../src/interface/logger.interface';

export default class CustomLogger implements ILogger {
  debug(msg: string): void {
    console.log(`customLogger-${msg}`);
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
