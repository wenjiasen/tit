import { CLASS_CONTROLLER_METADATA, METHOD_ROUTER_METADATA } from '../constants';
import { MethodRouterMetaData } from '..';
import { Next, Middleware, ParameterizedContext } from 'koa';
import { Application } from '../..';
import koaRouter from '@koa/router';
import { HttpMethod } from '../../lib';

export type ClassControllerMetaData = {
  routerPropertyName: string[];
};

function checkDuplicatePath(path: string, method: HttpMethod, router: koaRouter): boolean {
  const index = router.stack.findIndex((item) => {
    if (item.path.toLocaleLowerCase() === path.toLocaleLowerCase() && item.methods.includes(method.toUpperCase())) {
      return true;
    }
  });
  return index > -1;
}

function mergeContext<StateT, CustomT>(handle: Function): Middleware<StateT, CustomT> {
  return async (ctx: ParameterizedContext<StateT, CustomT>, next: Next): Promise<void> => {
    await handle.apply(
      {
        ctx,
      },
      [ctx, next],
    );
  };
}
export function Controller(ops: { prefix?: string } = {}) {
  return function(target: any): void {
    const metadata: ClassControllerMetaData | undefined = Reflect.getMetadata(CLASS_CONTROLLER_METADATA, target);
    const app = global.__app__ as Application;
    metadata?.routerPropertyName?.forEach((routerName) => {
      const routerMetadata: MethodRouterMetaData = Reflect.getMetadata(METHOD_ROUTER_METADATA, target, routerName);
      const middleware = routerMetadata.middleware || [];
      const handleMiddleware = mergeContext(target.prototype[routerName]);
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
      });
    });
  };
}
