import connectMongoDB from "../../config/mongoDatabase";
import { UsersRepository } from "../../repositories/UsersRepository";
import IUser from "../../../interfaces/models/IUser";
import { ProductsCategoriesRepository } from "../../repositories/ProductsCategoriesRepository";
import AppError from "../../../errors/AppError";
import ProductCategory from "../../models/ProductCategory";
import IProductCategory from "../../../interfaces/models/IProductCategory";

interface IRequest {
  user: IUser;
  newProductsCategory: any;
}

export default class CreateProductsCategoryService {
  public async execute({
    user,
    newProductsCategory,
  }: IRequest): Promise<IProductCategory> {
    const usersRepository = new UsersRepository();
    usersRepository.checkIfHasPermission(user, "products_categories", "create");

    const { db } = await connectMongoDB();

    const _newProductsCategory = new ProductCategory();
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
