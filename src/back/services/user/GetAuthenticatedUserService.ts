import { NextApiRequest } from "next";
import AppError from "../../../errors/AppError";
import { verify } from "jsonwebtoken";
import authConfig from "../../config/auth";
import { UsersRepository } from "../../repositories/UsersRepository";
import connectMongoDB from "../../config/mongoDatabase";
import { ObjectId } from "mongodb";
import IUser from "../../../interfaces/models/IUser";

interface IRequest {
  req: NextApiRequest;
}

export default class GetAuthenticatedUserService {
  public async execute({ req }: IRequest): Promise<IUser> {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new AppError("Auth token is missing", 422);
    }

    let decodedToken = null;

    try {
      const [, token] = authHeader.split(" ");

      decodedToken = verify(token, authConfig.jwt.secret);
    } catch (err) {
      throw new AppError("Invalid token", 422);
    }

    const { sub } = decodedToken;

    const usersRepository = new UsersRepository();
    const { db } = await connectMongoDB();
    const user = await db
      .collection(usersRepository.collection)
      .findOne({ _id: new ObjectId(sub as string) });

    if (!user) {
      throw new AppError("Invalid token", 404);
    }

    if (!user._active) {
      throw new AppError("Your user is not active", 401);
    }

    return user as unknown as IUser;
  }
}
