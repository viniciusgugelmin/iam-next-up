import { NextApiRequest } from "next";
import AppError from "../../errors/AppError";
import { verify } from "jsonwebtoken";
import authConfig from "../config/auth";
import { UsersRepositories } from "../../repositories/UsersRepositories";
import IUser from "../../interfaces/IUser";

interface IRequest {
  req: NextApiRequest;
}

export default class GetAuthenticatedUserService {
  public async execute({ req }: IRequest): Promise<IUser> {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new AppError("Auth token is missing", 422);
    }

    const [, token] = authHeader.split(" ");

    try {
      const decodedToken = verify(token, authConfig.jwt.secret);

      const { sub } = decodedToken;

      const usersRepository = new UsersRepositories();
      const user = await usersRepository.call(() =>
        usersRepository.collection?.findOne({ _id: sub })
      );

      if (!user) {
        throw new AppError("User not found", 404);
      }

      return user;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      throw new AppError(error as string);
    }
  }
}
