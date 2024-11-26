/* eslint-disable @typescript-eslint/no-explicit-any */
import Joi from 'joi';
import { REQ_BODY_METADATA } from '../constants';
import { Constructor } from '@/util';

export type ReqBodyMetaData = {
  index: number;
  schemaMap?: Joi.SchemaMap;
  isOnlyRoot?: boolean;
  reqBodyClass?: Constructor<any>;
};

/**
 * 从Body中提取参数，并进行校验
 * @deprecated 使用ReqBody
 * @param schemaMap
 * @param isOnlyRoot
 * @returns
 */
export function PBody(schemaMap: Joi.SchemaMap, isOnlyRoot = false) {
  return function (target: any, propertyKey: string | symbol, parameterIndex: number): void {
    const data: ReqBodyMetaData = {
      index: parameterIndex,
      schemaMap: isOnlyRoot
        ? {
            root: schemaMap,
          }
        : schemaMap,
      isOnlyRoot,
    };
    Reflect.defineMetadata(REQ_BODY_METADATA, data, target, propertyKey);
  };
}

/**
 *
 * @deprecated 废弃，使用PBody的isArrayRoot替代
 * @param schemaMap
 * @returns
 */
export function PBodyRootArray(schemaMap: Joi.ArraySchema) {
  return function (target: any, propertyKey: string | symbol, parameterIndex: number): void {
    const data: ReqBodyMetaData = {
      index: parameterIndex,
      isOnlyRoot: true,
      schemaMap: {
        root: schemaMap,
      },
    };
    Reflect.defineMetadata(REQ_BODY_METADATA, data, target, propertyKey);
  };
}

/**
 * 验证Request中的body
 * @param validatorClass class-validator类
 * @returns
 */
export function ReqBody<T>(validatorClass: Constructor<T>) {
  return function (target: any, propertyKey: string | symbol, parameterIndex: number): void {
    const data: ReqBodyMetaData = {
      index: parameterIndex,
      reqBodyClass: validatorClass,
    };
    Reflect.defineMetadata(REQ_BODY_METADATA, data, target, propertyKey);
  };
}
