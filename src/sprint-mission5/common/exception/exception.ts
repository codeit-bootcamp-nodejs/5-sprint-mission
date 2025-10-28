import { EXCEPTIONS } from "../const/exception.info";

export type ExceptionInfoType = {
  statusCode: number,
  message: string
}
export type ValueType = string | number | boolean;

export class Exception extends Error {
  statusCode : number;
  originalErr?: unknown;

  constructor(
    {
      info,
      message,
      value,
      originalErr
    } :
    {
    info? : ExceptionInfoType,
    message?: string,
    value? : ValueType,
    originalErr?: unknown
  }) {
    
    let finalMessage = info?.message ?? message ?? "알 수 없는 에러입니다.";

    if (value) {
      finalMessage = finalMessage.replace(/$\{value\}/g, String(value));
    }

    super(finalMessage);
    this.statusCode = info?.statusCode ?? 500;
    this.originalErr = originalErr

    Object.setPrototypeOf(this, Exception.prototype);
  }
}
