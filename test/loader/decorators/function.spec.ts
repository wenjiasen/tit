import assert from 'assert';
import Joi, { string } from 'joi';
import { HttpMethod, PContext, PFunction, Router } from '../../../src';
class LikeController {
  public ctx: {
    body?: any;
  } = {};

  @Router({
    method: HttpMethod.POST,
    path: '',
  })
  public async print(
    @PFunction<number>({
      schema: Joi.number().required(),
      value: async (app, ctx) => {
        return parseInt(ctx.age);
      },
    })
    age: number,
  ) {
    this.ctx.body = age;
  }
}

test('test PFunction', async () => {
  const controller = new LikeController();
  const ctx: Record<string, unknown> = { age: 1.123 };
  await (controller.print as Function).call({}, ctx);
  assert(ctx.body === parseInt(ctx.age as any));
});
