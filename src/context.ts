import { IWenApplication } from '.';
import { IRouterContext } from 'koa-router';
import createHttpError from 'http-errors';
export class WenContext {
  public readonly _ctx: IRouterContext;
  public readonly app: IWenApplication;
  //TODO:此处需要修改为不依赖koa-router 的 ctx
  constructor(ctx: IRouterContext) {
    this._ctx = ctx;
    this.app = (global.__app__ as unknown) as IWenApplication;
  }

  throw(...properties: Array<number | string | {}>): never {
    const httpError = createHttpError(...properties, { expose: true });
    throw httpError;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  success(body: any): void {
    this._ctx.body = body;
  }
}
