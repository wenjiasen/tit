import { IContext } from './context';

export interface IServer {
  readonly ctx: IContext;
}

export class TitServer implements IServer {
  constructor(readonly ctx: IContext) {}
}
