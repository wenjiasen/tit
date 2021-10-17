import path from 'path';
import { Application } from '..';
import fs from 'fs';
import { getMainDir, newModule, walkDirectory } from './util';
import { IExtend } from '../extend';

export class ExtendLoader {
  private getFiles(rootPath: string): string[] {
    const files = walkDirectory(rootPath).filter((file) => {
      return !/(\.d.ts|\.map)$/.test(file);
    });

    return [...new Set(files)];
  }

  public async load(app: Application): Promise<void> {
    const rootPath = path.resolve(getMainDir(), './extend');
    if (!fs.existsSync(rootPath)) {
      // app.logger.warn(`Not exists extend directory '${rootPath}'`);
      return;
    }
    const files = this.getFiles(rootPath);
    const modules = new Map<string, IExtend>();
    for (const file of files) {
      const modulePath = `${file}`;
      const mod = newModule<IExtend>(modulePath, app);
      const name = path.relative(rootPath, modulePath);
      mod.reduce(app);
      modules.set(name, mod);
      app._extends.push({
        name,
        module: mod,
      });
    }
    app.logger.debug('all extends', modules.keys());
  }
}
