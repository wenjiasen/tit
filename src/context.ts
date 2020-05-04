import { IAnyApplication } from '.';
import { IRouterContext } from 'koa-router';
import createHttpError from 'http-errors';
export class AnyContext {
  public readonly _ctx: IRouterContext;
  public readonly app: IAnyApplication;
  constructor(ctx: IRouterContext) {
    this._ctx = ctx;
    this.app = (global.__app__ as unknown) as IAnyApplication;
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
