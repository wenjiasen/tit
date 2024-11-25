import { Controller, HttpMethod, Router, PBody, PParam, PQuery, TitController, PServer, PContext, PFunction } from '../../../src';
import Joi from 'joi';
import { TestServer } from '../server';

@Controller()
export default class TestController extends TitController {
  @Router({
    method: HttpMethod.GET,
    path: '/test/:id',
  })
  public async get(
    @PParam(Joi.string().required()) id: string,
    @PQuery(Joi.number().integer()) limit: number,
    @PServer(TestServer) server: TestServer,
    @PContext(Joi.string()) trailID: string,
    @PFunction<string>({
      kind: 'ctx',
      value: async () => {
        return Joi.string()
          .required()
          .external((value) => {
            return value;
          });
      },
    })
    trailIDFunc: string,
  ) {
    this.ctx.body = server.copy({
      params: { id },
      query: {
        limit,
      },
      ctxTrailID: trailID,
      trailIDFunc: trailIDFunc,
    });
  }

  @Router({
    method: HttpMethod.POST,
    path: '/test/:id',
  })
  public async post(
    @PParam(Joi.string().required()) id: string,
    @PQuery(Joi.number().integer()) limit: number,
    @PBody({
      name: Joi.string().required(),
    })
    body: {
      name: string;
    },
  ) {
    this.ctx.body = {
      params: { id },
      query: {
        limit,
      },
      body,
    };
  }

  @Router({
    method: HttpMethod.PUT,
    path: '/test/:id',
  })
  public async put(
    @PParam(Joi.string().required()) id: string,
    @PQuery(Joi.number().integer()) limit: number,
    @PBody({
      name: Joi.string().required(),
    })
    body: {
      name: string;
    },
  ) {
    this.ctx.body = {
      params: { id },
      query: {
        limit,
      },
      body,
    };
  }

  @Router({
    method: HttpMethod.DEL,
    path: '/test',
  })
  public async del(@PParam(Joi.string().required()) id: string, @PQuery(Joi.number().integer()) limit: number) {
    this.ctx.body = {
      params: { id },
      query: {
        limit,
      },
    };
  }
}
