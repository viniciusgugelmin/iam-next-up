import connectMongoDB from "../../config/mongoDatabase";
import { UsersRepository } from "../../repositories/UsersRepository";
import IUser from "../../../interfaces/IUser";
import { ObjectId } from "mongodb";
import AppError from "../../../errors/AppError";
import { ProductsCategoriesRepository } from "../../repositories/ProductsCategoriesRepository";

interface IRequest {
  user: IUser;
  productsCategoryId: string;
}

export default class GetProductsCategoryService {
  public async execute({
    user,
    productsCategoryId,
  }: IRequest): Promise<Object> {
    const usersRepository = new UsersRepository();
    usersRepository.checkIfHasPermission(user, "users", "read");

    const productsCategoriesRepository = new ProductsCategoriesRepository();

    try {
      const { db } = await connectMongoDB();
      const productsCategoryToReturn = await db
        .collection(productsCategoriesRepository.collection)
        .findOne({ _id: new ObjectId(productsCategoryId) });

      if (!productsCategoryToReturn) {
        throw new Error();
      }

      return productsCategoryToReturn;
    } catch (error) {
      throw new AppError("Products category not found", 404);
    }
  }
}
