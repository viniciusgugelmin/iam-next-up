import connectMongoDB from "../../config/mongoDatabase";
import { UsersRepository } from "../../repositories/UsersRepository";
import IUser from "../../../interfaces/IUser";
import { RolesRepository } from "../../repositories/RolesRepository";

interface IRequest {
  user: IUser;
}

export default class GetRolesService {
  public async execute({ user }: IRequest): Promise<Object[]> {
    const usersRepository = new UsersRepository();
    usersRepository.checkIfHasPermission(user, "roles", "read");

    const rolesRepository = new RolesRepository();

    const { db } = await connectMongoDB();
    const roles = await db
      .collection(rolesRepository.collection)
      .find({ _deletedAt: null })
      .toArray();

    return roles;
  }
}
