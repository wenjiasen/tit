import { Context } from 'koa';

export interface IServer {
  readonly ctx: Context;
}

export class TitServer implements IServer {
  constructor(readonly ctx: Context) {}
}
