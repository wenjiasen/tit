import { IApplication } from '.';
import { IRouterContext } from 'koa-router';
import createHttpError from 'http-errors';
export interface IContext {
  readonly _ctx: IRouterContext;
  readonly app: IApplication;
}
export class Context implements IContext {
  public readonly _ctx: IRouterContext;
  public readonly app: IApplication;
  //TODO:此处需要修改为不依赖koa-router 的 ctx
  constructor(ctx: IRouterContext) {
    this._ctx = ctx;
    this.app = (global.__app__ as unknown) as IApplication;
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
