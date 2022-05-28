import connectMongoDB from "../../config/mongoDatabase";
import { UsersRepository } from "../../repositories/UsersRepository";
import IUser from "../../../interfaces/models/IUser";
import { ProductsRepository } from "../../repositories/ProductsRepository";
import Product from "../../models/Product";

interface IRequest {
  user: IUser;
  productToUpdate: any;
  productToUpdateData: any;
}

export default class UpdateProductService {
  public async execute({
    user,
    productToUpdate,
    productToUpdateData,
  }: IRequest): Promise<Object> {
    const usersRepository = new UsersRepository();
    usersRepository.checkIfHasPermission(user, "products", "update");

    const { db } = await connectMongoDB();

    const _productToUpdate = new Product();
    for (const key in productToUpdateData) {
      if (productToUpdateData[key]) {
        // @ts-ignore
        _productToUpdate[key] = productToUpdateData[key];
      }
    }

    for (const key in _productToUpdate) {
      if (!productToUpdateData[key]) {
        // @ts-ignore
        delete _productToUpdate[key];
      }
    }

    const productsRepository = new ProductsRepository();

    await db.collection(productsRepository.collection).updateOne(
      { _id: productToUpdate._id },
      {
        $set: {
          ..._productToUpdate,
          _createdAt: productToUpdate._createdAt,
        },
      }
    );

    return {
      ..._productToUpdate,
      _createdAt: productToUpdate._createdAt,
    };
  }
}
