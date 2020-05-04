import appRootPath from 'app-root-path';
import path from 'path';
import { IWenApplication } from '..';
import { WenLogger } from '../logger';
import { walkDirectory } from './util';
import { WenExtend } from '../extend';

let extendDir = './src/extend';
let ext = '.ts';
if (process.env.NODE_ENV === 'production') {
  extendDir = './dist/extend';
  ext = '.js';
}
const DEFAULT_DIR = path.resolve(appRootPath.path, extendDir);
const CONFIG_DIR = process.env.ANYAPI_EXTEND_DIR || DEFAULT_DIR;

export class ExtendLoader {
  public readonly root: string;
  constructor(root?: string) {
    this.root = root || CONFIG_DIR;
  }

  public async load(app: IWenApplication): Promise<void> {
    const rootPath = path.resolve(appRootPath.path, this.root);
    const files = walkDirectory(rootPath).filter((file) => {
      return path.extname(file).toLowerCase() === ext;
    });
    const modules = new Map<string, WenExtend>();
    for (const file of files) {
      const modulePath = `${file}`;
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const mod = require(modulePath);
      const name = path.relative(rootPath, modulePath);
      const instance: WenExtend = new mod.default();
      instance.reduce(app);
      modules.set(name, instance);
    }
    WenLogger.debug(modules.keys());
  }
}
