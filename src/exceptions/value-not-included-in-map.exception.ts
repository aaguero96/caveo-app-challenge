import { Exception } from './exception';

export class ValueNotIncludedInMap extends Exception {
  constructor(data: { value: string }) {
    super({
      status: 500,
      errorCode: 'internal_server_error.value_not_in_map',
      message: `value ${data.value} not includded in map`,
    });
  }
}
