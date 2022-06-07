import connectMongoDB from "../../config/mongoDatabase";
import { UsersRepository } from "../../repositories/UsersRepository";
import IUser from "../../../interfaces/models/IUser";
import AppError from "../../../errors/AppError";
import { ObjectId } from "mongodb";
import { ProductsRepository } from "../../repositories/ProductsRepository";
import IProductForSale from "../../../interfaces/models/IProductForSale";
import ProductForSale from "../../models/ProductForSale";
import { ProductForSaleRepository } from "../../repositories/ProductForSaleRepository";

interface IRequest {
  user: IUser;
  newProductForSale: any;
}

export default class CreateProductForSaleService {
  public async execute({
    user,
    newProductForSale,
  }: IRequest): Promise<IProductForSale> {
    const usersRepository = new UsersRepository();
    usersRepository.checkIfHasPermission(user, "products_for_sale", "create");

    const { db } = await connectMongoDB();

    const _newProductForSale = new ProductForSale();
    for (const key in newProductForSale) {
      if (newProductForSale[key]) {
        // @ts-ignore
        _newProductForSale[key] = newProductForSale[key];
      }
    }

    // @ts-ignore
    _newProductForSale.productId = new ObjectId(_newProductForSale.productId);

    const productsRepository = new ProductsRepository();
    const productExists = await db
      .collection(productsRepository.collection)
      .findOne({
        _id: new ObjectId(_newProductForSale.productId),
        _deletedAt: null,
      });

    if (!productExists) {
      throw new AppError("Product not found", 404);
    }

    const productForSaleRepository = new ProductForSaleRepository();

    const productForSaleWithSamePriceAndPromo = await db
      .collection(productForSaleRepository.collection)
      .findOne({
        productId: _newProductForSale.productId,
        pricePerLiter: _newProductForSale.pricePerLiter,
        _promo: _newProductForSale.promo,
        _deletedAt: null,
      });

    if (productForSaleWithSamePriceAndPromo) {
      throw new AppError(
        "Product for sale with same price and promo already exists",
        400
      );
    }

    await db
      .collection(productForSaleRepository.collection)
      .insertOne(_newProductForSale);

    return _newProductForSale;
  }
}
