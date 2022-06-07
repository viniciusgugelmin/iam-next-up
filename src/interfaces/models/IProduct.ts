import IProductsCategory from "./IProductsCategory";

export default interface IProduct {
  _id?: string;
  name: string;
  brand: string;
  isAlcoholic: boolean;
  description: string;
  image: string;
  category: IProductsCategory | { name: string } | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
