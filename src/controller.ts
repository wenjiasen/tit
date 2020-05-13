import { Application } from './application';
import { Context } from 'koa';
export interface IController {
  readonly ctx: Context;
  readonly app: Application;
}

export class TitController implements IController {
  readonly ctx!: Context;
  readonly app!: Application;
}
