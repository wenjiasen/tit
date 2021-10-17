import koa from 'koa';
import koaRouter from '@koa/router';
import koaCompress from 'koa-compress';
import koaJson from 'koa-json';
import koaBodyParser from 'koa-bodyparser';
import { ILogger } from './interface/logger.interface';

declare module 'koa' {
  interface Context {
    app: Application;
    config: IConfig;
  }
}

export interface IConfig {
  port: number;
  logger?: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IScope {}

export type ApplicationOpts = {
  koaCompress?: koaCompress.CompressOptions;
  koaBodyParser?: koaBodyParser.Options;
  koaJson?: any;
};

export class Application extends koa {
  public config!: IConfig;
  public logger!: ILogger;
  public rootScope!: IScope;
  public rootRouter = new koaRouter();
  constructor(private opts?: ApplicationOpts) {
    super();
    this.rootScope = {};
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
