import { IContext } from './context';
import { IApplication } from './application';

export interface IController {
  readonly ctx: IContext;
  readonly app: IApplication;
}

export class TitController implements IController {
  readonly ctx!: IContext;
  readonly app!: IApplication;
}
