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
import { TransactionsRepository } from "../../repositories/TransactionsRepository";
import Transaction from "../../models/Transaction";
import { AccountingRepository } from "../../repositories/AccountingRepository";

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

    const transactionsRepository = new TransactionsRepository();
    const accountingRepository = new AccountingRepository();

    const cashAccount = await db
      .collection(accountingRepository.collection)
      .findOne({
        account: "Cash",
      });

    if (!cashAccount) {
      throw new AppError("Cash account not found", 404);
    }

    if (cashAccount.value < _newEntry.price) {
      throw new AppError("Cash has not enough money", 400);
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
      // Provider transaction
      const transaction = new Transaction();
      transaction.transactionId = insertedId;
      transaction.transactionName = entryRepository.collection;

      const accountDebt = await db
        .collection(accountingRepository.collection)
        .findOne({
          account: "Providers",
        });

      if (!accountDebt) {
        throw new AppError("Debt account not found", 404);
      }

      // @ts-ignore
      transaction.debt = accountDebt._id;

      await db
        .collection(transactionsRepository.collection)
        .insertOne(transaction);

      await db.collection(accountingRepository.collection).updateOne(
        {
          account: "Providers",
        },
        {
          $set: {
            value:
              parseFloat(String(accountDebt.value)) +
              parseFloat(String(_newEntry.price)),
          },
        }
      );

      // Cash and storage transaction
      const transaction2 = new Transaction();
      transaction2.transactionId = insertedId;
      transaction2.transactionName = entryRepository.collection;

      const accountCredit = await db
        .collection(accountingRepository.collection)
        .findOne({
          account: "Cash",
        });

      if (!accountCredit) {
        throw new AppError("Credit account not found", 404);
      }

      // @ts-ignore
      transaction2.credit = accountCredit._id;

      const accountDebt2 = await db
        .collection(accountingRepository.collection)
        .findOne({
          account: "Storage",
        });

      if (!accountDebt2) {
        throw new AppError("Debt 2 account not found", 404);
      }

      // @ts-ignore
      transaction2.debt = accountDebt2._id;

      await db
        .collection(transactionsRepository.collection)
        .insertOne(transaction2);

      await db.collection(accountingRepository.collection).updateOne(
        {
          account: "Cash",
        },
        {
          $set: {
            value:
              parseFloat(String(accountCredit.value)) -
              parseFloat(String(_newEntry.price)),
          },
        }
      );

      await db.collection(accountingRepository.collection).updateOne(
        {
          account: "Storage",
        },
        {
          $set: {
            value:
              parseFloat(String(accountDebt2.value)) +
              parseFloat(String(_newEntry.price)),
          },
        }
      );
    } catch (error) {
      console.log(error);
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
