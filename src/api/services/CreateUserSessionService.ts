import AppError from "../../errors/AppError";
import { hash, compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import authConfig from "../config/auth";

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  user: {
    id: string;
    name: string;
    email: string;
  };
  token: string;
}

export default class CreateUserSessionsService {
  public async execute({ email, password }: IRequest): Promise<IResponse> {
    const usersRepository = {
      findByEmail: async (email: string) => {
        if (email !== "admin") return null;

        return {
          id: "1",
          name: "Admin",
          email: "admin",
          password: await hash(password, 8),
        };
      },
    };

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

    return { user, token };
  }
}
