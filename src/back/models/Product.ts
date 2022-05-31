import IProduct from "../../interfaces/models/IProduct";
import IProductCategory from "../../interfaces/models/IProductCategory";

export default class Product implements IProduct {
  name = "";
  brand = "";
  isAlcoholic = false;
  description = "";
  image = "";
  category: IProductCategory | { name: string } | null = null;
  private _createdAt = new Date();
  private _updatedAt = new Date();
  private _deletedAt: Date | null = null;

  // Getters and Setters

  public get createdAt(): Date {
    return this._createdAt;
  }

  public get updatedAt(): Date {
    return this._updatedAt;
  }

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
