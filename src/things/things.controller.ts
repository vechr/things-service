import { Controller, Get } from "@nestjs/common";
import { ThingsService } from "./things.service";

@Controller()
export class ThingsController {
  constructor(private readonly thingsServices: ThingsService) {}

  @Get()
  hallo() {
    return this.thingsServices.hallo();
  }
}