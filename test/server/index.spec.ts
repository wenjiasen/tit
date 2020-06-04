import { TitServer, IConfig } from '../../src';

export class IndexServer extends TitServer {
  public async getConfig(): Promise<IConfig> {
    return this.app.config;
  }
}
 