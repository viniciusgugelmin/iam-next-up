import { IError } from "./interfaces/IError";

export default class InternalServerError implements IError {
  public readonly message: string;
  public readonly statusCode: number;

  constructor(message: string = "Internal server error", statusCode = 500) {
    this.message = message;
    this.statusCode = statusCode;
  }
}
