import { IRepos } from "../../04-repo/repos";

export class BaseService {
  protected _repos;
  
  constructor(repos: IRepos) {
    this._repos = repos;
  }
}