import type { NextApiResponse } from "next";
import AppError from "../../errors/AppError";
import InternalServerError from "../../errors/InternalServerError";

interface IRequest {
  res: NextApiResponse;
  error: unknown;
}

export default class SendRequesError {
  public execute({ res, error }: IRequest) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ message: error.message });
    }

    const { message, statusCode } = new InternalServerError();
    return res.status(statusCode).json({ message: message });
  }
}
