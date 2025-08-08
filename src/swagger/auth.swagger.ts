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

const tag = tags(['auth']);

export class AuthSwagger {
  @tag
  @description(
    'sign up users if is not created and sign in if is created, this endpoint creates user in aws cognite and in database.',
  )
  @request('post', '/api/auth')
  @summary('authenticate user (email + password) - sign in or sign up')
  @security([])
  @body({
    email: {
      type: 'string',
      required: true,
      ...createSwaggerValidations(['email format']),
      example: 'test@test.com',
    },
    password: {
      type: 'string',
      required: true,
      ...createSwaggerValidations([
        'password must be at least 8 characters long',
        'password must contain at least one number',
        'password must contain at least one uppercase letter',
        'password must contain at least one special character',
      ]),
      example: '123ABCde@',
    },
  })
  @responses({
    200: {
      desription: 'success',
      type: 'object',
      properties: {
        status: { type: 'number', example: 200 },
        type: { type: 'string', example: 'Bearer' },
        token: {
          type: 'string',
          example:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30',
        },
        expiresIn: { type: 'string', example: '3600s' },
      },
    },
    201: {
      description: 'created',
      type: 'object',
      properties: {
        status: { type: 'number', example: 201 },
        type: { type: 'string', example: 'Bearer' },
        token: {
          type: 'string',
          example:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30',
        },
        expiresIn: { type: 'string', example: '3600s' },
      },
    },
    ...createErrorDescription({ status: 400 }),
    ...createErrorDescription({ status: 401 }),
    ...createErrorDescription({ status: 409 }),
    ...createErrorDescription({ status: 500 }),
  })
  async auth() {}
}
