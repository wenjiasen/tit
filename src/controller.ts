import { Context } from './context';
import { IApplication } from './application';

export interface IController {
  readonly ctx: Context;
  readonly app: IApplication;
}
