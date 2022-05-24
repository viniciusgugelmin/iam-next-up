export default interface ISale {
  _id?: string;
  productForSaleId: string;
  costumersDocument: number;
  liters: number;
  createdAt: Date;
}
