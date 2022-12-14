import { HttpException, HttpStatus } from '@nestjs/common';
import { IErrorResponse } from '../responses/error.response';

export default class BaseException extends HttpException {
  constructor(
    private httpStatus: HttpStatus,
    private code: string,
    public message: string,
    private params: Record<string, any> = {},
  ) {
    super(message, httpStatus);
  }

  public getHttpCode() {
    return this.httpStatus;
  }

  public getResponse(): IErrorResponse {
    return {
      code: this.code,
      message: this.message,
      params: this.params,
    };
  }
}
