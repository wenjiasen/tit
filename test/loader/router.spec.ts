import assert from 'assert';
import { Application, ApplicationFactory } from '../../src';
import supertest from 'supertest';
import http from 'http';
import TestAgent from 'supertest/lib/agent';
import { test, describe, beforeAll } from '@jest/globals';
import { RouterContext } from '@koa/router';
import { Next } from 'koa';
import { openApiBuilder } from '@/openapi';
import { PostCreate } from './dto/post.dto';

describe('Router', () => {
  let app: Application;
  let agent: TestAgent;

  // 在所有测试之前运行，初始化共享变量
  beforeAll(async () => {
    app = await ApplicationFactory.create();
    app.use(async (ctx: RouterContext, next: Next): Promise<void> => {
      ctx['trailID'] = 'trail_001';
      ctx['trailIDFunc'] = 'trail_002';
      await next();
    });
    app.use(app.rootRouter.routes());

    console.log('yaml-------->\n', openApiBuilder.getSpecAsYaml());
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
    const res = await agent.get(`/api/v1/test/${mockId}?limit=${mockLimit}`);
    // console.log('body', res.body);
    if (res.status !== 200) {
      console.error(`Request failed with status: ${res.status}`);
      console.error(`Response body:`, res.body || res.text || 'No response body');
    }

    // 确认状态码为 200
    expect(res.status).toBe(200);
    assert(res.body.params.id == mockId);
    assert(res.body.query.limit == mockLimit);
    assert(res.body.ctxTrailID == 'trail_001');
    assert(res.body.trailIDFunc == 'trail_002');
  });

  test('post test', async () => {
    const res = await agent
      .post(`/api/v1/test/${mockId}?limit=${mockLimit}`)
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
      .post(`/api/v1/test/${mockId}?limit=${mockLimit}`)
      .send({
        name: mockName,
      })
      .expect(200);
    assert(res.body.params.id == mockId);
    assert(res.body.query.limit == mockLimit);
    assert(res.body.body.name == mockName);
  });

  test('del test', async () => {
    const res = await agent.get(`/api/v1/test/${mockId}?limit=${mockLimit}`);
    // console.log('body', res.body);
    if (res.status !== 200) {
      console.error(`Request failed with status: ${res.status}`);
      console.error(`Response body:`, res.body || res.text || 'No response body');
    }

    // 确认状态码为 200
    expect(res.status).toBe(200);

    assert(res.body.params.id == mockId);
    assert(res.body.query.limit == mockLimit);
  });

  test('create post', async () => {
    const body: PostCreate = {
      title: 'test create post',
      text: 'hello word',
      rating: 0,
      email: 'test@gmail.com',
      site: 'www.aifreetime.com',
    };
    const res = await agent.post(`/api/v1/post`).send(body);
    // console.log('body', res.body);
    if (res.status !== 200) {
      console.error(`Request failed with status: ${res.status}`);
      console.error(`Response body:`, res.body || res.text || 'No response body');
    }

    // 确认状态码为 200
    expect(res.status).toBe(200);
    assert(res.body.title == body.title);
  });
});
