import { IRepos } from "../../outbound/repos";

export class BaseService {
  protected _repos;
  
  constructor(repos: IRepos) {
    this._repos = repos;
  }
}