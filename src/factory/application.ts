import { Application, TitRouter } from '..';
import { ConfigLoader, ControllerLoader, ExtendLoader } from '../loader';

async function loaderConfig(app: Application): Promise<void> {
  const loader = new ConfigLoader();
  app.config = await loader.load();
}

async function loaderController(app: Application): Promise<void> {
  const loader = new ControllerLoader();
  await loader.load(app);
}

async function loaderExtends(app: Application): Promise<void> {
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
  public static async create(): Promise<Application> {
    const app = new Application();
    global.__app__ = app;

    // config
    await loaderConfig(app);

    // extend
    await loaderExtends(app);

    // controller
    await loaderController(app);

    // router
    // health check
    const healthRouter = getHealthRouter();
    app.use(healthRouter.routes());

    return app;
  }
}
