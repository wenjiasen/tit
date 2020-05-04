import { isProductionModel } from './util/helper';
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
    console.warn(msg);
  }

  error(err: Error): void {
    console.error(err);
  }
}
//TODO：支持由外部项目配置如何处理日志
const logger = new Logger();
export { logger as WenLogger };
