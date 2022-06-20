import connectMongoDB from "../../config/mongoDatabase";
import { UsersRepository } from "../../repositories/UsersRepository";
import IUser from "../../../interfaces/models/IUser";
import { ObjectId } from "mongodb";
import AppError from "../../../errors/AppError";
import { EntryRepository } from "../../repositories/EntryRepository";
import { StorageRepository } from "../../repositories/StorageRepository";
import { ProductForSaleRepository } from "../../repositories/ProductForSaleRepository";
import { SalesRepository } from "../../repositories/SalesRepository";

interface IRequest {
  user: IUser;
  saleId: string;
}

export default class DeleteSaleService {
  public async execute({ user, saleId }: IRequest): Promise<Object> {
    const usersRepository = new UsersRepository();
    usersRepository.checkIfHasPermission(user, "sales", "delete");

    const { db } = await connectMongoDB();

    const salesRepository = new SalesRepository();
    const saleToDelete = await db
      .collection(salesRepository.collection)
      .findOne({ _id: new ObjectId(saleId) });

    if (!saleToDelete) {
      throw new AppError("Sale not found", 404);
    }

    const productForSaleRepository = new ProductForSaleRepository();
    const productForSaleExists = await db
      .collection(productForSaleRepository.collection)
      .findOne({
        _id: new ObjectId(saleToDelete.productForSaleId),
      });

    if (!productForSaleExists) {
      throw new AppError("Product for sale not found", 404);
    }

    const storageRepository = new StorageRepository();
    const storage = await db.collection(storageRepository.collection).findOne({
      productId: new ObjectId(productForSaleExists.productId),
    });

    if (!storage) {
      throw new AppError("Storage not found", 404);
    }

    const storageUpdated = {
      productId: new ObjectId(productForSaleExists.productId),
      liters:
        parseFloat(storage.liters) + parseFloat(String(saleToDelete.liters)),
    };

    await db.collection(storageRepository.collection).updateOne(
      {
        productId: new ObjectId(productForSaleExists.productId),
      },
      {
        $set: storageUpdated,
      }
    );

    await db
      .collection(salesRepository.collection)
      .deleteOne({ _id: new ObjectId(saleId) });

    // TODO delete transaction

    return saleToDelete;
  }
}
