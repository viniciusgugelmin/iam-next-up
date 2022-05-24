import IProductForSale from "../../interfaces/models/IProductForSale";

export default class ProductForSale implements IProductForSale {
  productId = "";
  pricePerLiter = 0;
  private _promo = 0;
  private _createdAt = new Date();
  private _deletedAt: Date | null = null;

  // Getters and Setters

  public get promo(): number {
    return this._promo;
  }

  public get createdAt(): Date {
    return this._createdAt;
  }

  public get deletedAt(): Date | null {
    return this._deletedAt;
  }

  public set promo(value: number) {
    if (value < 0 || value > 100) {
      throw new Error("Promo must be between 0 and 100");
    }

    this._promo = value;
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

  public getRealPrice() {
    return this.pricePerLiter * (1 - this.promo / 100);
  }
}
