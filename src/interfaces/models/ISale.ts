export default interface ISale {
  _id?: string;
  productForSaleId: string;
  customersDocument: string;
  liters: number;
  createdAt: Date;
}
