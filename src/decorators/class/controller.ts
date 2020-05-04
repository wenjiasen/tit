import { CLASS_CONTROLLER_METADATA, METHOD_ROUTER_METADATA } from '../constants';
import { IApplication, TitMiddleware, Context } from '../..';
import { Context as koaContext, Next } from 'koa';
import { IRouterContext } from 'koa-router';
import { MethodRouterMetaData } from '..';

export type ClassControllerMetaData = {
  routerPropertyName: string[];
};

function mergeContext(handle: Function): TitMiddleware {
  return async (ctx: koaContext, next: Next): Promise<void> => {
    const anyContext = new Context(ctx as IRouterContext);
    await handle.apply(
      {
        ctx: anyContext,
      },
      [anyContext, next],
    );
  };
}

export function Controller(ops: { prefix?: string } = {}) {
  return function(target: any): void {
    const metadata: ClassControllerMetaData | undefined = Reflect.getMetadata(CLASS_CONTROLLER_METADATA, target);
    const app = global.__app__ as IApplication;
    metadata?.routerPropertyName?.forEach((routerName) => {
      const routerMetadata: MethodRouterMetaData = Reflect.getMetadata(METHOD_ROUTER_METADATA, target, routerName);
      const middlewares = routerMetadata.middleware || [];
      const handleMiddleware = mergeContext(target.prototype[routerName]);
      middlewares.push(handleMiddleware);
      let routerPath = routerMetadata.path;
      if (ops?.prefix) {
        routerPath = `${ops?.prefix}${routerPath}`;
      }
      app.router[routerMetadata.method](routerPath, ...middlewares);
    });
  };
}
