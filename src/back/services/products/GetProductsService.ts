import connectMongoDB from "../../config/mongoDatabase";
import { UsersRepository } from "../../repositories/UsersRepository";
import IUser from "../../../interfaces/models/IUser";
import { ProductsRepository } from "../../repositories/ProductsRepository";

interface IRequest {
  user: IUser;
}

export default class GetProductsService {
  public async execute({ user }: IRequest): Promise<Object[]> {
    const usersRepository = new UsersRepository();
    usersRepository.checkIfHasPermission(user, "products", "read");

    const productsRepository = new ProductsRepository();

    const { db } = await connectMongoDB();
    const products = await db
      .collection(productsRepository.collection)
      .find({ _deletedAt: null })
      .toArray();

    return products;
  }
}
