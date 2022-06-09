import connectMongoDB from "../../config/mongoDatabase";
import { UsersRepository } from "../../repositories/UsersRepository";
import IUser from "../../../interfaces/models/IUser";
import { ObjectId } from "mongodb";
import AppError from "../../../errors/AppError";
import Customer from "../../models/Customer";
import { CustomersRepository } from "../../repositories/CustomersRepository";

interface IRequest {
  user: IUser;
  customerId: string;
}

export default class DeleteCustomerService {
  public async execute({ user, customerId }: IRequest): Promise<Object> {
    const usersRepository = new UsersRepository();
    usersRepository.checkIfHasPermission(user, "customers", "delete");

    const customersRepository = new CustomersRepository();

    const { db } = await connectMongoDB();
    const customerToDelete = await db
      .collection(customersRepository.collection)
      .findOne({ _id: new ObjectId(customerId) });

    if (!customerToDelete) {
      throw new AppError("Customer not found", 404);
    }

    if (customerToDelete._deletedAt) {
      throw new AppError("Customer already deleted", 404);
    }

    const deletedCustomerData = new Customer();

    await db.collection(customersRepository.collection).updateOne(
      { _id: new ObjectId(customerId) },
      {
        $set: deletedCustomerData.delete(),
      }
    );

    return customerToDelete;
  }
}
