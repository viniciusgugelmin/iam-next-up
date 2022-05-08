import connectMongoDB from "../../config/mongoDatabase";
import { UsersRepository } from "../../repositories/UsersRepository";
import IUser from "../../../interfaces/IUser";
import { ObjectId } from "mongodb";
import AppError from "../../../errors/AppError";
import User from "../../models/User";
import Product from "../../models/Product";
import { ProductsRepository } from "../../repositories/ProductsRepository";

interface IRequest {
  user: IUser;
  productId: string;
}

export default class DeleteProductService {
  public async execute({ user, productId }: IRequest): Promise<Object> {
    const usersRepository = new UsersRepository();
    usersRepository.checkIfHasPermission(user, "products", "delete");

    const productsRepository = new ProductsRepository();

    const { db } = await connectMongoDB();
    const productToDelete = await db
      .collection(productsRepository.collection)
      .findOne({ _id: new ObjectId(productId) });

    if (!productToDelete) {
      throw new AppError("Product not found", 404);
    }

    if (productToDelete._deletedAt) {
      throw new AppError("Product already deleted", 404);
    }

    const deletedProductData = new Product();

    await db.collection(productsRepository.collection).updateOne(
      { _id: new ObjectId(productId) },
      {
        $set: deletedProductData.delete(),
      }
    );

    return productToDelete;
  }
}
