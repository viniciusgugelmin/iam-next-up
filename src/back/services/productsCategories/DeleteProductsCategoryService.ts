import connectMongoDB from "../../config/mongoDatabase";
import { UsersRepository } from "../../repositories/UsersRepository";
import IUser from "../../../interfaces/models/IUser";
import { ObjectId } from "mongodb";
import AppError from "../../../errors/AppError";
import ProductCategory from "../../models/ProductCategory";
import { ProductsCategoriesRepository } from "../../repositories/ProductsCategoriesRepository";
import { ProductsRepository } from "../../repositories/ProductsRepository";

interface IRequest {
  user: IUser;
  productsCategoryId: string;
}

export default class DeleteProductsCategoryService {
  public async execute({
    user,
    productsCategoryId,
  }: IRequest): Promise<Object> {
    const usersRepository = new UsersRepository();
    usersRepository.checkIfHasPermission(user, "products_categories", "delete");

    const productsCategoriesRepository = new ProductsCategoriesRepository();

    const { db } = await connectMongoDB();
    const productsCategoryToDelete = await db
      .collection(productsCategoriesRepository.collection)
      .findOne({ _id: new ObjectId(productsCategoryId) });

    if (!productsCategoryToDelete) {
      throw new AppError("Products category not found", 404);
    }

    const deletedProductsCategoryData = new ProductCategory();

    await db.collection(productsCategoriesRepository.collection).updateOne(
      { _id: new ObjectId(productsCategoryId) },
      {
        $set: deletedProductsCategoryData.delete(),
      }
    );

    const productsRepository = new ProductsRepository();

    await db.collection(productsRepository.collection).updateMany(
      { "category.name": productsCategoryToDelete.name },
      {
        $set: {
          category: {
            ...productsCategoryToDelete,
            ...deletedProductsCategoryData.delete(),
          },
        },
      }
    );

    return productsCategoryToDelete;
  }
}
