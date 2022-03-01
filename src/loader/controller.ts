import path from 'path';
import fs from 'fs';
import { Application } from '..';
import { getMainDir, newModule, walkDirectory } from './util';
import { IController } from '../controller';

export class ControllerLoader {
  private getFiles(rootPath: string): string[] {
    const files = walkDirectory(rootPath).filter((file) => {
      return !/(\.d.ts|\.map)$/.test(file);
    });
    return [...new Set(files)];
  }

  public async load(app: Application): Promise<void> {
    const rootPath = path.resolve(getMainDir(), './controller');

    if (!fs.existsSync(rootPath)) {
      // app.logger.warn(`Not exists controller directory '${rootPath}'`);
      return;
    }
    const files = this.getFiles(rootPath);
    const controllers = new Map<string, IController>();
    for (const controllerPath of files) {
      const modulePath = `${controllerPath}`;
      const mod = newModule<IController>(modulePath, app);
      const name = path.relative(rootPath, controllerPath);
      controllers.set(name, mod);
      app._controllers.push({
        name,
        module: mod,
      });
    }
    app.logger.debug('Router load complete', ...controllers.keys());
  }
}
