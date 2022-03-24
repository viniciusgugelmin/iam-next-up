import { IError } from "./interfaces/IError";

export default class RouteNotFoundError implements IError {
  public readonly message: string;
  public readonly statusCode: number;

  constructor(message: string = "Route not found", statusCode = 404) {
    this.message = message;
    this.statusCode = statusCode;
  }
}
