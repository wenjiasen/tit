import { AnyContext } from './context';
import { IAnyApplication } from './application';

export class AnyController {
  protected readonly ctx!: AnyContext;
  protected readonly app!: IAnyApplication;
}
