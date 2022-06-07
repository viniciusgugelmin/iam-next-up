export default interface IProductForSale {
  _id?: string;
  product?: {
    name: string;
  };
  storageLiters?: number;
  productId: string;
  pricePerLiter: number;
  promo: number;
  createdAt: Date;
  deletedAt: Date | null;
}
