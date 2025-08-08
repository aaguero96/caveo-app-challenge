import {
  description,
  request,
  responses,
  security,
  summary,
  tags,
} from 'koa-swagger-decorator';
import { createErrorDescription } from './utils';

const tag = tags(['users']);

export class GetUsersSwagger {
  @tag
  @description('get paginated users just for admin users')
  @request('get', '/api/users')
  @summary('get paginated users')
  @security([{ access_token: [] }])
  @responses({
    200: {
      desription: 'success',
      type: 'object',
      properties: {
        users: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              isOnboarded: { type: 'boolean' },
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: { type: 'string', format: 'date-time' },
            },
          },
        },
        page: { type: 'number' },
        itemsInPage: { type: 'number' },
        itemsPerPage: { type: 'number' },
        totalItems: { type: 'number' },
        totalPages: { type: 'number' },
      },
    },
    ...createErrorDescription({ status: 400 }),
    ...createErrorDescription({ status: 401 }),
    ...createErrorDescription({ status: 404 }),
    ...createErrorDescription({ status: 500 }),
  })
  async getUsers() {}
}
