import koaRouter from '@koa/router';
import { Middleware } from 'koa';
export class TitRouter<StateT = any, CustomT = {}> extends koaRouter<StateT, CustomT> {}
export type TitMiddleware = Middleware;
