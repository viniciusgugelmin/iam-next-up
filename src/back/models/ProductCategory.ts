import IProductCategory from "../../interfaces/models/IProductCategory";

export default class ProductCategory implements IProductCategory {
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
