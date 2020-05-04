import { IAnyApplication, AnyApplication, AnyRouter } from '..';
import { ConfigLoader, ControllerLoader, ExtendLoader } from '../loader';

async function loaderConfig(app: IAnyApplication): Promise<void> {
  const loader = new ConfigLoader();
  app.config = await loader.load();
}

async function loaderController(app: IAnyApplication): Promise<void> {
  const loader = new ControllerLoader();
  await loader.load(app);
}

async function loaderExtends(app: IAnyApplication): Promise<void> {
  const loader = new ExtendLoader();
  await loader.load(app);
}

function getHealthRouter(): AnyRouter {
  const router = new AnyRouter();
  router.get('/_health', async (ctx) => {
    ctx.body = {
      message: 'ok',
    };
  });
  return router;
}

export class ApplicationFactory {
  /**
   * crate an IAnyApplication instance
   */
  public static async create(): Promise<IAnyApplication> {
    const app = new AnyApplication();
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
