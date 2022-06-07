import { Db } from "mongodb";
import AppError from "../../errors/AppError";
import IProductsCategory from "../../interfaces/models/IProductsCategory";

export class ProductsCategoriesRepository {
  collection = "products_categories";

  public async checkAndGetIfProductsCategoryExists(
    db: Db,
    productsCategory: IProductsCategory | { name: string } | null
  ): Promise<any> {
    const _productsCategory = await db.collection(this.collection).findOne({
      $and: [{ _deletedAt: null }, { name: productsCategory?.name }],
    });

    if (!_productsCategory) {
      throw new AppError("Product category not found", 422);
    }

    return _productsCategory;
  }
}
