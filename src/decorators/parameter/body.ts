/* eslint-disable @typescript-eslint/no-explicit-any */
import Joi from 'joi';
import { PARAMETER_BODY_METADATA } from '../constants';

export type ParameterRouterBodyMetaData = {
  index: number;
  schemaMap: Joi.SchemaMap;
  isOnlyRoot?: boolean;
};

/**
 * 从Body中提取参数，并进行校验
 * @param schemaMap
 * @param isOnlyRoot
 * @returns
 */
export function PBody(schemaMap: Joi.SchemaMap, isOnlyRoot = false) {
  return function(target: any, propertyKey: string | symbol, parameterIndex: number): void {
    const data: ParameterRouterBodyMetaData = {
      index: parameterIndex,
      schemaMap: isOnlyRoot
        ? {
            root: schemaMap,
          }
        : schemaMap,
      isOnlyRoot,
    };
    Reflect.defineMetadata(PARAMETER_BODY_METADATA, data, target, propertyKey);
  };
}

/**
 *
 * @deprecated 废弃，使用PBody的isArrayRoot替代
 * @param schemaMap
 * @returns
 */
export function PBodyRootArray(schemaMap: Joi.ArraySchema) {
  return function(target: any, propertyKey: string | symbol, parameterIndex: number): void {
    const data: ParameterRouterBodyMetaData = {
      index: parameterIndex,
      isOnlyRoot: true,
      schemaMap: {
        root: schemaMap,
      },
    };
    Reflect.defineMetadata(PARAMETER_BODY_METADATA, data, target, propertyKey);
  };
}
