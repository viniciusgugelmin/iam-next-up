import connectMongoDB from "../../config/mongoDatabase";
import { UsersRepository } from "../../repositories/UsersRepository";
import IUser from "../../../interfaces/models/IUser";
import AppError from "../../../errors/AppError";
import User from "../../models/User";
import commonRole from "../../../constants/roles/commonRole";
import ProductsCategory from "../../models/ProductsCategory";
import { ProductsCategoriesRepository } from "../../repositories/ProductsCategoriesRepository";

interface IRequest {
  user: IUser;
  productsCategoryToUpdate: any;
  productsCategoryToUpdateData: any;
}

export default class UpdateProductsCategoryService {
  public async execute({
    user,
    productsCategoryToUpdate,
    productsCategoryToUpdateData,
  }: IRequest): Promise<Object> {
    const usersRepository = new UsersRepository();
    usersRepository.checkIfHasPermission(user, "products_categories", "update");

    const { db } = await connectMongoDB();

    const _productsCategoryToUpdate = new ProductsCategory();
    for (const key in productsCategoryToUpdateData) {
      if (productsCategoryToUpdateData[key]) {
        // @ts-ignore
        _productsCategoryToUpdate[key] = productsCategoryToUpdateData[key];
      }
    }

    const productsCategoriesRepository = new ProductsCategoriesRepository();

    const hasProductsCategoryWithSameName = await db
      .collection(productsCategoriesRepository.collection)
      .findOne({
        $and: [{ _deletedAt: null }, { name: _productsCategoryToUpdate.name }],
      });

    if (
      hasProductsCategoryWithSameName &&
      hasProductsCategoryWithSameName.name === _productsCategoryToUpdate.name &&
      hasProductsCategoryWithSameName.name !== productsCategoryToUpdate.name
    ) {
      throw new AppError("Name already in use", 400);
    }

    await db.collection(productsCategoriesRepository.collection).updateOne(
      { _id: productsCategoryToUpdate._id },
      {
        $set: {
          ..._productsCategoryToUpdate,
        },
      }
    );

    return {
      ..._productsCategoryToUpdate,
    };
  }
}
