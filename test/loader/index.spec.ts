import assert from 'assert';
import { Application, ApplicationFactory } from '../../src';

test('LoggerLoader test', async () => {
  const app = new Application({
    port: 80,
    log: {
      level: 'info'
    }
  });
  assert(app.logger.debug);
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
  assert(app.config.port === 9999);
});