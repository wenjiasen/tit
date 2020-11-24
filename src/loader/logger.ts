import appRootPath from 'app-root-path';
import path from 'path';
import { Application } from '../application';
import { ILogger } from '../interface/logger.interface';

export class LoggerLoader {
  public readonly root: string;
  constructor(root?: string) {
    const rootPath = root || this.getRoot();
    this.root = rootPath;
  }

  private getRoot(): string {
    let controllerDir = './src/logger';
    if (process.env.NODE_ENV === 'production') {
      controllerDir = './dist/logger';
    }
    const DEFAULT_DIR = path.resolve(appRootPath.path, controllerDir);
    const CONFIG_DIR = process.env.TIT_LOGGER_CLASS || DEFAULT_DIR;
    return CONFIG_DIR;
  }

  public load(app: Application): ILogger {
    const filePath = path.resolve(appRootPath.path, this.root);
    const mod = module.require(filePath);
    if (mod.__esModule) {
      return new mod.default(app);
    }
    if (mod.constructor) return new mod(app);
    throw Error(`Invalid Logger: ${filePath}`);
  }
}
