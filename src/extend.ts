import { IApplication } from '.';

export interface IExtend {
  reduce: (app: IApplication) => void;
}
