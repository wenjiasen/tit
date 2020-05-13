import { TitController, Controller, Router, HttpMethod, PServer } from '../../src';
import { IndexServer } from '../server/index.spec';

@Controller({
  prefix: '/test',
})
export class IndexController extends TitController {
  @Router({ path: '/', method: HttpMethod.GET })
  public async hello(): Promise<void> {
    const { ctx } = this;
    ctx.body = `Hello, TIT! `;
  }

  @Router({ path: '/path', method: HttpMethod.GET })
  public async getPath(@PServer(IndexServer) indexServer: IndexServer): Promise<void> {
    const { ctx } = this;
    const path = await indexServer.getContext();
    ctx.body = `${ctx.method} ${path}`;
  }

  @Router({
    path: '/config',
    method: HttpMethod.GET,
  })
  public async getConfig(@PServer(IndexServer) indexServer: IndexServer): Promise<void> {
    const { ctx } = this;
    const config = await indexServer.getConfig();
    ctx.body = config;
  }
}
