import path from 'path';
import { IConfig } from '..';
import { getSourceRoot } from './util';
import fs from 'fs';

export class ConfigLoader {
  private readonly defaultConfig: IConfig = { port: 80 };

  public async load(): Promise<IConfig> {
    const rootPath = path.resolve(getSourceRoot(), './config');
    if (!fs.existsSync(rootPath)) {
      // console.warn(`Not exists controller directory '${rootPath}'`);
      return this.defaultConfig;
    }
    const data = await import(rootPath);
    return Object.assign(this.defaultConfig, data);
  }
}
