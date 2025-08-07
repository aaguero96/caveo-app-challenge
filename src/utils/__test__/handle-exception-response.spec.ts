/* eslint-disable @typescript-eslint/no-explicit-any */

import { handleExceptionResponse } from '..';
import { Exception } from '../../exceptions';

describe('handleExceptionResponse', () => {
  describe('return error if is instance of Exception', () => {
    it('without body', () => {
      const ctx = {} as any;
      const err = new Exception({
        status: 400,
        errorCode: 'exception',
        message: 'mock message',
      });

      handleExceptionResponse(err, ctx);

      expect(ctx).toStrictEqual({
        status: 400,
        body: {
          status: 400,
          errorCode: 'exception',
          message: 'mock message',
          body: undefined,
        },
      });
    });

    it('with body', () => {
      const ctx = {} as any;
      const err = new Exception({
        status: 400,
        errorCode: 'exception',
        message: 'mock message',
        body: { mock: 'mock' },
      });

      handleExceptionResponse(err, ctx);

      expect(ctx).toStrictEqual({
        status: 400,
        body: {
          status: 400,
          errorCode: 'exception',
          message: 'mock message',
          body: { mock: 'mock' },
        },
      });
    });
  });

  describe('is generic error', () => {
    it('err.message is JSON', () => {
      const ctx = {} as any;
      const err = new Error(
        JSON.stringify({
          message: 'mock-message',
        }),
      );

      handleExceptionResponse(err, ctx);

      expect(ctx).toStrictEqual({
        status: 500,
        body: {
          status: 500,
          errorCode: 'internal_server_error',
          message: {
            message: 'mock-message',
          },
          body: new Error(
            JSON.stringify({
              message: 'mock-message',
            }),
          ),
        },
      });
    });

    it('err.message is string', () => {
      const ctx = {} as any;
      const err = new Error('mock-message');

      handleExceptionResponse(err, ctx);

      expect(ctx).toStrictEqual({
        status: 500,
        body: {
          status: 500,
          errorCode: 'internal_server_error',
          message: 'mock-message',
          body: new Error('mock-message'),
        },
      });
    });

    it('err.message is array', () => {
      const ctx = {} as any;
      const err = { message: ['mock-message'] } as any;

      handleExceptionResponse(err, ctx);

      expect(ctx).toStrictEqual({
        status: 500,
        body: {
          status: 500,
          errorCode: 'internal_server_error',
          message: ['mock-message'],
          body: { message: ['mock-message'] },
        },
      });
    });

    it('message is not in err', () => {
      const ctx = {} as any;
      const err = { mock: 'mock' } as any;

      handleExceptionResponse(err, ctx);

      expect(ctx).toStrictEqual({
        status: 500,
        body: {
          status: 500,
          errorCode: 'internal_server_error',
          message: undefined,
          body: {
            mock: 'mock',
          },
        },
      });
    });
  });
});
