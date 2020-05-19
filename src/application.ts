import koa from 'koa';
import koaRouter from 'koa-router';
import koaCompress from 'koa-compress';
import koaJson from 'koa-json';
import koaBodyParser from 'koa-bodyparser';

declare module 'koa' {
  interface Context {
    app: Application;
    config: IConfig;
  }
}

export interface IConfig {
  port: number;
}

export class Application extends koa {
  public config!: IConfig;
  public rootRouter = new koaRouter();
  constructor() {
    super();
    process.on('uncaughtException', (e) => {
      // TitLogger.error(e);
    });

    // 压缩中间件
    this.use(koaCompress());

    // body处理
    this.use(koaBodyParser());

    // JSON
    this.use(koaJson());
  }
}
