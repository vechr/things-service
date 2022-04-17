import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';

export interface IContextParams {
  params: Record<string, any>;
  query: Record<string, any>;
  body: ReadableStream<Uint8Array> | null;
}

export interface IContext {
  headers: Headers;
  user: any;
  params: IContextParams;
}

export default class ContextInterceptor implements NestInterceptor {
  intercept(ctx: ExecutionContext, next: CallHandler): Observable<any> {
    const request = ctx.switchToHttp().getRequest<
      Request & {
        user: any;
        params: Record<string, any>;
        query: Record<string, any>;
        customContext: IContext;
      }
    >();
    const context: IContext = {
      headers: request.headers,
      user: request.user,
      params: {
        params: request.params,
        query: request.query,
        body: request.body,
      },
    };

    request.customContext = context;

    return next.handle();
  }
}
