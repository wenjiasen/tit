import { WenContext } from './context';
import { IWenApplication } from './application';

export class WenController {
  protected readonly ctx!: WenContext;
  protected readonly app!: IWenApplication;
}
