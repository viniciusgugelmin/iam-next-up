import connectMongoDB from "../../config/mongoDatabase";
import { UsersRepository } from "../../repositories/UsersRepository";
import IUser from "../../../interfaces/models/IUser";
import { ObjectId } from "mongodb";
import AppError from "../../../errors/AppError";
import { ProductForSaleRepository } from "../../repositories/ProductForSaleRepository";
import ProductForSale from "../../models/ProductForSale";

interface IRequest {
  user: IUser;
  productForSaleId: string;
}

export default class DeleteProductForSaleService {
  public async execute({ user, productForSaleId }: IRequest): Promise<Object> {
    const usersRepository = new UsersRepository();
    usersRepository.checkIfHasPermission(user, "products_for_sale", "delete");

    const { db } = await connectMongoDB();

    const productForSaleRepository = new ProductForSaleRepository();
    const productForSaleToDelete = await db
      .collection(productForSaleRepository.collection)
      .findOne({ _id: new ObjectId(productForSaleId) });

    if (!productForSaleToDelete) {
      throw new AppError("Product for sale not found", 404);
    }

    const deletedProductForSaleData = new ProductForSale();

    await db.collection(productForSaleRepository.collection).updateOne(
      { _id: new ObjectId(productForSaleId) },
      {
        $set: deletedProductForSaleData.delete(),
      }
    );

    return productForSaleToDelete;
  }
}
