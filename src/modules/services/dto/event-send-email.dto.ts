export class EventSendEmailDto {
  constructor(
    public readonly notificationEmailIdList: string[],
    public readonly body: string,
    public readonly htmlBodyContent: string,
  ) {}

  toString() {
    return JSON.stringify({
      notificationEmailIdList: this.notificationEmailIdList,
      body: this.body,
      htmlBodyContent: this.htmlBodyContent,
    });
  }
}
