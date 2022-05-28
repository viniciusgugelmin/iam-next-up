import { ProductsRepository } from "./../../repositories/ProductsRepository";
import { StorageRepository } from "./../../repositories/StorageRepository";
import connectMongoDB from "../../config/mongoDatabase";
import { UsersRepository } from "../../repositories/UsersRepository";
import IUser from "../../../interfaces/models/IUser";

interface IRequest {
  user: IUser;
}

export default class GetAllStorageService {
  public async execute({ user }: IRequest): Promise<Object[]> {
    const usersRepository = new UsersRepository();
    usersRepository.checkIfHasPermission(user, "storage", "read");

    const storageRepository = new StorageRepository();
    const productsRepository = new ProductsRepository();

    const { db } = await connectMongoDB();
    const products = await db
      .collection(productsRepository.collection)
      .find({ _deleteAt: null })
      .toArray();

    const productsIds = products.map((product) => product._id);

    const storage = await db
      .collection(storageRepository.collection)
      .find({
        productId: { $in: productsIds },
      })
      .toArray();

    return storage;
  }
}
