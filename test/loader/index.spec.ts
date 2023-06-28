import assert from 'assert';
import pino from 'pino';
import { Application, ApplicationFactory } from '../../src';

test('LoggerLoader test', async () => {
  const transport = pino.transport({
    targets: [
      {
        level: 'trace',
        target: 'pino-pretty',
        options: {},
      },
    ],
  });

  const log = pino({}, transport);
  const app = new Application(
    {
      port: 80,
    },
    {
      pino: log,
    },
  );
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
