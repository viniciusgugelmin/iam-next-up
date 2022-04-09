import type { NextApiResponse } from "next";
import AppError from "../../errors/AppError";
import InternalServerError from "../../errors/InternalServerError";

interface IRequest {
  res: NextApiResponse;
  error: unknown;
}

export default class SendRequestError {
  public execute({ res, error }: IRequest): void {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ message: error.message });
    }

    const { message, statusCode } = new InternalServerError();
    res.status(statusCode).json({ message: message });
  }
}
