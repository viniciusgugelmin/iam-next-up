import connectMongoDB from "../../config/mongoDatabase";
import { UsersRepository } from "../../repositories/UsersRepository";
import IUser from "../../../interfaces/models/IUser";
import AppError from "../../../errors/AppError";
import User from "../../models/User";
import { CustomersRepository } from "../../repositories/CustomersRepository";
import Customer from "../../models/Customer";

interface IRequest {
  user: IUser;
  customerToUpdate: any;
  customerToUpdateData: any;
}

export default class UpdateCustomerService {
  public async execute({
    user,
    customerToUpdate,
    customerToUpdateData,
  }: IRequest): Promise<Object> {
    const usersRepository = new UsersRepository();
    usersRepository.checkIfHasPermission(user, "customers", "update");

    const { db } = await connectMongoDB();

    const _customerToUpdate = new Customer();
    for (const key in customerToUpdateData) {
      if (customerToUpdateData[key]) {
        // @ts-ignore
        _customerToUpdate[key] = customerToUpdateData[key];
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
              { document: _customerToUpdate.document },
              { email: _customerToUpdate.email },
            ],
          },
        ],
      });

    if (
      hasCustomerWithSameDocumentOrEmail &&
      hasCustomerWithSameDocumentOrEmail.document ===
        _customerToUpdate.document &&
      hasCustomerWithSameDocumentOrEmail.document !== customerToUpdate.document
    ) {
      throw new AppError("Document already in use", 400);
    }

    if (
      hasCustomerWithSameDocumentOrEmail &&
      hasCustomerWithSameDocumentOrEmail.email === _customerToUpdate.email &&
      hasCustomerWithSameDocumentOrEmail.email !== customerToUpdate.email
    ) {
      throw new AppError("Email already in use", 400);
    }

    if (_customerToUpdate.password?.trim() === "") {
      _customerToUpdate.password = customerToUpdate.password;
    } else {
      _customerToUpdate.password = await customersRepository.hashPassword(
        _customerToUpdate.password
      );
    }

    await db.collection(customersRepository.collection).updateOne(
      { _id: customerToUpdate._id },
      {
        $set: {
          ..._customerToUpdate,
          _createdAt: customerToUpdate._createdAt,
        },
      }
    );

    // @ts-ignore
    _customerToUpdate.password && delete _customerToUpdate.password;

    return {
      ..._customerToUpdate,
      _createdAt: customerToUpdate._createdAt,
    };
  }
}
