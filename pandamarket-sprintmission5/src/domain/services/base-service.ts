import { IRepository } from "../../repositories/repository";

export class BaseService {
  repository;

  constructor(repository: IRepository) {
    this.repository = repository;
  }
}
