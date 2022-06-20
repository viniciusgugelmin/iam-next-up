import connectMongoDB from "../../config/mongoDatabase";
import { UsersRepository } from "../../repositories/UsersRepository";
import IUser from "../../../interfaces/models/IUser";
import AppError from "../../../errors/AppError";
import { ObjectId } from "mongodb";
import { StorageRepository } from "../../repositories/StorageRepository";
import ISale from "../../../interfaces/models/ISale";
import Sale from "../../models/Sale";
import { ProductForSaleRepository } from "../../repositories/ProductForSaleRepository";
import { SalesRepository } from "../../repositories/SalesRepository";

interface IRequest {
  user: IUser;
  newSale: any;
}

export default class CreateSaleService {
  public async execute({ user, newSale }: IRequest): Promise<ISale> {
    const usersRepository = new UsersRepository();
    usersRepository.checkIfHasPermission(user, "sales", "create");

    const { db } = await connectMongoDB();

    const _newSale = new Sale();
    for (const key in newSale) {
      if (newSale[key]) {
        // @ts-ignore
        _newSale[key] = newSale[key];
      }
    }

    const productForSaleRepository = new ProductForSaleRepository();
    const productForSaleExists = await db
      .collection(productForSaleRepository.collection)
      .findOne({
        _id: new ObjectId(_newSale.productForSaleId),
        _deletedAt: null,
      });

    if (!productForSaleExists) {
      throw new AppError("Product for sale not found", 404);
    }

    const storageRepository = new StorageRepository();
    const currentStorage = await db
      .collection(storageRepository.collection)
      .findOne({
        productId: new ObjectId(productForSaleExists.productId),
      });

    if (!currentStorage) {
      throw new AppError("Storage not found", 404);
    }

    if (currentStorage.liters < _newSale.liters) {
      throw new AppError("Not enough liters", 400);
    }

    const salesRepository = new SalesRepository();
    const { insertedId } = await db
      .collection(salesRepository.collection)
      .insertOne(_newSale);

    try {
      const storageUpdated = {
        productId: new ObjectId(productForSaleExists.productId),
        liters:
          parseFloat(currentStorage.liters) -
          parseFloat(String(_newSale.liters)),
      };

      await db.collection(storageRepository.collection).updateOne(
        {
          productId: new ObjectId(productForSaleExists.productId),
        },
        {
          $set: storageUpdated,
        }
      );

      // TODO register transaction
    } catch (error) {
      await db.collection(salesRepository.collection).deleteOne({
        _id: new ObjectId(insertedId),
      });

      throw new AppError(
        "An error has occurred trying to register the transaction",
        500
      );
    }

    return _newSale;
  }
}
