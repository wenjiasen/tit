import path from 'path';
import { IConfig } from '..';
import { getSourceRoot } from './util';
import fs from 'fs';

export class ConfigLoader {
  private readonly defaultConfig: IConfig = { port: 80, log: { level: 'info' } };

  public async load(): Promise<IConfig> {
    const rootPath = path.resolve(getSourceRoot(), './config');
    if (!fs.existsSync(rootPath)) {
      return this.defaultConfig;
    }
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const data = await require(rootPath);
    return Object.assign(this.defaultConfig, data);
  }
}
