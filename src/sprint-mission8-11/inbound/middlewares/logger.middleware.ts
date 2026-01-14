import morgan from "morgan";
import { IConfigUtil } from "../../shared/utils/config.util";

export class LoggerMiddleware {
  private _format: string;

  constructor(public readonly configUtil: IConfigUtil) {
    this._format =
      this.configUtil.getParsed().NODE_ENV === "development"
        ? "dev"
        : "combined";
  }

  handler = () => {
    return morgan(this._format);
  };
}
