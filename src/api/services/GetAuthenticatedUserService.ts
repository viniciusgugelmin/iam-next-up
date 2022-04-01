import { NextApiRequest } from "next";
import AppError from "../../errors/AppError";
import { verify } from "jsonwebtoken";
import authConfig from "../config/auth";
import IAuthResponse from "../../services/IAuthResponse";

interface IRequest {
  req: NextApiRequest;
}

export default class GetAuthenticatedUserService {
  public async execute({ req }: IRequest): Promise<IAuthResponse> {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new AppError("Auth token is missing", 422);
    }

    const [, token] = authHeader.split(" ");

    try {
      const decodedToken = verify(token, authConfig.jwt.secret);

      const { sub } = decodedToken;

      return { userId: sub } as IAuthResponse;
    } catch (error) {
      throw new AppError(error as string);
    }
  }
}
