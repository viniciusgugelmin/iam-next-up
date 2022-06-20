import connectMongoDB from "../../config/mongoDatabase";
import { UsersRepository } from "../../repositories/UsersRepository";
import IUser from "../../../interfaces/models/IUser";
import { ProductsRepository } from "../../repositories/ProductsRepository";
import { ObjectId } from "mongodb";
import { CustomersRepository } from "../../repositories/CustomersRepository";
import { SalesRepository } from "../../repositories/SalesRepository";
import { ProductForSaleRepository } from "../../repositories/ProductForSaleRepository";

interface IRequest {
  user: IUser;
}

export default class GetSalesService {
  public async execute({ user }: IRequest): Promise<Object[]> {
    const usersRepository = new UsersRepository();
    usersRepository.checkIfHasPermission(user, "sales", "read");

    const salesRepository = new SalesRepository();
    const productForSaleId = new ProductForSaleRepository();
    const productsRepository = new ProductsRepository();
    const customersRepository = new CustomersRepository();

    const { db } = await connectMongoDB();

    const sales = await db
      .collection(salesRepository.collection)
      .find({})
      .toArray();

    let productsForSaleIds = sales.map(
      (sale) => new ObjectId(sale.productForSaleId)
    );
    productsForSaleIds = productsForSaleIds.filter(
      (id, index) => productsForSaleIds.indexOf(id) === index
    );

    let customersDocument = sales.map((sale) => sale.customersDocument);
    customersDocument = customersDocument.filter(
      (document, index) => customersDocument.indexOf(document) === index
    );

    const productsForSale = await db
      .collection(productForSaleId.collection)
      .find({ _id: { $in: productsForSaleIds } })
      .toArray();

    let productsId = productsForSale.map(
      (product) => new ObjectId(product.productId)
    );
    productsId = productsId.filter(
      (id, index) => productsId.indexOf(id) === index
    );

    const products = await db
      .collection(productsRepository.collection)
      .find({
        _id: { $in: productsId },
      })
      .toArray();

    const customers = await db
      .collection(customersRepository.collection)
      .find({
        document: { $in: customersDocument },
      })
      .toArray();

    return sales.map((sale) => {
      const product = products.find(
        (product) => product._id.toString() === sale.productId.toString()
      );

      const customer = customers.find(
        (customer) =>
          customer.document === sale.customersDocument &&
          customer._deletedAt === null
      );

      return {
        ...sale,
        product: {
          name: product?.name,
        },
        customer: {
          name: customer?.name,
        },
      };
    });
  }
}
