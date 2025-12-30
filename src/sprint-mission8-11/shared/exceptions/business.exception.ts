import { BusinessExceptionTable, BusinessExceptionType } from "../const/business.exception.info";

export class BusinessException extends Error {
  public readonly statusCode: number;
  public readonly type: BusinessExceptionType;
  public readonly error?: Error;

  constructor(options: {
    message?: string;
    type: BusinessExceptionType;
    error?: Error;
  }) {
    super(options.message ?? BusinessExceptionTable[options.type].message);
    this.statusCode = BusinessExceptionTable[options.type].statusCode;
    this.type = options.type;
    this.error = options.error;
  }
}