import { Injectable } from "@nestjs/common";

@Injectable()
export class DashboardService {
  hallo() {
    return "Hallo ini Dashboard Services"
  }
}