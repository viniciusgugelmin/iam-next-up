export default interface IEntry {
  _id?: string;
  product?: {
    name: string;
  };
  productId: string;
  price: number;
  liters: number;
  createdAt: Date;
}
