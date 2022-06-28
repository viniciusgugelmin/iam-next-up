import { ObjectId } from "mongodb";
import ITransaction from "../../interfaces/models/ITransaction";

export default class Transaction implements ITransaction {
  transactionId = new ObjectId();
  transactionName = "";
  credit = null;
  debt = null;
}
