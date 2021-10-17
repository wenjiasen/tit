import Joi from 'joi';
import { PARAMETER_QUERY_METADATA } from '../constants';

/* eslint-disable @typescript-eslint/no-explicit-any */
export type ParameterRouterQueryMetaData = {
  index: number;
  schema: Joi.AnySchema;
};

export function PQuery(schema: Joi.AnySchema) {
  return function(target: any, propertyKey: string | symbol, parameterIndex: number): void {
    const datas: ParameterRouterQueryMetaData[] = Reflect.getOwnMetadata(PARAMETER_QUERY_METADATA, target, propertyKey) || [];
    datas.push({ index: parameterIndex, schema: schema });
    Reflect.defineMetadata(PARAMETER_QUERY_METADATA, datas, target, propertyKey);
  };
}
