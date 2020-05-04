import koaRouter from 'koa-router';
import { Middleware } from 'koa';
export class AnyRouter<StateT = any, CustomT = {}> extends koaRouter<StateT, CustomT> {}
export type AnyMiddleware = Middleware;
