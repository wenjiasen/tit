import { IApplication, Application, TitRouter } from '..';
import { ConfigLoader, ControllerLoader, ExtendLoader } from '../loader';

async function loaderConfig(app: IApplication): Promise<void> {
  const loader = new ConfigLoader();
  app.config = await loader.load();
}

async function loaderController(app: IApplication): Promise<void> {
  const loader = new ControllerLoader();
  await loader.load(app);
}

async function loaderExtends(app: IApplication): Promise<void> {
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
  public static async create(): Promise<IApplication> {
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
    app.koaApp.use(healthRouter.routes());

    return app;
  }
}
