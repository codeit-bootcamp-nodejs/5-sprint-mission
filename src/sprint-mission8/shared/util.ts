import { IConfigUtil } from "./util/config.util";
import { IFileUtil } from "./util/file.util";
import { ITokenUtil } from "./util/token.util";

export interface IUtils {
  config: IConfigUtil;
  file: IFileUtil;
  token: ITokenUtil;
};

export class Utils implements IUtils {
  constructor(
    public readonly config: IConfigUtil,
    public readonly file: IFileUtil,
    public readonly token: ITokenUtil,
  ) { }
}