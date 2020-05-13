import { PARAMETER_SERVER_METADATA } from '../constants';
import { IServer } from '../../server';
import { Context } from 'koa';

/* eslint-disable @typescript-eslint/no-explicit-any */
type TServerConstructor = new (ctx: Context) => IServer;

export type ParameterRouterServerMetaData = {
  index: number;
  constructor: TServerConstructor;
};

export function PServer(constructor: TServerConstructor) {
  return function(target: any, propertyKey: string | symbol, parameterIndex: number): void {
    const data: ParameterRouterServerMetaData[] = Reflect.getOwnMetadata(PARAMETER_SERVER_METADATA, target, propertyKey) || [];
    data.push({ index: parameterIndex, constructor: constructor });
    Reflect.defineMetadata(PARAMETER_SERVER_METADATA, data, target, propertyKey);
  };
}
