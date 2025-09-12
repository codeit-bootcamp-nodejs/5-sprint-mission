export const EXCEPTIONS = {

}

export class Exception extends Error {
  constructor(key) {
    const errInfo = EXCEPTIONS[key];
    super(errInfo.message);
    this.statusCode = errInfo.statusCode;
  }
}