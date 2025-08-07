import z from 'zod';
import { Exception } from './exception';

export class ZodExcepiton extends Exception {
  constructor(err: z.ZodError) {
    super({
      status: 400,
      errorCode: 'zod.bad_request',
      message: 'zod validation error in request',
      body: JSON.parse(err.message),
    });
  }
}
