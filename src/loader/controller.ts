import appRootPath from 'app-root-path';
import path from 'path';
import fs from 'fs';
import { IApplication } from '..';
import { TitLogger } from '../logger';
import { walkDirectory } from './util';
import { IController } from '../controller';
let controllerDir = './src/controller';
let ext = '.ts';
if (process.env.NODE_ENV === 'production') {
  controllerDir = './dist/controller';
  ext = '.js';
}
const DEFAULT_DIR = path.resolve(appRootPath.path, controllerDir);
const CONFIG_DIR = process.env.ANYAPI_CONTROLLER_DIR || DEFAULT_DIR;

export class ControllerLoader {
  public readonly root: string;
  constructor(root?: string) {
    this.root = root || CONFIG_DIR;
    if (!fs.existsSync(this.root)) {
      throw Error(`Not exists controller directory '${this.root}'`);
    }
  }

  public async load(app: IApplication): Promise<void> {
    const rootPath = path.resolve(appRootPath.path, this.root);
    const controllerPaths = walkDirectory(rootPath).filter((file) => {
      return path.extname(file).toLowerCase() === ext;
    });
    const controllers = new Map<string, IController>();
    for (const controllerPath of controllerPaths) {
      const modulePath = `${controllerPath}`;
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const mod = require(modulePath);
      const name = path.relative(rootPath, controllerPath);
      controllers.set(name, mod);
    }
    TitLogger.debug(controllers.keys());
  }
}
