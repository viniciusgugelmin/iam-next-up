import connectMongoDB from "../../config/mongoDatabase";
import { UsersRepository } from "../../repositories/UsersRepository";
import IUser from "../../../interfaces/models/IUser";
import { ObjectId } from "mongodb";
import AppError from "../../../errors/AppError";
import User from "../../models/User";
import { EntryRepository } from "../../repositories/EntryRepository";
import { StorageRepository } from "../../repositories/StorageRepository";
import { ProductForSaleRepository } from "../../repositories/ProductForSaleRepository";

interface IRequest {
  user: IUser;
  entryId: string;
}

export default class DeleteEntryService {
  public async execute({ user, entryId }: IRequest): Promise<Object> {
    const usersRepository = new UsersRepository();
    usersRepository.checkIfHasPermission(user, "entries", "delete");

    const { db } = await connectMongoDB();

    const entryRepository = new EntryRepository();
    const entryToDelete = await db
      .collection(entryRepository.collection)
      .findOne({ _id: new ObjectId(entryId) });

    if (!entryToDelete) {
      throw new AppError("Entry not found", 404);
    }

    const storageRepository = new StorageRepository();
    const storage = await db.collection(storageRepository.collection).findOne({
      productId: new ObjectId(entryToDelete.productId),
    });

    if (!storage) {
      throw new AppError("Storage not found", 404);
    }

    if (storage.liters < entryToDelete.liters) {
      throw new AppError("Not enough liters", 400);
    }

    const productForSaleRepository = new ProductForSaleRepository();
    const productForSale = await db
      .collection(productForSaleRepository.collection)
      .findOne({
        productId: new ObjectId(entryId),
        _deleteAt: null,
      });

    if (productForSale) {
      throw new AppError("Product is in sale", 400);
    }

    const storageUpdated = {
      productId: new ObjectId(entryToDelete.productId),
      liters:
        parseFloat(storage.liters) - parseFloat(String(entryToDelete.liters)),
    };

    await db.collection(storageRepository.collection).updateOne(
      {
        productId: new ObjectId(entryToDelete.productId),
      },
      {
        $set: storageUpdated,
      }
    );

    await db
      .collection(entryRepository.collection)
      .deleteOne({ _id: new ObjectId(entryId) });

    return entryToDelete;
  }
}
