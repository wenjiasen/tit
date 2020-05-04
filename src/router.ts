import koaRouter from 'koa-router';
import { Middleware } from 'koa';
export class WenRouter<StateT = any, CustomT = {}> extends koaRouter<StateT, CustomT> {}
export type WenMiddleware = Middleware;
