import assert from 'assert';
import Joi from 'joi';
import { HttpMethod, PCtx, Router } from '../../../src';
class LikeController {
  public ctx: {
    body?: string;
  } = {};

  @Router({
    method: HttpMethod.POST,
    path: '',
  })
  public async print(@PCtx(Joi.string()) name: string) {
    this.ctx.body = name + 'test';
  }
}

test('test PCtx', async () => {
  const controller = new LikeController();
  const ctx: Record<string, unknown> = { name: 'a' };
  await (controller.print as Function).call({}, ctx);
  assert(ctx.body == ctx.name + 'test');
});
