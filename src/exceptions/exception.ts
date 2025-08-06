export class Exception extends Error {
  status: number;
  errorCode: string;
  body?: object | undefined;

  constructor(excepitonData: {
    status: number;
    errorCode: string;
    message: string;
    body?: object;
  }) {
    super(excepitonData.message);

    this.status = excepitonData.status;
    this.errorCode = excepitonData.errorCode;
    this.body = excepitonData.body;
  }
}
