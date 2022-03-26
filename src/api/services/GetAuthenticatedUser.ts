import { NextApiRequest } from "next";
import AppError from "../../errors/AppError";
import { verify } from "jsonwebtoken";
import authConfig from "../config/auth";
import IAuthResponse from "../interfaces/IAuthResponse";

interface IRequest {
  req: NextApiRequest;
}

export default class GetAuthenticatedUser {
  public async execute({ req }: IRequest): Promise<AppError | IAuthResponse> {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return new AppError("Auth token is missing");
    }

    const [, token] = authHeader.split(" ");

    try {
      const decodedToken = verify(token, authConfig.jwt.secret);

      const { sub } = decodedToken;

      return { user: sub } as IAuthResponse;
    } catch (err) {
      return new AppError(err as string);
    }
  }
}
