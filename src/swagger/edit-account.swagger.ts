import {
  body,
  description,
  request,
  responses,
  security,
  summary,
  tags,
} from 'koa-swagger-decorator';
import { createErrorDescription, createSwaggerValidations } from './utils';
import { UserRoleEnum } from '../enums';

const tag = tags(['edit-account']);

export class EditAccountSwagger {
  @tag
  @description(
    'edit name and role of user, "admin" update everyone name and everyone (except itself) role and "usuário" just change name of itself. After change name isOnboarding field will be marked as true',
  )
  @request('post', '/api/edit-account')
  @summary('update user info (name and role)')
  @security([{ access_token: [] }])
  @body({
    userId: {
      type: 'string',
      required: false,
      ...createSwaggerValidations(['uuid format']),
      example: 'test@test.com',
    },
    name: {
      type: 'string',
      required: false,
      ...createSwaggerValidations([
        'name must be at least first name + last name separated with space',
        'name should be trimmed',
        'name should be in uppercase',
      ]),
      example: 'ANDRE AGUERO',
    },
    role: {
      type: 'string',
      required: false,
      enum: [UserRoleEnum],
      example: 'admin',
    },
  })
  @responses({
    200: {
      desription: 'success',
      type: 'object',
      properties: {
        userId: { type: 'string' },
        name: { type: 'string' },
        role: { type: 'string', enum: [UserRoleEnum] },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
    ...createErrorDescription({ status: 400 }),
    ...createErrorDescription({ status: 401 }),
    ...createErrorDescription({ status: 404 }),
    ...createErrorDescription({ status: 500 }),
  })
  async editAccount() {}
}
