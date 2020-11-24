import { assert } from 'console';
import { Application, ApplicationFactory } from '../../../src';
import { LoggerLoader } from '../../../src/loader/logger';

test('LoggerLoader test', async () => {
  const app = new Application();
  const loader = new LoggerLoader();
  const logger = loader.load(app);
  assert(logger.debug);
  logger.debug('test');
});

test('Application default logger test', async () => {
  const app = await ApplicationFactory.create();
  assert(app.logger);
  assert(app.logger.debug);
  app.logger.debug('debug');
});

test('ENV test - TIT_LOGGER_CLASS', async () => {
  process.env.TIT_LOGGER_CLASS = './test/loader/logger/customLogger';
  const app = await ApplicationFactory.create();
  assert(app.logger);
  assert(app.logger.debug);
  app.logger.debug('debug');
});
