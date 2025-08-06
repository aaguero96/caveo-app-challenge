import { Exception } from './exception';

export class EntityNotFoundException extends Exception {
  constructor(data: { tableName: string }) {
    super({
      status: 404,
      errorCode: 'entity.not_found',
      message: `entity ${data.tableName} not found`,
    });
  }
}
