import { IService } from "../domain/service";

export class BaseController {
  service;

  constructor(service: IService) {
    this.service = service;
  }
}
