import pino, { Logger } from 'pino';
import koa from 'koa';
import koaRouter from '@koa/router';
import { bodyParser } from '@koa/bodyparser';
import { IController, IExtend } from '.';

declare module 'koa' {
  interface Context {
    app: Application;
    config: IConfig;
  }
}

export interface IConfig {
  port: number;
  log: {
    level: pino.Level;
  };
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IScope {}

export type ApplicationOpts = {
  koaJson?: {
    pretty?: boolean | undefined;
    param?: string | undefined;
    spaces?: number | undefined;
  };
  pino?: Logger;
};

export class Application extends koa {
  public rootScope!: IScope;
  public readonly config!: IConfig;
  public readonly logger!: Logger;
  public rootRouter = new koaRouter();
  public _controllers: { name: string; module: IController }[] = [];
  public _extends: { name: string; module: IExtend }[] = [];
  constructor(
    config: IConfig,
    private opts?: ApplicationOpts,
  ) {
    super();
    this.config = config;
    this.rootScope = {};
    this.logger =
      opts?.pino ??
      pino({
        level: config.log.level,
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

    this.use(bodyParser());
  }
}
