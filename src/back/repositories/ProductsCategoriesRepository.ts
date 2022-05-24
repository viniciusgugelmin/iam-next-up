import { Db } from "mongodb";
import AppError from "../../errors/AppError";
import IProductCategory from "../../interfaces/models/IProductCategory";

export class ProductsCategoriesRepository {
  collection = "products_categories";

  public async checkAndGetIfProductCategoryExists(
    db: Db,
    productCategory: IProductCategory | null
  ): Promise<any> {
    const _productCategory = await db.collection(this.collection).findOne({
      $and: [{ _deletedAt: null }, { name: productCategory?.name }],
    });

    if (!_productCategory) {
      throw new AppError("Product category not found", 422);
    }

    return _productCategory;
  }
}
