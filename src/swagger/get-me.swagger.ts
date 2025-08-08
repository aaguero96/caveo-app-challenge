import {
  description,
  request,
  responses,
  security,
  summary,
  tags,
} from 'koa-swagger-decorator';
import { createErrorDescription } from './utils';
import { UserRoleEnum } from '../enums';

const tag = tags(['me']);

export class GetMeSwagger {
  @tag
  @description('get properties of my user based on token')
  @request('get', '/api/me')
  @summary('get my info')
  @security([{ access_token: [] }])
  @responses({
    200: {
      desription: 'success',
      type: 'object',
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        role: { type: 'string', enum: [UserRoleEnum], example: 'admin' },
        isOnboarded: { type: 'boolean' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
    ...createErrorDescription({ status: 400 }),
    ...createErrorDescription({ status: 401 }),
    ...createErrorDescription({ status: 404 }),
    ...createErrorDescription({ status: 500 }),
  })
  async getMe() {}
}
