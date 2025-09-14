import { Exception } from "../../common/exception.js";

export class BaseValidator {
  headers;
  body;
  params;
  query;
  file;
  files;
  constructor({ headers = {}, body = {}, params = {}, query = {}, file = {}, files = {} }) {
    this.headers = headers;
    this.body = body;
    this.params = params;
    this.query = query;
    this.file = file;
    this.files = files;
  }

  isString(value) {
    return typeof value === "string";
  }
  isEmpty(value) {
    return value === undefined || value === null || value === "";
  }
  isInt(value) {
    return typeof value === "number";
  }
  validate() {
    throw new Error("validate 함수를 구현하세요.");
  }
}
