import koaRouter from '@koa/router';
import { Middleware } from 'koa';
export class TitRouter<StateT = unknown, CustomT = object> extends koaRouter<StateT, CustomT> {}
export type TitMiddleware = Middleware;
