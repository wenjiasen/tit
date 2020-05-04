import koa from 'koa';
import koaCompress from 'koa-compress';
import koaJson from 'koa-json';
import koaBodyParser from 'koa-bodyparser';

import { WenLogger, WenRouter } from '.';

export interface IWenApplication {
  config: WenTypes.IConfig;
  readonly router: WenRouter;
  koaApp: koa;
  run: () => void;
}

//TODO:解决扩展后的编译问题
export class WenApplication {
  public config!: WenTypes.IConfig;
  public readonly router: WenRouter = new WenRouter();
  public koaApp!: koa;
  constructor() {
    this.koaApp = new koa();
    process.on('uncaughtException', (e) => {
      WenLogger.error(e);
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
      WenLogger.info(`app listen port:${this.config.port}`);
    });
  }
}
