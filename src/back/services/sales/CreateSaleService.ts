import connectMongoDB from "../../config/mongoDatabase";
import AppError from "../../../errors/AppError";
import { ObjectId } from "mongodb";
import { StorageRepository } from "../../repositories/StorageRepository";
import ISale from "../../../interfaces/models/ISale";
import Sale from "../../models/Sale";
import { ProductForSaleRepository } from "../../repositories/ProductForSaleRepository";
import { SalesRepository } from "../../repositories/SalesRepository";
import { ProductsRepository } from "../../repositories/ProductsRepository";
import { CustomersRepository } from "../../repositories/CustomersRepository";

interface IRequest {
  newSale: any;
}

export default class CreateSaleService {
  public async execute({ newSale }: IRequest): Promise<ISale> {
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
      throw new AppError("Not enough liters in storage", 400);
    }

    const productsRepository = new ProductsRepository();
    const product = await db.collection(productsRepository.collection).findOne({
      _id: new ObjectId(productForSaleExists.productId),
    });

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    if (product.isAlcoholic) {
      if (_newSale.customersDocument === "00000000000") {
        throw new AppError("You must log in to buy alcohol", 401);
      }

      const customersRepository = new CustomersRepository();
      const customer = await db
        .collection(customersRepository.collection)
        .findOne({
          document: new ObjectId(_newSale.customersDocument),
        });

      if (!customer) {
        throw new AppError("Customer not found", 404);
      }

      const birthdate = new Date(customer.birthdate);
      const age = Math.floor(
        (Date.now() - birthdate.getTime()) / (1000 * 3600 * 24 * 365)
      );

      if (age < 18) {
        throw new AppError(
          "Customer is under 18 years old and cannot buy alcohol",
          401
        );
      }
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
