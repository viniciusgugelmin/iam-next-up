import connectMongoDB from "../../config/mongoDatabase";
import { UsersRepository } from "../../repositories/UsersRepository";
import IUser from "../../../interfaces/models/IUser";
import { EntryRepository } from "../../repositories/EntryRepository";
import { ProductsRepository } from "../../repositories/ProductsRepository";
import { ObjectId } from "mongodb";

interface IRequest {
  user: IUser;
}

export default class GetEntriesService {
  public async execute({ user }: IRequest): Promise<Object[]> {
    const usersRepository = new UsersRepository();
    usersRepository.checkIfHasPermission(user, "entries", "read");

    const entryRepository = new EntryRepository();
    const productsRepository = new ProductsRepository();

    const { db } = await connectMongoDB();

    const entries = await db
      .collection(entryRepository.collection)
      .find({})
      .toArray();

    let productsIds = entries.map((entry) => new ObjectId(entry.productId));
    productsIds = productsIds.filter(
      (id, index) => productsIds.indexOf(id) === index
    );

    const products = await db
      .collection(productsRepository.collection)
      .find({ _id: { $in: productsIds } })
      .toArray();

    return entries.map((entry) => {
      const product = products.find(
        (product) => product._id.toString() === entry.productId.toString()
      );

      return {
        ...entry,
        product: {
          name: product?.name,
        },
      };
    });
  }
}
