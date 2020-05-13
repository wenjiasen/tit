/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpMethod } from '../../lib/enumerate';
import Application, { Next, Context } from 'koa';
import { ParameterRouterQueryMetaData } from '../parameter/query';
import { ParameterRouterParamMetaData } from '../parameter/param';
import { ParameterRouterBodyMetaData } from '../parameter/body';
import { ParameterRouterServerMetaData } from '../parameter/server';
import {
  PARAMETER_QUERY_METADATA,
  PARAMETER_PARAM_METADATA,
  PARAMETER_BODY_METADATA,
  PARAMETER_SERVER_METADATA,
  CLASS_CONTROLLER_METADATA,
  METHOD_ROUTER_METADATA,
} from '../constants';
import Joi from '@hapi/joi';
import { TitMiddleware } from '../../router';
import { ClassControllerMetaData } from '../class';

const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/gm;
const ARGUMENT_NAMES = /([^\s,]+)/g;

/**
 * 获取函数的参数名
 * @param func
 */
function getParamNames(func: Function): string[] {
  const fnStr = func.toString().replace(STRIP_COMMENTS, '');
  let result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
  if (result === null) result = [];
  return result;
}

type IContextQuery = Record<string, string | string[] | undefined>;
/**
 * 将ctx.query 属性名转为全小写
 * @param query
 */
function lowerCaseContextQuery(query: IContextQuery): IContextQuery {
  const result: IContextQuery = {};
  for (const name of Object.getOwnPropertyNames(query)) {
    result[name.toLowerCase()] = query[name];
  }
  return result;
}

type RouterData = {
  param: ParameterRouterParamMetaData[];
  query: ParameterRouterQueryMetaData[];
  body?: ParameterRouterBodyMetaData;
  server: ParameterRouterServerMetaData[];
};

export type MethodRouterMetaData = {
  path: RouterPath;
  method: HttpMethod;
  middleware?: TitMiddleware[];
};
function scanTargetMetaData(target: any, propertyName: string): RouterData {
  const queryMeta: ParameterRouterQueryMetaData[] = Reflect.getOwnMetadata(PARAMETER_QUERY_METADATA, target, propertyName) || [];
  const paramMeta: ParameterRouterParamMetaData[] = Reflect.getOwnMetadata(PARAMETER_PARAM_METADATA, target, propertyName) || [];
  const bodyMeta: ParameterRouterBodyMetaData | undefined = Reflect.getOwnMetadata(PARAMETER_BODY_METADATA, target, propertyName);
  const serverMeta: ParameterRouterServerMetaData[] = Reflect.getOwnMetadata(PARAMETER_SERVER_METADATA, target, propertyName) || [];

  return {
    param: paramMeta,
    query: queryMeta,
    body: bodyMeta,
    server: serverMeta,
  };
}

function joiCheck(metadata: ParameterRouterQueryMetaData[], paramNames: string[], query: IContextQuery): Joi.ValidationResult {
  const schemaMap: Joi.SchemaMap = {};
  const needValidData: { [key: string]: any } = {};
  // 检查
  const target = lowerCaseContextQuery(query);

  for (const item of metadata) {
    const fieldName = paramNames[item.index].toLowerCase();
    schemaMap[fieldName] = item.schema;
    needValidData[fieldName] = target[fieldName];
  }
  return Joi.object(schemaMap).validate(needValidData);
}

function getRouterParams(ctx: Context, paramNames: string[], metadata: ParameterRouterParamMetaData[]): Record<number, any> {
  const { error, value } = joiCheck(metadata, paramNames, ctx._ctx.params);
  if (error) ctx.throw(400, error);
  const result = {} as Record<number, any>;
  for (const item of metadata.sort((a, b) => a.index - b.index)) {
    const fieldName = paramNames[item.index].toLowerCase();
    result[item.index] = value[fieldName];
  }
  return result;
}

function getRouterQuery(ctx: Context, paramNames: string[], metadata: ParameterRouterQueryMetaData[]): Record<number, any> {
  const { error, value } = joiCheck(metadata, paramNames, ctx._ctx.query);
  if (error) ctx.throw(400, error);
  const result = {} as Record<number, any>;
  for (const item of metadata.sort((a, b) => a.index - b.index)) {
    const fieldName = paramNames[item.index].toLowerCase();
    result[item.index] = value[fieldName];
  }
  return result;
}

function getRouterBody(ctx: Context, metadata: ParameterRouterBodyMetaData): Record<number, any> {
  const { error, value } = Joi.object(metadata.schemaMap).validate(ctx._ctx.request.body);
  if (error) ctx.throw(400, error);
  const result = {} as Record<number, any>;
  result[metadata.index] = value;
  return result;
}

function getServer(ctx: Context, metadata: ParameterRouterServerMetaData[]): Record<number, any> {
  const result = {} as Record<number, any>;
  for (const item of metadata.sort((a, b) => a.index - b.index)) {
    const instance = new item.constructor(ctx);
    result[item.index] = instance;
  }
  return result;
}

function map2Array(obj: Record<number, any>): any[] {
  const keys = Object.getOwnPropertyNames(obj);
  return keys
    .sort((a, b) => Number.parseInt(a) - Number.parseInt(b))
    .map((n) => {
      return obj[Number.parseInt(n)];
    });
}

type RouterPath = string | RegExp | (string | RegExp)[];
export function Router(ops: { path: RouterPath; method: HttpMethod; middleware?: TitMiddleware[] }) {
  return function(target: any, propertyName: string, descriptor: TypedPropertyDescriptor<any>): void {
    const method = descriptor.value as Function;
    const paramNames = getParamNames(method);

    const app = global.__app__ as Application;
    const metadata = scanTargetMetaData(target, propertyName);

    descriptor.value = async function(ctx: Context, next: Next): Promise<void> {
      // 处理query
      let params = {} as Record<string, any>;

      if (metadata.query.length) {
        const data = getRouterQuery(ctx, paramNames, metadata.query);
        params = Object.assign({}, params, data);
      }

      // 检查param
      if (metadata.param.length) {
        const data = getRouterParams(ctx, paramNames, metadata.param);
        params = Object.assign({}, params, data);
      }

      // 处理body
      if (metadata.body) {
        const data = getRouterBody(ctx, metadata.body);
        params = Object.assign({}, params, data);
      }

      // 处理server
      if (metadata.server.length) {
        const data = getServer(ctx, metadata.server);
        params = Object.assign({}, params, data);
      }

      const inParameters = map2Array(params);

      await method.apply({ ctx, app }, inParameters);
      await next();
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
