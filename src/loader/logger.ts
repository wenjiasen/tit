import appRootPath from 'app-root-path';
import path from 'path';
import { Application } from '../application';
import { ILogger } from '../interface/logger.interface';

export class LoggerLoader {
  public readonly root: string | undefined;
  constructor(root?: string) {
    this.root = process.env.TIT_LOGGER_CLASS || root;
  }

  public load(app: Application): ILogger {
    let mod;
    if (this.root) {
      const filePath = path.resolve(appRootPath.path, this.root);
      mod = module.require(filePath);
      if (mod.__esModule) {
        return new mod.default(app);
      }
      if (mod.constructor) return new mod(app);
      throw Error(`Invalid Logger: ${process.env.TIT_LOGGER_CLASS}`);
    } else {
      // default logger
      mod = require('../logger');
      return new mod.default(app);
    }
  }
}
