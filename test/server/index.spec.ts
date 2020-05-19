import { TitServer, IConfig } from '../../src';

export class IndexServer extends TitServer {
  public async getContext(): Promise<string> {
    return this.ctx.path;
  }
  public async getConfig(): Promise<IConfig> {
    return this.ctx.app.config;
  }
}
