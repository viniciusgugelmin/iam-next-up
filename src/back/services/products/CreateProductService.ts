import connectMongoDB from "../../config/mongoDatabase";
import { UsersRepository } from "../../repositories/UsersRepository";
import IUser from "../../../interfaces/models/IUser";
import IProduct from "../../../interfaces/models/IProduct";
import Product from "../../models/Product";
import { ProductsRepository } from "../../repositories/ProductsRepository";
import { ProductsCategoriesRepository } from "../../repositories/ProductsCategoriesRepository";

interface IRequest {
  user: IUser;
  newProduct: any;
}

export default class CreateProductService {
  public async execute({ user, newProduct }: IRequest): Promise<IProduct> {
    const usersRepository = new UsersRepository();
    usersRepository.checkIfHasPermission(user, "products", "create");

    const { db } = await connectMongoDB();

    const _newProduct = new Product();
    for (const key in newProduct) {
      if (newProduct[key]) {
        // @ts-ignore
        _newProduct[key] = newProduct[key];
      }
    }

    const productsCategoriesRepository = new ProductsCategoriesRepository();

    _newProduct.category =
      await productsCategoriesRepository.checkAndGetIfProductCategoryExists(
        db,
        _newProduct.category
      );

    const productsRepository = new ProductsRepository();

    await db.collection(productsRepository.collection).insertOne(_newProduct);

    return _newProduct;
  }
}
