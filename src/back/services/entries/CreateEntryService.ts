import connectMongoDB from "../../config/mongoDatabase";
import { UsersRepository } from "../../repositories/UsersRepository";
import IUser from "../../../interfaces/models/IUser";
import AppError from "../../../errors/AppError";
import IEntry from "../../../interfaces/models/IEntry";
import Entry from "../../models/Entry";
import { ObjectId } from "mongodb";
import { ProductsRepository } from "../../repositories/ProductsRepository";
import { EntryRepository } from "../../repositories/EntryRepository";
import { StorageRepository } from "../../repositories/StorageRepository";

interface IRequest {
  user: IUser;
  newEntry: any;
}

export default class CreateEntryService {
  public async execute({ user, newEntry }: IRequest): Promise<IEntry> {
    const usersRepository = new UsersRepository();
    usersRepository.checkIfHasPermission(user, "entries", "create");

    const { db } = await connectMongoDB();

    const _newEntry = new Entry();
    for (const key in newEntry) {
      if (newEntry[key]) {
        // @ts-ignore
        _newEntry[key] = newEntry[key];
      }
    }

    const productsRepository = new ProductsRepository();
    const productExists = await db
      .collection(productsRepository.collection)
      .findOne({
        _id: new ObjectId(_newEntry.productId),
        _deletedAt: null,
      });

    if (!productExists) {
      throw new AppError("Product not found", 404);
    }

    const storageRepository = new StorageRepository();
    const currentStorage = await db
      .collection(storageRepository.collection)
      .findOne({
        productId: new ObjectId(_newEntry.productId),
      });

    if (!currentStorage) {
      await db.collection(storageRepository.collection).insertOne({
        productId: new ObjectId(_newEntry.productId),
        liters: parseFloat(String(_newEntry.liters)),
      });
    } else {
      const newStorage = {
        productId: new ObjectId(_newEntry.productId),
        liters:
          parseFloat(currentStorage.liters) +
          parseFloat(String(_newEntry.liters)),
      };

      await db.collection(storageRepository.collection).updateOne(
        {
          productId: new ObjectId(_newEntry.productId),
        },
        {
          $set: newStorage,
        }
      );
    }

    const entryRepository = new EntryRepository();
    const { insertedId } = await db
      .collection(entryRepository.collection)
      .insertOne(_newEntry);

    try {
      // TODO register transaction
    } catch (error) {
      await db.collection(entryRepository.collection).deleteOne({
        _id: new ObjectId(insertedId),
      });

      throw new AppError(
        "An error has occurred trying to register the transaction",
        500
      );
    }

    return _newEntry;
  }
}
