import { Injectable } from '@nestjs/common';

@Injectable()
export class TopicService {
  hallo() {
    return 'Hallo ini Topic Services';
  }
}
