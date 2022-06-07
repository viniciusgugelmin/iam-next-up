import IProductsCategory from "../../interfaces/models/IProductsCategory";

export default class ProductsCategory implements IProductsCategory {
  name = "";
  private _deletedAt: Date | null = null;

  // Getters and Setters

  public get deletedAt(): Date | null {
    return this._deletedAt;
  }

  // Functions

  public delete() {
    this._deletedAt = new Date();

    return {
      _deletedAt: this._deletedAt,
    };
  }

  public reactivate() {
    this._deletedAt = null;

    return {
      _deletedAt: this._deletedAt,
    };
  }
}
