import { CLASS_CONTROLLER_METADATA, METHOD_ROUTER_METADATA } from '../constants';
import { MethodRouterMetaData } from '..';
import { Next, Middleware, ParameterizedContext } from 'koa';
import { Application } from '../..';

export type ClassControllerMetaData = {
  routerPropertyName: string[];
};
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
      let routerPath = routerMetadata.path;
      if (ops?.prefix) {
        routerPath = `${ops?.prefix}${routerPath}`;
      }
      app.rootRouter[routerMetadata.method](routerPath, ...middleware);
    });
  };
}
