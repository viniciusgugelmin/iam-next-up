import AppError from "../../errors/AppError";
import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import authConfig from "../config/auth";
import { UsersRepository } from "../../repositories/UsersRepository";
import connectMongoDB from "../config/mongoDatabase";

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  user: Object;
  token: string;
}

export default class CreateUserSessionsService {
  public async execute({ email, password }: IRequest): Promise<IResponse> {
    const usersRepository = new UsersRepository();
    const { db } = await connectMongoDB();
    const user = await db
      .collection(usersRepository.collection)
      .findOne({ email });

    if (!user) {
      throw new AppError("Incorrect email/password combination", 401);
    }

    const hashedPassword = await compare(password, user.password);
    if (!hashedPassword) {
      throw new AppError("Incorrect email/password combination", 401);
    }

    const token = sign({}, authConfig.jwt.secret, {
      subject: user._id.toString(),
      expiresIn: authConfig.jwt.expiresIn,
    });

    const userResponse = { ...user, password: undefined };

    return { user: userResponse, token };
  }
}
