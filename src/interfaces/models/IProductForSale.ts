export default interface IProductForSale {
  _id?: string;
  productId: string;
  pricePerLiter: number;
  promo: number;
  createdAt: Date;
  deletedAt: Date | null;
}
