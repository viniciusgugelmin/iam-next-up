import connectMongoDB from "../../config/mongoDatabase";
import { UsersRepository } from "../../repositories/UsersRepository";
import IUser from "../../../interfaces/models/IUser";
import { ObjectId } from "mongodb";
import AppError from "../../../errors/AppError";
import { ProductsRepository } from "../../repositories/ProductsRepository";

interface IRequest {
  user: IUser;
  productId: string;
}

export default class GetProductService {
  public async execute({ user, productId }: IRequest): Promise<Object> {
    const usersRepository = new UsersRepository();
    usersRepository.checkIfHasPermission(user, "products", "read");

    const productsRepository = new ProductsRepository();

    try {
      const { db } = await connectMongoDB();
      const productToReturn = await db
        .collection(productsRepository.collection)
        .findOne({ _id: new ObjectId(productId) });

      if (!productToReturn) {
        throw new Error();
      }

      return productToReturn;
    } catch (error) {
      throw new AppError("Product not found", 404);
    }
  }
}
