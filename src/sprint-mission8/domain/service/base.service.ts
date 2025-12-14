import { IUtils } from "../../shared/util";
import { IManagers } from "../port/managers.interface";
import { IRepos } from "../port/repos.interface";

export class BaseService {
  
  constructor(
    protected _repos: IRepos,
    protected _managers: IManagers,
    protected _utils: IUtils
  ) {
  }
}