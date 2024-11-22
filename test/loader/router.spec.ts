import assert from 'assert';
import { Application, ApplicationFactory } from '../../src';
import supertest from 'supertest';
import http from 'http';
import TestAgent from 'supertest/lib/agent';

describe('Router', () => {
  let app: Application;
  let agent: TestAgent;

  // 在所有测试之前运行，初始化共享变量
  beforeAll(async () => {
    app = await ApplicationFactory.create();
    app.use(app.rootRouter.routes());
    agent = supertest(http.createServer(app.callback()));
  });

  // test('router load', async () => {
  //   assert(app.rootRouter.routes().length >= 2);
  // });

  const mockId = 1;
  const mockLimit = 0;
  const mockName = 'Jack';

  test('get test', async () => {
    // const app = await ApplicationFactory.create();
    // app.use(app.rootRouter.routes());
    // const agent = supertest(http.createServer(app.callback()));
    const res = await agent.get(`/test/${mockId}?limit=${mockLimit}`).expect(200);
    // console.log('body', res.body);
    assert(res.body.params.id == mockId);
    assert(res.body.query.limit == mockLimit);
  });

  test('post test', async () => {
    const res = await agent
      .post(`/test/${mockId}?limit=${mockLimit}`)
      .send({
        name: mockName,
      })
      .expect(200);
    assert(res.body.params.id == mockId);
    assert(res.body.query.limit == mockLimit);
    assert(res.body.body.name == mockName);
  });

  test('put test', async () => {
    const res = await agent
      .post(`/test/${mockId}?limit=${mockLimit}`)
      .send({
        name: mockName,
      })
      .expect(200);
    assert(res.body.params.id == mockId);
    assert(res.body.query.limit == mockLimit);
    assert(res.body.body.name == mockName);
  });

  test('del test', async () => {
    const res = await agent.get(`/test/${mockId}?limit=${mockLimit}`).expect(200);
    assert(res.body.params.id == mockId);
    assert(res.body.query.limit == mockLimit);
  });
});
