/* eslint-disable @typescript-eslint/no-explicit-any */
import Joi from 'joi';
import { PARAMETER_PARAM_METADATA } from '../constants';

export type ParameterRouterParamMetaData = {
  index: number;
  schema: Joi.AnySchema;
};

export function PParam(schema: Joi.AnySchema) {
  return function (target: any, propertyKey: string | symbol, parameterIndex: number): void {
    const data: ParameterRouterParamMetaData[] = Reflect.getOwnMetadata(PARAMETER_PARAM_METADATA, target, propertyKey) || [];
    data.push({ index: parameterIndex, schema: schema });
    Reflect.defineMetadata(PARAMETER_PARAM_METADATA, data, target, propertyKey);
  };
}
