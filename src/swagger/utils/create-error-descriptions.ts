export const createErrorDescription = (error: {
  status: 400 | 401 | 403 | 404 | 409 | 500;
}): {
  [status: number]: {
    description: string;
    type: 'object';
    properties: {
      status: { type: 'string' };
      errorCode: { type: 'string' };
      message: { type: 'string' };
      body: { type: 'string' };
    };
  };
} => {
  const mapperDescription: { [status: number]: string } = {
    400: 'bad_request',
    401: 'unauthorized',
    403: 'forbidden',
    404: 'not_found',
    409: 'conflict',
    500: 'internal_server_error',
  };

  return {
    [error.status]: {
      description: mapperDescription[error.status] || 'internal_server_error',
      type: 'object',
      properties: {
        status: { type: 'string' },
        errorCode: { type: 'string' },
        message: { type: 'string' },
        body: { type: 'string' },
      },
    },
  };
};
