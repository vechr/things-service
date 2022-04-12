import BaseResponse from './base.response';

interface IListSuccessResponse<T> {
  total: number;
  data: T[];
  page?: number;
  limit?: number;
}

export default class SuccessResponse<T = any> extends BaseResponse<
  T | IListSuccessResponse<T>,
  null
> {
  constructor(public message: string, result: T | IListSuccessResponse<T>) {
    super(message, result, null);
  }
}
