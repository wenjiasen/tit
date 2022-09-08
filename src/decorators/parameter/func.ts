import Joi from 'joi';
import { Context } from 'koa';
import { Application } from '../..';
import { PARAMETER_FUNC_METADATA } from '../constants';

type Value<T> = (app: Application, ctx: Context) => Promise<T | undefined | null>;
export type ParameterRouterFunctionMetaData<T> = {
  index: number;
  schema: Joi.AnySchema;
  value: Value<T>;
};

type PFunctionKind = 'query' | 'param' | 'ctx' | 'body';

export function PFunction<T>(opts: { schema: Joi.AnySchema; value: Value<T> }) {
  return function(target: any, propertyKey: string | symbol, parameterIndex: number): void {
    const metadata: ParameterRouterFunctionMetaData<T>[] = Reflect.getOwnMetadata(PARAMETER_FUNC_METADATA, target, propertyKey) || [];
    metadata.push({ index: parameterIndex, schema: opts.schema, value: opts.value });
    Reflect.defineMetadata(PARAMETER_FUNC_METADATA, metadata, target, propertyKey);
  };
}
