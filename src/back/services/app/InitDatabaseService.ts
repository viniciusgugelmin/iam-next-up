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
import ProductCategory from "../../models/ProductCategory";
import { ProductsRepository } from "../../repositories/ProductsRepository";
import Product from "../../models/Product";

interface IRequest {
  req: NextApiRequest;
}

interface IResponse {
  user: IUser;
  roles: IRole[];
  productsCategories: ProductCategory[];
  products: Product[];
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
    const productsCategories: ProductCategory[] = [];

    for (let productCategoryName of ["Juices", "Distilleds", "Soft drinks"]) {
      const productCategory = new ProductCategory();
      productCategory.name = productCategoryName;
      productsCategories.push(productCategory);
    }

    await db
      .collection(productsCategoriesRepository.collection)
      .insertMany(productsCategories);

    const softDrinksProductCategory = productsCategories.find(
      (productCategory) => productCategory.name === "Soft drinks"
    );

    let products: Product[] = [];

    if (softDrinksProductCategory) {
      const productsRepository = new ProductsRepository();
      const product = new Product();
      product.name = "Coca-Cola";
      product.brand = "Coca-Cola";
      product.description = "Coca-Cola";
      product.image =
        "https://www.imigrantesbebidas.com.br/bebida/images/products/full/1984-refrigerante-coca-cola-lata-350ml.jpg";
      product.category = softDrinksProductCategory;

      await db.collection(productsRepository.collection).insertOne(product);

      products.push(product);
    }

    return { user, roles: rolesToInsert, productsCategories, products };
  }
}
