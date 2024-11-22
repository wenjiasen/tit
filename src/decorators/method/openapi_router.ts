import lodash from 'lodash';
import { Ajv, AnySchemaObject, ErrorObject } from 'ajv';
import { RouterContext } from '@koa/router';
import { HttpMethod } from '@/lib/enumerate';
import { TitMiddleware } from '../../router';
import { StatusCodes } from 'http-status-codes';
import { Next } from 'koa';
import { isPromise } from 'util/types';
import { ClassControllerMetaData } from '../class';
import { CLASS_CONTROLLER_METADATA, METHOD_ROUTER_METADATA } from '../constants';
import { MethodRouterMetaData } from './router';

type RouterPath = string | RegExp | (string | RegExp)[];

async function execMaybePromise<T>(obj: T | Promise<T>): Promise<T> {
  let value: T;
  if (isPromise(obj)) value = await obj;
  else value = obj;
  return value;
}

async function validByAjv<T>(
  values: T,
  schema: AnySchemaObject,
): Promise<{ errors?: null; value: T } | { errors: ErrorObject[]; value?: never }> {
  const ajv = new Ajv({ removeAdditional: 'all', allErrors: true, coerceTypes: true });
  const validate = ajv.compile(schema);
  if (await validate(values)) return { value: values };
  return { errors: validate.errors! };
}

export function OpenAPIRouter(ops: {
  path: RouterPath;
  method: HttpMethod;
  middleware?: TitMiddleware[];
  tags?: string[];
  group?: string;
  requestType?: AnySchemaObject;
  responseType?: AnySchemaObject | Record<StatusCodes, AnySchemaObject>;
}) {
  return function (target: ObjectConstructor, propertyName: string, descriptor: TypedPropertyDescriptor<unknown>): void {
    const handler = descriptor.value;
    if (!handler || !lodash.isFunction(handler)) throw Error('Decorator target need a function');

    descriptor.value = async function (ctx: RouterContext, next: Next): Promise<void> {
      // before
      let requestValues: Record<'query' | 'params' | 'body' | 'headers', unknown> = {
        query: ctx.request.query,
        params: ctx.params,
        body: ctx.request.body,
        headers: ctx.request.headers,
      };

      if (ops.requestType) {
        if (ops.requestType) {
          const { errors, value } = await validByAjv(requestValues, ops.requestType);
          if (errors) {
            ctx.body = errors;
            ctx.status = 400;
            return;
          }
          requestValues = value;
        }
      }
      const responseTypeBody = await execMaybePromise(handler(requestValues));
      // after
      if (ops.responseType) {
        const { errors, value } = await validByAjv(responseTypeBody, ops.responseType);
        if (errors) {
          ctx.body = errors;
          ctx.status = 400;
          return;
        }
        ctx.body = value;
      } else {
        ctx.body = responseTypeBody;
      }
      if (next) await next();
    };

    const constructor = target.constructor;
    const controllerMetadata: ClassControllerMetaData = Reflect.getMetadata(CLASS_CONTROLLER_METADATA, constructor) || {
      routerPropertyName: [],
    };
    controllerMetadata.routerPropertyName.push(propertyName);
    Reflect.defineMetadata(CLASS_CONTROLLER_METADATA, controllerMetadata, constructor);
    const routerMetadata: MethodRouterMetaData = ops;
    Reflect.defineMetadata(METHOD_ROUTER_METADATA, routerMetadata, constructor, propertyName);
  };
}
