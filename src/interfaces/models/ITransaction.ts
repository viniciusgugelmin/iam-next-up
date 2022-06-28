import { ObjectId } from "mongodb";

export default interface ITransaction {
  _id?: string;
  transactionId: ObjectId;
  transactionName: string;
  credit: ObjectId | null;
  debt: ObjectId | null;
}
