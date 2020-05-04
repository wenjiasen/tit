import koa from 'koa';
import koaCompress from 'koa-compress';
import koaJson from 'koa-json';
import koaBodyParser from 'koa-bodyparser';

import { TitLogger, TitRouter } from '.';

export interface IApplication {
  config: TitTypes.IConfig;
  readonly router: TitRouter;
  koaApp: koa;
  run: () => void;
}

//TODO:解决扩展后的编译问题
export class Application {
  public config!: TitTypes.IConfig;
  public readonly router: TitRouter = new TitRouter();
  public koaApp!: koa;
  constructor() {
    this.koaApp = new koa();
    process.on('uncaughtException', (e) => {
      TitLogger.error(e);
    });

    // TODO:错误处理
    // this.koaApp.use(errorMiddleware());

    // 压缩中间件
    this.koaApp.use(koaCompress());

    // body处理
    this.koaApp.use(koaBodyParser());

    // JSON
    this.koaApp.use(koaJson());
  }

  run(): void {
    this.koaApp.listen(this.config.port, () => {
      TitLogger.info(`app listen port:${this.config.port}`);
    });
  }
}
