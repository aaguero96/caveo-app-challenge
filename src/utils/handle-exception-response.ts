import { ParameterizedContext } from 'koa';
import { Exception } from '../exceptions';

export const handleExceptionResponse = (
  err: unknown,
  ctx: ParameterizedContext,
) => {
  if (err instanceof Exception) {
    ctx.status = err.status;
    ctx.body = {
      status: err.status,
      errorCode: err.errorCode,
      message: err.message,
      body: err.body && err.body,
    };
    return;
  }

  let errorMessage;
  if (typeof err === 'object' && err && 'message' in err) {
    if (typeof err.message === 'string') {
      try {
        errorMessage = JSON.parse(err.message);
      } catch {
        errorMessage = err.message;
      }
    } else {
      errorMessage = err.message;
    }
  }

  ctx.status = 500;
  ctx.body = {
    status: 500,
    errorCode: 'internal_server_error',
    message: errorMessage,
    body: err,
  };
};
