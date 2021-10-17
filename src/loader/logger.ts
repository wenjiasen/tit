import path from 'path';
import fs from 'fs';
import { Application } from '../application';
import { ILogger } from '../interface/logger.interface';
import { getMainDir, newModule } from './util';

export class LoggerLoader {
  public readonly root: string | undefined;

  public load(app: Application): ILogger {
    const rootPath = path.resolve(getMainDir(), './logger');
    if (!fs.existsSync(rootPath)) {
      // console.warn(`Not exists logger directory '${rootPath}'`);
      // default logger
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const mod = require('../logger');
      return new mod.default(app);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const mod = newModule<ILogger>(rootPath, app);
      return mod;
    }
  }
}
