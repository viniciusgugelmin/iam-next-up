import AppError from "../../errors/AppError";
import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import authConfig from "../config/auth";
import { UsersRepositories } from "../../repositories/UsersRepositories";

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  user: {
    id: string;
    name: string;
    email: string;
    roles: string[];
  };
  token: string;
}

export default class CreateUserSessionsService {
  public async execute({ email, password }: IRequest): Promise<IResponse> {
    const usersRepository = new UsersRepositories();
    const user = await usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError("Incorrect email/password combination", 401);
    }

    const hashedPassword = await compare(password, user.password);
    if (!hashedPassword) {
      throw new AppError("Incorrect email/password combination", 401);
    }

    const token = sign({}, authConfig.jwt.secret, {
      subject: user.id,
      expiresIn: authConfig.jwt.expiresIn,
    });

    const userResponse = { ...user, password: undefined };

    return { user: userResponse, token };
  }
}
