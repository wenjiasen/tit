import { CLASS_CONTROLLER_METADATA, METHOD_ROUTER_METADATA } from '../constants';
import { MethodRouterMetaData, RouterData } from '..';
import { Next, Middleware, ParameterizedContext } from 'koa';
import koaRouter from '@koa/router';
import { HttpMethod } from '../../lib';
import { app } from '../../factory';
import { OperationObject, ParameterObject, ReferenceObject, RequestBodyObject, ResponsesObject, SchemaObject } from 'openapi3-ts/oas31';
import * as parse from 'joi-to-json';
import Joi from 'joi';

import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
// See https://github.com/typestack/class-transformer/issues/563 for alternatives
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { defaultMetadataStorage } = require('class-transformer/cjs/storage');
import { openApiBuilder } from '../../openapi';
import { Constructor } from 'src/util';

type RouterMetadata = {
  name: string | symbol;
  metadata?: RouterData;
  paramNames: string[];
};

export type ClassControllerMetaData = {
  routerData: [RouterMetadata];
};

function checkDuplicatePath(path: string, method: HttpMethod, router: koaRouter): boolean {
  const index = router.stack.findIndex((item) => {
    if (item.path.toLocaleLowerCase() === path.toLocaleLowerCase() && item.methods.includes(method.toUpperCase())) {
      return true;
    }
  });
  return index > -1;
}
function convertPathParams(path: string): string {
  return path.replace(/:(\w+)/g, '{$1}');
}

function mergeContext<StateT, CustomT>(
  handle: (ctx: ParameterizedContext<StateT, CustomT>, next: Next) => void,
): Middleware<StateT, CustomT> {
  return async (ctx: ParameterizedContext<StateT, CustomT>, next: Next): Promise<void> => {
    await handle.apply(
      {
        ctx,
      },
      [ctx, next],
    );
  };
}
// 检查字段是否是必填
function isFieldRequired(schema: Joi.AnySchema): boolean {
  const schemaDescription = schema.describe();
  return !!(schemaDescription.flags && (schemaDescription.flags as Record<string, string>)['presence'] === 'required');
}

export function Controller(ops?: { prefix?: string; tags?: string[]; summary?: string; description?: string }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function (target: Constructor<any>): void {
    const controllerMetadata: ClassControllerMetaData | undefined = Reflect.getMetadata(CLASS_CONTROLLER_METADATA, target);
    controllerMetadata?.routerData?.forEach(({ name: routerName, paramNames, metadata }) => {
      const routerMetadata: MethodRouterMetaData = Reflect.getMetadata(METHOD_ROUTER_METADATA, target, routerName);
      const middleware = routerMetadata.middleware || [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const handleMiddleware = mergeContext(target.prototype[routerName] as any);
      middleware.push(handleMiddleware);
      const routerPaths = Array.isArray(routerMetadata.path) ? routerMetadata.path : [routerMetadata.path];
      routerPaths.forEach((routerPath) => {
        if (ops?.prefix) {
          routerPath = `${ops?.prefix}${routerPath}`;
        }
        if (checkDuplicatePath(routerPath.toString(), routerMetadata.method, app.rootRouter)) {
          console.error(new Error(`Duplicate router path: "${routerPath}"`).stack);
          process.exit();
        }
        app.rootRouter[routerMetadata.method](routerPath, ...middleware);

        // 注册openapi
        if (metadata) {
          const matchInPath =
            metadata?.param?.map((row): ParameterObject => {
              return {
                in: 'path',
                name: paramNames[row.index] ?? '',
                schema: row.schema ? parse.default(row.schema, 'open-api') : {},
                required: isFieldRequired(row.schema),
              };
            }) ?? [];

          const matchInQuery =
            metadata?.query?.map((row): ParameterObject => {
              return {
                in: 'query',
                name: paramNames[row.index] ?? '',
                schema: row.schema ? parse.default(row.schema, 'open-api') : {},
                required: isFieldRequired(row.schema),
              };
            }) ?? [];

          const schemas = validationMetadatasToSchemas({
            refPointerPrefix: '#/components/schemas/',
            classTransformerMetadataStorage: defaultMetadataStorage,
          });
          for (const key in schemas) {
            if (Object.prototype.hasOwnProperty.call(schemas, key)) {
              const schema = schemas[key];
              if (schema) {
                openApiBuilder.addSchema(key, schema as SchemaObject);
              }
            }
          }

          let reqBody: (RequestBodyObject | ReferenceObject) | undefined;
          if (metadata.body?.reqBodyClass) {
            reqBody = {
              content: {
                'application/json': {
                  schema: {
                    $ref: `#/components/schemas/${metadata.body.reqBodyClass.name}`,
                  },
                },
              },
            };
          } else if (metadata.body?.schemaMap) {
            reqBody = {
              content: {
                'application/json': {
                  schema: parse.default(Joi.object(metadata.body.schemaMap), 'open-api'),
                },
              },
            };
          }

          let resBody: ResponsesObject | undefined;
          if (routerMetadata.responseBodyClass) {
            resBody = {
              default: {
                description: '',
                content: {
                  'application/json': {
                    schema: {
                      $ref: `#/components/schemas/${routerMetadata.responseBodyClass.name}`,
                    },
                  },
                },
              },
            };
          }

          openApiBuilder.addPath(
            convertPathParams(routerPath.toString()),
            Object.defineProperty<OperationObject>({} as OperationObject, routerMetadata.method, {
              enumerable: true,
              value: {
                summary: routerMetadata.summary || routerName,
                tags: routerMetadata.tags || ops?.tags || [target.name],
                description: routerMetadata.description,
                parameters: matchInPath.concat(matchInQuery),
                requestBody: reqBody,
                responses: resBody,
              },
            }),
          );
        }
      });
    });
  };
}
