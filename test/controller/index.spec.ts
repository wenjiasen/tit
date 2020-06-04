import { TitController, Controller, Router, HttpMethod, PServer, PBody, PBodyRootArray } from '../../src';
import { IndexServer } from '../server/index.spec';
import Joi from '@hapi/joi';

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
  public async getPath(): Promise<void> {
    const { ctx } = this;
    ctx.body = `${ctx.method} ${ctx.path}`;
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

  @Router({
    path: '/create',
    method: HttpMethod.POST,
  })
  public async create(@PBodyRootArray(Joi.array().required()) body: string[]): Promise<void> {
    const { ctx } = this;
    ctx.body = body;
  }

  @Router({
    path: '/create/user',
    method: HttpMethod.POST,
  })
  public async createUser(
    @PBody({
      name: Joi.string().required(),
    })
    body: {
      name: string;
    },
  ): Promise<void> {
    const { ctx } = this;
    ctx.body = body;
  }
}
