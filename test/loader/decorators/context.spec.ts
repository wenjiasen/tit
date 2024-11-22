import assert from 'assert';
import Joi from 'joi';
import { HttpMethod, PContext, Router } from '../../../src';

import { test } from '@jest/globals';

class LikeController {
  public ctx: {
    body?: string;
  } = {};

  @Router({
    method: HttpMethod.POST,
    path: '',
  })
  public async print(@PContext(Joi.string()) name: string) {
    this.ctx.body = name + 'test';
  }
}

test('test PCtx', async () => {
  const controller = new LikeController();
  const ctx: Record<string, unknown> = { name: 'a' };
  await (controller.print as Function).call({}, ctx);
  assert(ctx.body == ctx.name + 'test');
});
