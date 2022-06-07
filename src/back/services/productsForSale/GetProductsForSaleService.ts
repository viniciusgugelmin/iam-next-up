import connectMongoDB from "../../config/mongoDatabase";
import { UsersRepository } from "../../repositories/UsersRepository";
import IUser from "../../../interfaces/models/IUser";
import { EntryRepository } from "../../repositories/EntryRepository";
import { ProductsRepository } from "../../repositories/ProductsRepository";
import { ObjectId } from "mongodb";
import { ProductForSaleRepository } from "../../repositories/ProductForSaleRepository";
import { StorageRepository } from "../../repositories/StorageRepository";

interface IRequest {
  user: IUser;
}

export default class GetProductsForSaleService {
  public async execute({ user }: IRequest): Promise<Object[]> {
    const usersRepository = new UsersRepository();
    usersRepository.checkIfHasPermission(user, "products_for_sale", "read");

    const productForSaleRepository = new ProductForSaleRepository();
    const productsRepository = new ProductsRepository();
    const storageRepository = new StorageRepository();

    const { db } = await connectMongoDB();

    const products = await db
      .collection(productsRepository.collection)
      .find({ _deletedAt: null })
      .toArray();

    const productsIds = products.map((product) => product._id);

    const productsForSale = await db
      .collection(productForSaleRepository.collection)
      .find({
        $and: [{ productId: { $in: productsIds } }, { _deletedAt: null }],
      })
      .toArray();

    const storage = await db
      .collection(storageRepository.collection)
      .find({ productId: { $in: productsIds } })
      .toArray();

    console.log(storage);

    return productsForSale.map((productsForSale) => {
      const product = products.find(
        (product) =>
          product._id.toString() === productsForSale.productId.toString()
      );

      const productStorage = storage.find(
        (productStorage) =>
          productStorage.productId.toString() ===
          productsForSale.productId.toString()
      );

      return {
        ...productsForSale,
        product: {
          name: product?.name,
        },
        storageLiters: productStorage?.liters || 0,
      };
    });
  }
}
