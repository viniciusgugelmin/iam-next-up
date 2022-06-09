import connectMongoDB from "../../config/mongoDatabase";
import { UsersRepository } from "../../repositories/UsersRepository";
import IUser from "../../../interfaces/models/IUser";
import { ObjectId } from "mongodb";
import AppError from "../../../errors/AppError";
import { CustomersRepository } from "../../repositories/CustomersRepository";

interface IRequest {
  user: IUser;
  customerId: string;
  returnPassword?: boolean;
}

export default class GetCustomerService {
  public async execute({
    user,
    customerId,
    returnPassword = false,
  }: IRequest): Promise<Object> {
    const usersRepository = new UsersRepository();
    usersRepository.checkIfHasPermission(user, "customers", "read");

    try {
      const customersRepository = new CustomersRepository();

      const { db } = await connectMongoDB();
      const customerToReturn = await db
        .collection(customersRepository.collection)
        .findOne({ _id: new ObjectId(customerId) });

      if (!customerToReturn) {
        throw new Error();
      }

      !returnPassword && delete customerToReturn.password;

      return customerToReturn;
    } catch (error) {
      throw new AppError("Customer not found", 404);
    }
  }
}
