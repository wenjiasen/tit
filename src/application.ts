import pino, { Logger } from 'pino';
import koa from 'koa';
import koaRouter from '@koa/router';
import koaJson from 'koa-json';
import koaBodyParser from 'koa-bodyparser';
import { IController, IExtend } from '.';

declare module 'koa' {
  interface Context {
    app: Application;
    config: IConfig;
  }
}

export interface IConfig {
  port: number;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IScope {}

export type ApplicationOpts = {
  koaBodyParser?: koaBodyParser.Options;
  koaJson?: any;
  pino?: Logger;
};

export class Application extends koa {
  public rootScope!: IScope;
  public readonly config!: IConfig;
  public readonly logger!: Logger;
  public rootRouter = new koaRouter();
  public _controllers: { name: string; module: IController }[] = [];
  public _extends: { name: string; module: IExtend }[] = [];
  constructor(config: IConfig, private opts?: ApplicationOpts) {
    super();
    this.config = config;
    this.rootScope = {};
    this.logger =
      opts?.pino ??
      pino({
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
          },
        },
      });

    process.on('uncaughtException', (e) => {
      this.logger.error(e);
    });

    // body处理
    this.use(koaBodyParser(this.opts?.koaBodyParser));

    // JSON
    this.use(koaJson(this.opts?.koaJson));
  }
}
