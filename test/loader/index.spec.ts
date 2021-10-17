import assert from 'assert';
import { Application, ApplicationFactory } from '../../src';
import { LoggerLoader } from '../../src/loader/logger';

test('LoggerLoader test', async () => {
  const app = new Application();
  const loader = new LoggerLoader();
  const logger = loader.load(app);
  assert(logger.debug);
});

test('Application default logger test', async () => {
  const app = await ApplicationFactory.create();
  assert(app.logger);
  assert((app.logger as any).test);
});

test('Application controller loader test', async () => {
  const app = await ApplicationFactory.create();
  assert(app._controllers.length);
});

test('Application extend loader test', async () => {
  const app = await ApplicationFactory.create();
  assert(app._extends.length);
});


test('Application config loader test', async () => {
  const app = await ApplicationFactory.create();
  assert(app.config.port===9999);
});