import { IAnyApplication } from '.';

export interface AnyExtend {
  reduce: (app: IAnyApplication) => void;
}
