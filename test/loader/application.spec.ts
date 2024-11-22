import { test, describe } from '@jest/globals';

import { Application, ApplicationFactory } from '@/index';
import assert from 'assert';
import pino from 'pino';

describe('Application', () => {
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
        log: {
          level: 'info',
        },
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
});
