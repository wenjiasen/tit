import appRootPath from 'app-root-path';
import path from 'path';
import { Application } from '..';
import fs from 'fs';
import { walkDirectory } from './util';
import { IExtend } from '../extend';

export class ExtendLoader {
  public readonly root: string;
  constructor(root?: string) {
    const rootPath = root || this.getRoot();
    this.root = rootPath;
  }

  private getRoot(): string {
    let controllerDir = './src/extend';
    if (process.env.NODE_ENV === 'production') {
      controllerDir = './dist/extend';
    }
    const DEFAULT_DIR = path.resolve(appRootPath.path, controllerDir);
    const CONFIG_DIR = process.env.TIT_EXTEND_DIR || DEFAULT_DIR;
    return CONFIG_DIR;
  }

  private getFiles(rootPath: string): string[] {
    const files = walkDirectory(rootPath).filter((file) => {
      return !/(\.d.ts|.map)$/.test(file);
    });

    return [...new Set(files)];
  }

  public async load(app: Application): Promise<void> {
    const rootPath = path.resolve(appRootPath.path, this.root);
    if (!fs.existsSync(rootPath)) {
      app.logger.warn(`Not exists controller directory '${rootPath}'`);
      return;
    }
    const files = this.getFiles(rootPath);
    const modules = new Map<string, IExtend>();
    for (const file of files) {
      const modulePath = `${file}`;
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const mod = require(modulePath);
      const name = path.relative(rootPath, modulePath);
      const instance: IExtend = new mod.default();
      instance.reduce(app);
      modules.set(name, instance);
    }
    app.logger.debug('all routers', modules.keys());
  }
}
