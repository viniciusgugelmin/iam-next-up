export default interface ISale {
  _id?: string;
  customer?: {
    name: string;
  };
  product?: {
    name: string;
  };
  amountPaid?: number;
  productForSaleId: string;
  customersDocument: string;
  liters: number;
  createdAt: Date;
}
