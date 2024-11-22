import assert from 'assert';
import Joi from 'joi';

import { test } from '@jest/globals';
import { HttpMethod, PFunction, Router } from '../../../src';
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
      kind: 'ctx',
      value: async (app, ctx) => {
        return Joi.number()
          .required()
          .external((value, helper) => {
            return value;
          });
      },
    })
    age: number,
  ) {
    this.ctx.body = parseInt(age.toString());
  }
}

test('test PFunction', async () => {
  const controller = new LikeController();
  const ctx: Record<string, unknown> = { age: 1.123 };
  await (controller.print as Function).call({}, ctx);
  assert(ctx.body === parseInt(ctx.age as any));
});

test('test PFunction failed', async () => {
  try {
    const controller = new LikeController();
    let errorCode = '';
    const ctx: Record<string, unknown> = {
      age: 'a',
      throw: (code: any) => {
        errorCode = code;
        throw code;
      },
    };
    await (controller.print as Function).call({}, ctx);
  } catch (error) {
    assert((error as any) == '400');
  }
});
