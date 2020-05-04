import { PARAMETER_SERVER_METADATA } from '../constants';
import { WenServer } from '../../server';
import { WenContext } from '../../context';

/* eslint-disable @typescript-eslint/no-explicit-any */
type TServerConstructor = new (ctx: WenContext) => WenServer;

export type ParameterRouterServerMetaData = {
  index: number;
  contructor: TServerConstructor;
};

export function PServer(constructor: TServerConstructor) {
  return function(target: any, propertyKey: string | symbol, parameterIndex: number): void {
    const datas: ParameterRouterServerMetaData[] = Reflect.getOwnMetadata(PARAMETER_SERVER_METADATA, target, propertyKey) || [];
    datas.push({ index: parameterIndex, contructor: constructor });
    Reflect.defineMetadata(PARAMETER_SERVER_METADATA, datas, target, propertyKey);
  };
}
