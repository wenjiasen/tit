import assert from 'assert';
import { Application, ApplicationFactory } from '../../src';
import supertest from 'supertest';
import http from 'http';
import TestAgent from 'supertest/lib/agent';

describe('OpenAPI Router', () => {
  let app: Application;
  let agent: TestAgent;

  // 在所有测试之前运行，初始化共享变量
  beforeAll(async () => {
    app = await ApplicationFactory.create();
    app.use(app.rootRouter.routes());
    // app.rootRouter.stack.forEach((route) => {
    //   console.log(`${route.methods.join(', ')} -> ${route.path}`);
    // });
    agent = supertest(http.createServer(app.callback()));
  });

  const mockId = 1;
  const mockLimit = 20;
  const mockName = 'Jack';

  test('post test', async () => {
    const res = await agent.post(`/openapi/test/${mockId}?offset=${0}&limit=${mockLimit}`).send({
      name: mockName,
    });

    if (res.status !== 200) {
      console.error(`Request failed with status: ${res.status}`);
      console.error(`Response body:`, res.body || res.text || 'No response body');
    }

    // 确认状态码为 200
    expect(res.status).toBe(200);
    assert(res.body.params.id == mockId);
    assert(res.body.query.limit == mockLimit);
    assert(res.body.body.name == mockName);
  });
});
