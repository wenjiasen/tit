import { Application, ApplicationOpts, TitRouter, IConfig } from '..';
import { ConfigLoader, ControllerLoader, ExtendLoader } from '../loader';

async function loadConfig(): Promise<IConfig> {
  const loader = new ConfigLoader();
  return await loader.load();
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
export let app: Application;

export class ApplicationFactory {
  /**
   * crate an Application instance
   */
  public static async create(opts?: { app: ApplicationOpts }): Promise<Application> {
    // config
    const config = await loadConfig();
    const appInstance = new Application(config, opts?.app);
    app = appInstance;

    // extend
    await loadExtends(appInstance);

    // controller
    await loadController(appInstance);

    // router
    // health check
    const healthRouter = getHealthRouter();
    appInstance.use(healthRouter.routes());

    return appInstance;
  }
}
