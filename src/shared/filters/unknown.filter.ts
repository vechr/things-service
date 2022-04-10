import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { UnknownException } from "../exceptions/common.exception";
import ErrorResponse from "../responses/error.response";
import log from "../utils/log.util";

@Catch()
export default class UnknownExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost): void {
    if (!(exception instanceof HttpException)) {
      log.fatal('unhandled error', exception);
    } else {
      log.error('known error', exception);
    }

    const ctx = host.switchToHttp();
    const res = ctx.getResponse();
    const { status, response } = this.prepareException(exception);

    res.status(status).send(response);
  }

  private prepareException(exception: any): {
    status: HttpStatus;
    response: ErrorResponse;
  } {
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const data = exception.getResponse();

      const errMessage =
        typeof data === 'object'
          ? (data as { error: string }).error || exception.message
          : exception.message;

      const response = new ErrorResponse(
        errMessage,
        typeof data === 'string'
          ? { code: 'KNW000', message: data, params: {} }
          : {
              code: 'KNW000',
              message: errMessage,
              params: data,
            },
      );

      return { status, response };
    }

    const error = new UnknownException();

    const status = error.getHttpCode();
    const response = new ErrorResponse('server error', error.getResponse());

    return { status, response };
  }
}