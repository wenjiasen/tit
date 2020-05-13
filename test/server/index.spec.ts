import { TitServer } from '../../src';

export class IndexServer extends TitServer {
  public async getContext(): Promise<string> {
    return this.ctx.path;
  }
  public async getConfig(): Promise<TitTypes.IConfig> {
    return this.ctx.app.config;
  }
}
