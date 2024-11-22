import { Controller, HttpMethod, Router, PBody, PParam, PQuery, TitController } from '../../../src';
import Joi from 'joi';

@Controller({})
export default class TestController extends TitController {
  @Router({
    method: HttpMethod.GET,
    path: '/test/:id',
  })
  public async get(@PParam(Joi.string().required()) id: string, @PQuery(Joi.number().integer()) limit: number) {
    this.ctx.body = {
      params: { id },
      query: {
        limit,
      },
    };
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
