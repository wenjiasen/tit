import { JSONSchemaType } from 'ajv';
import { Controller, HttpMethod, OpenAPIRouter, TitController } from '../../../src';

interface MyQuery {
  limit: number;
  offset: number;
}

interface MyParams {
  id: string;
}

interface MyBody {
  name: string;
}

interface MyResponseBody {
  params: {
    id: string;
  };
  query: MyQuery;
  body: MyBody;
}

const responseBodySchema: JSONSchemaType<MyResponseBody> = {
  type: 'object',
  properties: {
    query: {
      type: 'object',
      properties: {
        limit: { type: 'integer', default: 20 },
        offset: { type: 'integer', default: 0 },
      },
      required: ['limit', 'offset'],
    },
    params: {
      type: 'object',
      properties: {
        id: { type: 'string' },
      },
      required: ['id'],
    },
    body: {
      type: 'object',
      properties: {
        name: { type: 'string' },
      },
      required: ['name'],
    },
  },
  required: ['query', 'params', 'body'],
  additionalProperties: false,
};

const reqSchema: JSONSchemaType<{
  params: {
    id: string;
  };
  query: MyQuery;
  body: MyBody;
}> = {
  type: 'object',
  properties: {
    query: {
      type: 'object',
      properties: {
        limit: { type: 'integer', default: 20 },
        offset: { type: 'integer', default: 0 },
      },
      required: ['limit', 'offset'],
    },
    params: {
      type: 'object',
      properties: {
        id: { type: 'string' },
      },
      required: ['id'],
    },
    body: {
      type: 'object',
      properties: {
        name: { type: 'string' },
      },
      required: ['name'],
    },
  },
  required: [],
  additionalProperties: false,
};

@Controller({ prefix: '/openapi' })
export default class TestController extends TitController {
  @OpenAPIRouter({
    method: HttpMethod.POST,
    path: '/test/:id',
    requestType: reqSchema,
    responseType: responseBodySchema,
  })
  public async openapiRouterTest(requestData: { query: MyQuery; params: MyParams; body: MyBody }) {
    return requestData;
  }
}
