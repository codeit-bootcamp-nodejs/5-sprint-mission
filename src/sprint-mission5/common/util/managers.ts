import { ConfigManager, IConfigManager } from "./config.manager";
import { FileManager, IFileManager } from "./file.manager";
import { HashManager, IHashManager } from "./hash.manager";
import { ITokenManager, TokenManager } from "./token.manager";

const configManager = new ConfigManager();

export interface IManagers {
  config: IConfigManager;
  hash: IHashManager;
  file: IFileManager;
  token: ITokenManager;
};

export const managers : IManagers = {
  config: configManager,
  hash: new HashManager(configManager),
  file: new FileManager(),
  token: new TokenManager(configManager),
};
