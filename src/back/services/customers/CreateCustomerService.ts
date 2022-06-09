import connectMongoDB from "../../config/mongoDatabase";
import { UsersRepository } from "../../repositories/UsersRepository";
import IUser from "../../../interfaces/models/IUser";
import AppError from "../../../errors/AppError";
import { CustomersRepository } from "../../repositories/CustomersRepository";
import Customer from "../../models/Customer";
import ICustomer from "../../../interfaces/models/ICustomer";

interface IRequest {
  user: IUser;
  newCustomer: any;
}

export default class CreateCustomerService {
  public async execute({ user, newCustomer }: IRequest): Promise<ICustomer> {
    const usersRepository = new UsersRepository();
    usersRepository.checkIfHasPermission(user, "customers", "create");

    const { db } = await connectMongoDB();

    const _newCustomer = new Customer();
    for (const key in newCustomer) {
      if (newCustomer[key]) {
        // @ts-ignore
        _newCustomer[key] = newCustomer[key];
      }
    }

    const customersRepository = new CustomersRepository();

    const hasCustomerWithSameDocumentOrEmail = await db
      .collection(customersRepository.collection)
      .findOne({
        $and: [
          { _deletedAt: null },
          {
            $or: [
              { document: _newCustomer.document },
              { email: _newCustomer.email },
            ],
          },
        ],
      });

    if (
      hasCustomerWithSameDocumentOrEmail &&
      hasCustomerWithSameDocumentOrEmail.document === _newCustomer.document
    ) {
      throw new AppError("Document already in use", 400);
    }

    if (
      hasCustomerWithSameDocumentOrEmail &&
      hasCustomerWithSameDocumentOrEmail.email === _newCustomer.email
    ) {
      throw new AppError("Email already in use", 400);
    }

    _newCustomer.password = await customersRepository.hashPassword(
      _newCustomer.password
    );

    await db.collection(customersRepository.collection).insertOne(_newCustomer);

    return _newCustomer;
  }
}
