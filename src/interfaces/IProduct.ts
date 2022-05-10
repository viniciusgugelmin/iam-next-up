import IProductCategory from "./IProductCategory";

export default interface IProduct {
  _id?: string;
  name: string;
  brand: string;
  basePrice: number;
  price: number;
  liters: number;
  isAlcoholic: boolean;
  description: string;
  image: string;
  category: IProductCategory | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
