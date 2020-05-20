import koa from 'koa';

export interface IServer {
  readonly app: koa;
}

export class TitServer implements IServer {
  constructor(readonly app: koa) {}
}
