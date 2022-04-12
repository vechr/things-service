export default class BaseResponse<R = any, E = any> {
  constructor(public message: string, private result: R, private error: E) {}

  public getResult() {
    return this.result;
  }

  public getError() {
    return this.error;
  }
}
