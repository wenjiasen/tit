import { Application, ApplicationOpts, TitRouter } from '..';
import { ConfigLoader, ControllerLoader, ExtendLoader } from '../loader';
import pinoHttp from 'pino-http'

async function loadConfig(app: Application): Promise<void> {
  const loader = new ConfigLoader();
  app.config = await loader.load();
}

async function loadController(app: Application): Promise<void> {
  const loader = new ControllerLoader();
  await loader.load(app);
}

async function loadExtends(app: Application): Promise<void> {
  const loader = new ExtendLoader();
  await loader.load(app);
}

function getHealthRouter(): TitRouter {
  const router = new TitRouter();
  router.get('/_health', async (ctx) => {
    ctx.body = {
      message: 'ok',
    };
  });
  return router;
}

export class ApplicationFactory {
  /**
   * crate an Application instance
   */
  public static async create(opts?: { app: ApplicationOpts }): Promise<Application> {
    const app = new Application(opts?.app);

    global.__app__ = app;

    // req log
    const pinoHttpWrap = pinoHttp(opts?.app?.pino)
    app.use(async (ctx, next) => {
      pinoHttpWrap(ctx.req, ctx.res)
      await next();
    });

    // config
    await loadConfig(app);

    // extend
    await loadExtends(app);

    // controller
    await loadController(app);

    // router
    // health check
    const healthRouter = getHealthRouter();
    app.use(healthRouter.routes());

    return app;
  }
}
