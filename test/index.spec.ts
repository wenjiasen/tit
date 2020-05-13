// process.env.NODE_ENV = 'production';
process.env.TIT_CONTROLLER_DIR = './test/controller';
import { ApplicationFactory } from '../src';

async function main(): Promise<void> {
  const app = await ApplicationFactory.create();
  app.use(app.rootRouter.routes());

  app.listen(app.config.port, () => {
    console.log(`server listen ${app.config.port}`);
  });
}

main().catch((e) => {
  console.error(e);
});
