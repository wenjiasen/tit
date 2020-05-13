import { Application } from '.';

export interface IExtend {
  reduce: (app: Application) => void;
}
