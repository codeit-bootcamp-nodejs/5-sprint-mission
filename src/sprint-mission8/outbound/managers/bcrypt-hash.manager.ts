import bcrypt from "bcrypt";
import { IConfigManager } from "../../shared/util/config.manager";
import { IHashManager } from "../../domain/port/managers/i.hash.manager";

export class BcryptHashManager implements IHashManager {
  private readonly _saltLevel;

  constructor(configManager: IConfigManager) {
    this._saltLevel = configManager.getParsed().SALT_LEVEL;
  }

  async hash(plainString: string): Promise<string> {
    return await bcrypt.hash(plainString, this._saltLevel);
  };

   async compare(plainString: string, hashedString: string): Promise<boolean>{
    return await bcrypt.compare(plainString, hashedString);
  };
}
