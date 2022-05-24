import IProductCategory from "./IProductCategory";

export default interface IProduct {
  _id?: string;
  name: string;
  brand: string;
  isAlcoholic: boolean;
  description: string;
  image: string;
  category: IProductCategory | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
