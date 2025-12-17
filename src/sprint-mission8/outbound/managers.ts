import { IManagers } from "../domain/port/managers.interface";
import { IHashManager } from "../domain/port/managers/hash.manager.interface";

export class Managers implements IManagers {
  constructor(public readonly hash: IHashManager) {}
}