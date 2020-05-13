import appRootPath from 'app-root-path';
import path from 'path';
import fs from 'fs';
import { Application } from '..';
import { TitLogger } from '../logger';
import { walkDirectory } from './util';
import { IController } from '../controller';

export class ControllerLoader {
  public readonly root: string;
  constructor(root?: string) {
    const rootPath = root || this.getRoot();
    this.root = rootPath;
  }

  private getRoot(): string {
    let controllerDir = './src/controller';

    if (process.env.NODE_ENV === 'production') {
      controllerDir = './dist/controller';
    }
    const DEFAULT_DIR = path.resolve(appRootPath.path, controllerDir);
    const CONFIG_DIR = process.env.TIT_CONTROLLER_DIR || DEFAULT_DIR;
    return CONFIG_DIR;
  }

  private getFiles(rootPath: string): string[] {
    const files = walkDirectory(rootPath).filter((file) => {
      return !/(.d.ts|.map)$/.test(file);
    });
    return [...new Set(files)];
  }

  public async load(app: Application): Promise<void> {
    const rootPath = path.resolve(appRootPath.path, this.root);
    if (!fs.existsSync(rootPath)) {
      TitLogger.warn(`Not exists controller directory '${rootPath}'`);
      return;
    }
    const files = this.getFiles(rootPath);
    const controllers = new Map<string, IController>();
    for (const controllerPath of files) {
      const modulePath = `${controllerPath}`;
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const mod = require(modulePath);
      const name = path.relative(rootPath, controllerPath);
      controllers.set(name, mod);
    }
    TitLogger.debug(...controllers.keys());
  }
}
