import connectMongoDB from "../../config/mongoDatabase";
import { NextApiRequest } from "next";
import AppError from "../../../errors/AppError";
import { UsersRepository } from "../../repositories/UsersRepository";
import User from "../../models/User";
import IUser from "../../../interfaces/IUser";
import { getAdminRole, getCommonRole } from "../../models/Role";
import { RolesRepository } from "../../repositories/RolesRepository";
import IRole from "../../../interfaces/IRole";

interface IRequest {
  req: NextApiRequest;
}

interface IResponse {
  user: IUser;
  roles: IRole[];
}

export default class InitDatabaseService {
  public async execute({ req }: IRequest): Promise<IResponse> {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new AppError("Auth token is missing", 422);
    }

    const [, token] = authHeader.split(" ");

    if (token !== process.env.NEXT_PUBLIC_SESSION_ADMIN_PASSWORD) {
      throw new AppError("Invalid token", 422);
    }

    const { db } = await connectMongoDB();
    const collections = await db.collections();

    for (const collection of collections) {
      await collection.drop();
    }

    const rolesRepository = new RolesRepository();
    const rolesToInsert = [getAdminRole(), getCommonRole()];
    await db.collection(rolesRepository.collection).insertMany(rolesToInsert);

    const usersRepository = new UsersRepository();
    const user = new User();
    user.document = "00000000000";
    user.name = "Admin";
    user.email = "admin@admin.com";
    user.password = await usersRepository.hashPassword("admin");
    user.gender = "Prefer not to say";
    user.role = {
      name: getAdminRole().name,
    };

    user.role = await usersRepository.checkAndGetIfUserRoleExists(
      db,
      user.role.name
    );

    await db.collection(usersRepository.collection).insertOne(user);

    return { user, roles: rolesToInsert };
  }
}
