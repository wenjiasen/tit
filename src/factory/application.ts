import { IWenApplication, WenApplication, WenRouter } from '..';
import { ConfigLoader, ControllerLoader, ExtendLoader } from '../loader';

async function loaderConfig(app: IWenApplication): Promise<void> {
  const loader = new ConfigLoader();
  app.config = await loader.load();
}

async function loaderController(app: IWenApplication): Promise<void> {
  const loader = new ControllerLoader();
  await loader.load(app);
}

async function loaderExtends(app: IWenApplication): Promise<void> {
  const loader = new ExtendLoader();
  await loader.load(app);
}

function getHealthRouter(): WenRouter {
  const router = new WenRouter();
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
  public static async create(): Promise<IWenApplication> {
    const app = new WenApplication();
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
