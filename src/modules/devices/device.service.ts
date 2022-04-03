import { Injectable } from "@nestjs/common";

@Injectable()
export class DeviceService {
  hallo() {
    return "Hallo ini Device Services"
  }
}