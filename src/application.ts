import koa from 'koa';
import koaCompress from 'koa-compress';
import koaJson from 'koa-json';
import koaBodyParser from 'koa-bodyparser';

import { AnyLogger, AnyRouter } from '.';

export interface IAnyApplication {
  config: AnyTypes.IConfig;
  readonly router: AnyRouter;
  koaApp: koa;
  run: () => void;
}

//TODO:解决扩展后的编译问题
export class AnyApplication {
  public config!: AnyTypes.IConfig;
  public readonly router: AnyRouter = new AnyRouter();
  public koaApp!: koa;
  constructor() {
    this.koaApp = new koa();
    process.on('uncaughtException', (e) => {
      AnyLogger.error(e);
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
      AnyLogger.info(`app listen port:${this.config.port}`);
    });
  }
}
