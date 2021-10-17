import path from 'path';
import { IConfig } from '..';
import { getMainDir } from './util';
import fs from 'fs';

export class ConfigLoader {
  private readonly defaultConfig: IConfig = { port: 80 };

  public async load(): Promise<IConfig> {
    const rootPath = path.resolve(getMainDir(), './config');
    if (!fs.existsSync(rootPath)) {
      // console.warn(`Not exists controller directory '${rootPath}'`);
      return this.defaultConfig;
    }
    const data = await require(rootPath);
    return Object.assign(this.defaultConfig, data);
  }
}
