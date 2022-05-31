import { ProductsRepository } from "./../../repositories/ProductsRepository";
import { StorageRepository } from "./../../repositories/StorageRepository";
import connectMongoDB from "../../config/mongoDatabase";
import { UsersRepository } from "../../repositories/UsersRepository";
import IUser from "../../../interfaces/models/IUser";
import { ObjectId } from "mongodb";

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
      .find({})
      .toArray();

    const productsIds = products.map((product) => new ObjectId(product._id));

    const storage = await db
      .collection(storageRepository.collection)
      .find({
        productId: { $in: productsIds },
      })
      .toArray();

    return storage.map((item) => {
      const product = products.find(
        (product) => product._id.toString() === item.productId.toString()
      );
      return {
        ...item,
        product: {
          name: product?.name,
        },
      };
    });
  }
}
