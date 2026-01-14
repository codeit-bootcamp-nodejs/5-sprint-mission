import express from "express";
import { IConfigUtil } from "../../shared/utils/config.util";

export class JsonMiddleware {
  private _options;

  constructor(public readonly configUtil: IConfigUtil) {
    this._options = {
      limit: this.configUtil.getParsed().JSON_LIMIT,
    };
  }

  handler = () => {
    return express.json(this._options);
  };
}
