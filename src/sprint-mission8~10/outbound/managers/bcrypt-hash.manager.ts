import bcrypt from "bcrypt";
import { IConfigUtil } from "../../shared/utils/config.util";
import { IHashManager } from "../../domain/port/managers/hash.manager.interface";

export class BcryptHashManager implements IHashManager {
  private readonly _saltLevel;

  constructor(configManager: IConfigUtil) {
    this._saltLevel = configManager.getParsed().SALT_LEVEL;
  }

  async hash(plainString: string): Promise<string> {
    return await bcrypt.hash(plainString, this._saltLevel);
  };

   async compare(plainString: string, hashedString: string): Promise<boolean>{
    return await bcrypt.compare(plainString, hashedString);
  };
}
