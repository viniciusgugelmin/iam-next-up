import { NextApiRequest } from "next";
import AppError from "../../errors/AppError";
import { verify } from "jsonwebtoken";
import authConfig from "../config/auth";
import { UsersRepository } from "../repositories/UsersRepository";
import connectMongoDB from "../config/mongoDatabase";
import { ObjectId } from "mongodb";

interface IRequest {
  req: NextApiRequest;
}

export default class GetAuthenticatedUserService {
  public async execute({ req }: IRequest): Promise<object> {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new AppError("Auth token is missing", 422);
    }

    const [, token] = authHeader.split(" ");

    const decodedToken = verify(token, authConfig.jwt.secret);

    const { sub } = decodedToken;

    const usersRepository = new UsersRepository();
    const { db } = await connectMongoDB();
    const user = await db
      .collection(usersRepository.collection)
      .findOne({ _id: new ObjectId(sub as string) });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    return user;
  }
}
