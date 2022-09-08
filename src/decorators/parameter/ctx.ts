import Joi from 'joi';
import { PARAMETER_CTX_METADATA } from '../constants';

export type ParameterRouterCtxMetaData = {
  index: number;
  schema: Joi.AnySchema;
};

export function PCtx(schema: Joi.AnySchema) {
  return function(target: any, propertyKey: string | symbol, parameterIndex: number): void {
    const metadata: ParameterRouterCtxMetaData[] = Reflect.getOwnMetadata(PARAMETER_CTX_METADATA, target, propertyKey) || [];
    metadata.push({ index: parameterIndex, schema: schema });
    Reflect.defineMetadata(PARAMETER_CTX_METADATA, metadata, target, propertyKey);
  };
}
