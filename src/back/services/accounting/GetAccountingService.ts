import { UsersRepository } from "../../repositories/UsersRepository";
import IUser from "../../../interfaces/models/IUser";
import AppError from "../../../errors/AppError";
import { AccountingRepository } from "../../repositories/AccountingRepository";
import connectMongoDB from "../../config/mongoDatabase";

interface IRequest {
  user: IUser;
}

export default class GetAccountingService {
  public async execute({ user }: IRequest): Promise<Object> {
    const usersRepository = new UsersRepository();
    usersRepository.checkIfHasPermission(user, "users", "read");

    const accountingRepository = new AccountingRepository();
    const { db } = await connectMongoDB();

    try {
      return await db
        .collection(accountingRepository.collection)
        .find({})
        .toArray();
    } catch (error) {
      throw new AppError("Accounting not found", 404);
    }
  }
}
