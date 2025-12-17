import { IRepository } from "../../outbound/repository";

export class BaseService {
  repository;

  constructor(repository: IRepository) {
    this.repository = repository;
  }
}
