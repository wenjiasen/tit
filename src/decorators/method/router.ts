/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpMethod } from '../../lib/enumerate';
import { Next, Context } from 'koa';
import { ParameterRouterQueryMetaData } from '../parameter/query';
import { ParameterRouterParamMetaData } from '../parameter/param';
import { ParameterRouterBodyMetaData } from '../parameter/body';
import { ParameterRouterServerMetaData } from '../parameter/server';
import { ParameterRouterCtxMetaData } from '../parameter/ctx';
import {
  PARAMETER_QUERY_METADATA,
  PARAMETER_PARAM_METADATA,
  PARAMETER_BODY_METADATA,
  PARAMETER_SERVER_METADATA,
  CLASS_CONTROLLER_METADATA,
  METHOD_ROUTER_METADATA,
  PARAMETER_CTX_METADATA,
  PARAMETER_FUNC_METADATA,
} from '../constants';
import Joi, { func } from 'joi';
import { TitMiddleware } from '../../router';
import { ClassControllerMetaData } from '../class';
import { filterNullOrUndefinedProperty, isNullOrUndefined, lowerCaseObjectProperties, map2Array } from '../../util';
import { ParameterRouterFunctionMetaData, PFunctionKind } from '../parameter/func';

const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/gm;
const ARGUMENT_NAMES = /([^\s,]+)/g;

export type ParameterRouterMetaData = {
  index: number;
  schema: Joi.AnySchema;
};

/**
 * 获取函数的参数名
 * @param func
 */
function getParamNames(func: Function): string[] {
  const fnStr = func.toString().replace(STRIP_COMMENTS, '');
  let result: string[] | null = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
  if (result === null) result = [];
  return result;
}

type RouterData = {
  param: ParameterRouterParamMetaData[];
  query: ParameterRouterQueryMetaData[];
  body?: ParameterRouterBodyMetaData;
  server: ParameterRouterServerMetaData[];
  ctx: ParameterRouterCtxMetaData[];
  func: ParameterRouterFunctionMetaData<any>[];
};

export type MethodRouterMetaData = {
  path: RouterPath;
  method: HttpMethod;
  middleware?: TitMiddleware[];
};

/**
 * 扫描路由参数元数据
 * @param target
 * @param propertyName
 * @returns
 */
function scanTargetMetaData(target: any, propertyName: string): RouterData {
  const queryMeta: ParameterRouterQueryMetaData[] = Reflect.getOwnMetadata(PARAMETER_QUERY_METADATA, target, propertyName) || [];
  const paramMeta: ParameterRouterParamMetaData[] = Reflect.getOwnMetadata(PARAMETER_PARAM_METADATA, target, propertyName) || [];
  const bodyMeta: ParameterRouterBodyMetaData | undefined = Reflect.getOwnMetadata(PARAMETER_BODY_METADATA, target, propertyName);
  const serverMeta: ParameterRouterServerMetaData[] = Reflect.getOwnMetadata(PARAMETER_SERVER_METADATA, target, propertyName) || [];
  const ctxMeta: ParameterRouterCtxMetaData[] = Reflect.getOwnMetadata(PARAMETER_CTX_METADATA, target, propertyName) || [];
  const funcMeta: ParameterRouterFunctionMetaData<any>[] = Reflect.getOwnMetadata(PARAMETER_FUNC_METADATA, target, propertyName) || [];

  return {
    param: paramMeta,
    query: queryMeta,
    body: bodyMeta,
    server: serverMeta,
    ctx: ctxMeta,
    func: funcMeta,
  };
}

/**
 * Joi检查
 * @param metadata
 * @param paramNames
 * @param source
 * @returns
 */
async function joiValidateAsync(
  metadata: ParameterRouterMetaData[],
  paramNames: string[],
  source: Record<string, unknown>,
): Promise<Joi.ValidationResult> {
  const schemaMap: Joi.SchemaMap = {};
  const needValidData: { [key: string]: any } = {};
  // 检查
  const target = lowerCaseObjectProperties(source);
  for (const item of metadata) {
    const fieldName = paramNames[item.index].toLowerCase();
    schemaMap[fieldName] = item.schema;
    needValidData[fieldName] = target[fieldName];
  }
  return promiseValidate(schemaMap, needValidData);
}

async function promiseValidate(schemaMap: Joi.SchemaMap, needValidData: Record<string, unknown>) {
  const joiObject = Joi.object(schemaMap);

  return new Promise<Joi.ValidationResult<any>>(async (resolve, reject) => {
    try {
      const value = await joiObject.validateAsync(needValidData, {
        stripUnknown: true,
      });
      resolve({ value, error: undefined });
    } catch (error) {
      resolve({ error: error as any, value: undefined });
    }
  });
}

/**
 * 获取路径参数
 * @param ctx
 * @param paramNames
 * @param metadata
 * @returns
 */
async function getRouterParams(ctx: Context, paramNames: string[], metadata: ParameterRouterParamMetaData[]): Promise<Record<number, any>> {
  const { error, value } = await joiValidateAsync(metadata, paramNames, ctx.params);
  if (error) ctx.throw(400, error);
  const result = {} as Record<number, any>;
  for (const item of metadata.sort((a, b) => a.index - b.index)) {
    const fieldName = paramNames[item.index].toLowerCase();
    result[item.index] = value[fieldName];
  }
  return result;
}

/**
 * 获取路由参数
 * @param ctx
 * @param paramNames
 * @param metadata
 * @returns
 */
async function getRouterQuery(ctx: Context, paramNames: string[], metadata: ParameterRouterQueryMetaData[]): Promise<Record<number, any>> {
  const { error, value } = await joiValidateAsync(metadata, paramNames, ctx.query);
  if (error) ctx.throw(400, error);
  const result = {} as Record<number, any>;
  for (const item of metadata.sort((a, b) => a.index - b.index)) {
    const fieldName = paramNames[item.index].toLowerCase();
    result[item.index] = value[fieldName];
  }
  return result;
}

/**
 * 获取body参数
 * @param ctx
 * @param metadata
 * @returns
 */
async function getRouterBody(ctx: Context, metadata: ParameterRouterBodyMetaData): Promise<Record<number, any>> {
  let body = filterNullOrUndefinedProperty(ctx.request.body as unknown as any);
  if (metadata.isOnlyRoot) {
    body = {
      root: ctx.request.body,
    };
  }
  const { error, value } = await promiseValidate(metadata.schemaMap, body);
  if (error) ctx.throw(400, error);
  const result = {} as Record<number, any>;
  if (metadata.isOnlyRoot) {
    result[metadata.index] = value['root'];
  } else {
    result[metadata.index] = value;
  }
  return result;
}

/**
 * 获取server参数
 * @param ctx
 * @param metadata
 * @returns
 */
function getRouterServer(ctx: Context, metadata: ParameterRouterServerMetaData[]): Record<number, any> {
  const result = {} as Record<number, any>;
  for (const item of metadata.sort((a, b) => a.index - b.index)) {
    const instance = new item.constructor(ctx.app);
    result[item.index] = instance;
  }
  return result;
}

/**
 * 获取ctx参数
 * @param ctx
 * @param paramNames
 * @param metadata
 * @returns
 */
async function getCtxParams(ctx: Context, paramNames: string[], metadata: ParameterRouterCtxMetaData[]): Promise<Record<number, any>> {
  const { error, value } = await joiValidateAsync(metadata, paramNames, ctx);
  if (error) ctx.throw(400, error);
  const result = {} as Record<number, any>;
  for (const item of metadata.sort((a, b) => a.index - b.index)) {
    const fieldName = paramNames[item.index].toLowerCase();
    result[item.index] = value[fieldName];
  }
  return result;
}

/**
 * 获取PFunction参数
 * @param ctx
 * @param paramNames
 * @param metadata
 * @returns
 */
async function getFunctionParams(
  ctx: Context,
  paramNames: string[],
  metadata: ParameterRouterFunctionMetaData<any>[],
): Promise<Record<number, any>> {
  const schemaMap: Joi.SchemaMap = {};
  const needValidData: { [key: string]: any } = {};
  for (const item of metadata) {
    const fieldName = paramNames[item.index].toLowerCase();
    schemaMap[fieldName] = await item.value.call({}, global.__app__, ctx);
    needValidData[fieldName] = getKindValue(ctx, item.kind, fieldName);
  }
  const { error, value } = await promiseValidate(schemaMap, needValidData);

  if (error) ctx.throw(400, error);
  const result = {} as Record<number, any>;
  for (const item of metadata.sort((a, b) => a.index - b.index)) {
    const fieldName = paramNames[item.index].toLowerCase();
    result[item.index] = value[fieldName];
  }
  return result;
}
function getKindValue(ctx: Context, kind: PFunctionKind, name: string): any {
  switch (kind) {
    case 'query':
      return lowerCaseObjectProperties(ctx.query)[name.toLowerCase()];
    case 'param':
      return lowerCaseObjectProperties(ctx.params)[name.toLowerCase()];
    case 'body':
      // TODO  暂时只支持一级
      return lowerCaseObjectProperties(ctx.request.body)[name.toLowerCase()];
    case 'ctx':
      // 区分大小写？
      return ctx[name.toLowerCase()];
    default:
      return undefined;
  }
}

type RouterPath = string | RegExp | (string | RegExp)[];
export function Router(ops: { path: RouterPath; method: HttpMethod; middleware?: TitMiddleware[] }) {
  return function (target: any, propertyName: string, descriptor: TypedPropertyDescriptor<any>): void {
    const method = descriptor.value;
    if (isNullOrUndefined(method)) throw Error('method need a function');
    const paramNames = getParamNames(method);

    const app = global.__app__;
    const metadata = scanTargetMetaData(target, propertyName);

    descriptor.value = async function (ctx: Context, next: Next): Promise<void> {
      // 处理query
      let params = {} as Record<string, any>;

      if (metadata.query.length) {
        const data = await getRouterQuery(ctx, paramNames, metadata.query);
        params = Object.assign({}, params, data);
      }

      // 检查param
      if (metadata.param.length) {
        const data = await getRouterParams(ctx, paramNames, metadata.param);
        params = Object.assign({}, params, data);
      }

      // 处理body
      if (metadata.body) {
        const data = await getRouterBody(ctx, metadata.body);
        params = Object.assign({}, params, data);
      }

      // 处理server
      if (metadata.server.length) {
        const data = getRouterServer(ctx, metadata.server);
        params = Object.assign({}, params, data);
      }

      // 检查ctx参数
      if (metadata.ctx.length) {
        const data = await getCtxParams(ctx, paramNames, metadata.ctx);
        params = Object.assign({}, params, data);
      }

      // 检查ctx参数
      if (metadata.func.length) {
        const data = await getFunctionParams(ctx, paramNames, metadata.func);
        params = Object.assign({}, params, data);
      }

      const inParameters = map2Array(params);
      await method.apply({ ctx, app }, inParameters);
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
