import connectMongoDB from "../../config/mongoDatabase";
import { UsersRepository } from "../../repositories/UsersRepository";
import IUser from "../../../interfaces/models/IUser";
import { CustomersRepository } from "../../repositories/CustomersRepository";

interface IRequest {
  user: IUser;
}

export default class GetCustomersService {
  public async execute({ user }: IRequest): Promise<Object[]> {
    const usersRepository = new UsersRepository();
    usersRepository.checkIfHasPermission(user, "customers", "read");

    const customersRepository = new CustomersRepository();

    const { db } = await connectMongoDB();
    const customers = await db
      .collection(customersRepository.collection)
      .find({ _deletedAt: null })
      .toArray();

    console.log(customers);

    customers.map((customer) => {
      delete customer.password;
    });

    return customers;
  }
}
