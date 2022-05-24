import connectMongoDB from "../../config/mongoDatabase";
import { UsersRepository } from "../../repositories/UsersRepository";
import IUser from "../../../interfaces/models/IUser";
import { ProductsCategoriesRepository } from "../../repositories/ProductsCategoriesRepository";

interface IRequest {
  user: IUser;
}

export default class GetProductsCategoriesService {
  public async execute({ user }: IRequest): Promise<Object[]> {
    const usersRepository = new UsersRepository();
    usersRepository.checkIfHasPermission(user, "products_categories", "read");

    const productsCategoriesRepository = new ProductsCategoriesRepository();

    const { db } = await connectMongoDB();
    const productsCategories = await db
      .collection(productsCategoriesRepository.collection)
      .find({ _deletedAt: null })
      .toArray();

    return productsCategories;
  }
}
