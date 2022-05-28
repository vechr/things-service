export class QueryCreateEventDto {
  constructor(
    public readonly dashboardId: string,
    public readonly deviceId: string,
    public readonly topicId: string,
    public readonly topic: string,
  ) {}

  toString() {
    return JSON.stringify({
      dashboardId: this.dashboardId,
      deviceId: this.deviceId,
      topicId: this.topicId,
      topic: this.topic,
    });
  }
}
