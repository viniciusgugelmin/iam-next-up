import ISale from "../../interfaces/models/ISale";

export default class Sale implements ISale {
  productForSaleId = "";
  customersDocument = "";
  liters = 0;
  private _createdAt = new Date();

  // Getters and Setters

  public get createdAt(): Date {
    return this._createdAt;
  }
}
