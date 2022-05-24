import IEntry from "../../interfaces/models/IEntry";

export default class Entry implements IEntry {
  productId = "";
  price = 0;
  liters = 0;
  private _createdAt = new Date();

  // Getters and Setters

  public get createdAt(): Date {
    return this._createdAt;
  }
}
