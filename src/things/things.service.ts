import { Injectable } from "@nestjs/common";

@Injectable()
export class ThingsService {
  hallo() {
    return "Hallo ini Things Services"
  }
}