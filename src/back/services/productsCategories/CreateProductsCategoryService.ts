import connectMongoDB from "../../config/mongoDatabase";
import { UsersRepository } from "../../repositories/UsersRepository";
import IUser from "../../../interfaces/IUser";
import IProduct from "../../../interfaces/IProduct";
import Product from "../../models/Product";
import { ProductsCategoriesRepository } from "../../repositories/ProductsCategoriesRepository";
import AppError from "../../../errors/AppError";

interface IRequest {
  user: IUser;
  newProductsCategory: any;
}

export default class CreateProductsCategoryService {
  public async execute({
    user,
    newProductsCategory,
  }: IRequest): Promise<IProduct> {
    const usersRepository = new UsersRepository();
    usersRepository.checkIfHasPermission(user, "products_categories", "create");

    const { db } = await connectMongoDB();

    const _newProductsCategory = new Product();
    for (const key in newProductsCategory) {
      if (newProductsCategory[key]) {
        // @ts-ignore
        _newProductsCategory[key] = newProductsCategory[key];
      }
    }

    const productsCategoriesRepository = new ProductsCategoriesRepository();

    const hasProductsCategoryWithSameName = await db
      .collection(productsCategoriesRepository.collection)
      .findOne({
        $and: [{ _deletedAt: null }, { name: _newProductsCategory.name }],
      });

    if (
      hasProductsCategoryWithSameName &&
      hasProductsCategoryWithSameName.name === _newProductsCategory.name
    ) {
      throw new AppError("Already has a category with the same name", 400);
    }

    await db
      .collection(productsCategoriesRepository.collection)
      .insertOne(_newProductsCategory);

    return _newProductsCategory;
  }
}
