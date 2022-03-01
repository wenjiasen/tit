import pino, { Logger } from 'pino';
import koa from 'koa';
import koaRouter from '@koa/router';
import koaCompress from 'koa-compress';
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
  log: {
    level: pino.Level,
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IScope { }

export type ApplicationOpts = {
  koaCompress?: koaCompress.CompressOptions;
  koaBodyParser?: koaBodyParser.Options;
  koaJson?: any;
  pino?: pino.LoggerOptions;
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
    this.logger = pino({
      ...opts?.pino,
      level: this.config.log.level
    }
    );

    process.on('uncaughtException', (e) => {
      this.logger.error(e);
    });

    // 压缩中间件
    this.use(koaCompress(this.opts?.koaCompress));

    // body处理
    this.use(koaBodyParser(this.opts?.koaBodyParser));

    // JSON
    this.use(koaJson(this.opts?.koaJson));
  }
}
