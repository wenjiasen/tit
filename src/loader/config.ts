import appRootPath from 'app-root-path';
import path from 'path';

export class ConfigLoader {
  public readonly root: string;
  private readonly defaultConfig: TitTypes.IConfig = { port: 80 };
  constructor(root?: string) {
    this.root = root || this.getRoot();
  }

  private getRoot(): string {
    const DEFAULT_DIR = path.resolve(appRootPath.path, `./config`);
    const CONFIG_DIR = process.env.TIT_CONFIG_DIR || DEFAULT_DIR;
    return CONFIG_DIR;
  }

  public async load(): Promise<TitTypes.IConfig> {
    const filePath = path.resolve(appRootPath.path, `${this.root}`);
    const data = await require(filePath);
    return Object.assign(this.defaultConfig, data);
  }
}
