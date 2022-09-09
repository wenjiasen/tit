import Joi from 'joi';
import { Context } from 'koa';
import { Application } from '../..';
import { PARAMETER_FUNC_METADATA } from '../constants';

type Value<T> = (app: Application, ctx: Context) => Promise<T | undefined | null>;
export type ParameterRouterFunctionMetaData<T> = {
  index: number;
  kind: PFunctionKind;
  value: Value<Joi.AnySchema<T>>;
};

export type PFunctionKind = 'query' | 'param' | 'ctx' | 'body';

export function PFunction<T>(opts: { kind: PFunctionKind; value: Value<Joi.AnySchema<T>> }) {
  return function(target: any, propertyKey: string | symbol, parameterIndex: number): void {
    const metadata: ParameterRouterFunctionMetaData<T>[] = Reflect.getOwnMetadata(PARAMETER_FUNC_METADATA, target, propertyKey) || [];
    metadata.push({
      index: parameterIndex,
      value: opts.value,
      kind: opts.kind,
    });
    Reflect.defineMetadata(PARAMETER_FUNC_METADATA, metadata, target, propertyKey);
  };
}
