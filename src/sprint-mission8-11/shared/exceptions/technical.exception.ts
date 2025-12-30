import { TechnicalExceptionTable, TechnicalExceptionType } from "../const/technical.exception.info";

export class TechnicalException extends Error {
  public readonly type: TechnicalExceptionType;
  public readonly error?: Error;
  public readonly meta?: unknown;

  constructor(options: {
    message?: string;
    type: TechnicalExceptionType;
    error: Error;
  }) {
    super(options.message ?? TechnicalExceptionTable[options.type]);
    this.type = options.type;
    this.error = options.error;
  }
}
