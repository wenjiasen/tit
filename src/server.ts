import { Application } from './application';

export interface IServer {
  readonly app: Application;
}

export class TitServer implements IServer {
  constructor(readonly app: Application) {}
}
