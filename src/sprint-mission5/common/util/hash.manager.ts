import bcrypt from "bcrypt";
import { IConfigManager } from "./config.manager";

export interface IHashManager{
  hashingPassword : (password: string) => Promise<string>;
  verifyPassword: (plainPassword: string, hashedPasswordFromDB: string) => Promise<boolean>;
}
export class HashManager implements IHashManager{
  private _conifgManager;

  constructor(configManager: IConfigManager) {
    this._conifgManager = configManager;
  }

  hashingPassword = async (password: string) => {
    const salt = await bcrypt.genSalt(this._conifgManager.getParsed().SALT_LEVEL);
    return await bcrypt.hash(password, salt);
  };

  verifyPassword = async (plainPassword: string, hashedPasswordFromDB: string) => {
    return await bcrypt.compare(plainPassword, hashedPasswordFromDB);
  };
}
