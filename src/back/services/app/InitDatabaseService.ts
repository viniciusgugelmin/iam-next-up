import { ProductsCategoriesRepository } from "./../../repositories/ProductsCategoriesRepository";
import connectMongoDB from "../../config/mongoDatabase";
import { NextApiRequest } from "next";
import AppError from "../../../errors/AppError";
import { UsersRepository } from "../../repositories/UsersRepository";
import User from "../../models/User";
import IUser from "../../../interfaces/models/IUser";
import { RolesRepository } from "../../repositories/RolesRepository";
import IRole from "../../../interfaces/models/IRole";
import adminRole from "../../../constants/roles/adminRole";
import commonRole from "../../../constants/roles/commonRole";
import ProductsCategory from "../../models/ProductsCategory";
import { ProductsRepository } from "../../repositories/ProductsRepository";
import Product from "../../models/Product";
import { CustomersRepository } from "../../repositories/CustomersRepository";
import Customer from "../../models/Customer";

interface IRequest {
  req: NextApiRequest;
}

interface IResponse {
  user: IUser;
  roles: IRole[];
  productsCategories: ProductsCategory[];
  products: Product[];
  customer: Customer;
}

export default class InitDatabaseService {
  public async execute({ req }: IRequest): Promise<IResponse> {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new AppError("Auth token is missing", 422);
    }

    const [, token] = authHeader.split(" ");

    if (token !== process.env.NEXT_PUBLIC_SESSION_ADMIN_PASSWORD) {
      throw new AppError("Invalid token", 422);
    }

    const { db } = await connectMongoDB();
    const collections = await db.collections();

    for (const collection of collections) {
      await collection.drop();
    }

    const rolesRepository = new RolesRepository();
    const rolesToInsert = [adminRole, commonRole];
    await db.collection(rolesRepository.collection).insertMany(rolesToInsert);

    const usersRepository = new UsersRepository();
    const user = new User();
    user.document = "00000000000";
    user.name = "Admin";
    user.email = "admin@admin.com";
    user.password = await usersRepository.hashPassword("admin");
    user.gender = "Prefer not to say";
    user.role = {
      name: adminRole.name,
    };

    user.role = await usersRepository.checkAndGetIfUserRoleExists(
      db,
      user.role.name
    );

    await db.collection(usersRepository.collection).insertOne(user);

    const productsCategoriesRepository = new ProductsCategoriesRepository();
    const productsCategories: ProductsCategory[] = [];

    for (let productsCategoryName of ["Juices", "Distilleds", "Soft drinks"]) {
      const productsCategory = new ProductsCategory();
      productsCategory.name = productsCategoryName;
      productsCategories.push(productsCategory);
    }

    await db
      .collection(productsCategoriesRepository.collection)
      .insertMany(productsCategories);

    const softDrinksProductsCategory = productsCategories.find(
      (productsCategory) => productsCategory.name === "Soft drinks"
    );

    let products: Product[] = [];

    if (softDrinksProductsCategory) {
      for (let drink of [
        {
          name: "Coca-Cola",
          brand: "Coca-Cola",
          image:
            "https://www.imigrantesbebidas.com.br/bebida/images/products/full/1984-refrigerante-coca-cola-lata-350ml.jpg",
        },
        {
          name: "Pepsi",
          brand: "PepsiCo",
          image:
            "https://apoioentrega.vteximg.com.br/arquivos/ids/459556/16a971a96ac5fc6b02ac8f5568e0ad8a_refrigerante-pepsi-lata-350-ml---refrig-pepsi-350ml-lt-cola---1-un_lett_1.jpg?v=637305880434630000",
        },
      ]) {
        const { name, brand, image } = drink;

        const product = new Product();
        product.name = name;
        product.brand = brand;
        product.description = name;
        product.image = image;
        product.category = softDrinksProductsCategory;

        products.push(product);
      }

      const productsRepository = new ProductsRepository();
      await db.collection(productsRepository.collection).insertMany(products);
    }

    const customersRepository = new CustomersRepository();
    const customer = new Customer();
    customer.document = "00000000000";
    customer.name = "Unregistered";
    customer.email = "lorem@ipsum.com";
    customer.password = await customersRepository.hashPassword("lorem");
    customer.birthday = new Date();

    await db.collection(customersRepository.collection).insertOne(customer);

    return {
      user,
      roles: rolesToInsert,
      productsCategories,
      products,
      customer,
    };
  }
}
