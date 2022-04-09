import { Db, MongoClient } from "mongodb";

export default class Mongo {
  private mongo: MongoClient;
  public db: Db | undefined;

  constructor() {
    this.mongo = new MongoClient(`${process.env.NEXT_PUBLIC_MONGO_URI}`);
  }

  public async openInstance() {
    await this.mongo.connect();
    this.db = this.mongo.db(`${process.env.NEXT_PUBLIC_MONGO_DB}`);
  }

  public async closeInstance() {
    await this.mongo.close();
  }
}

export const mongoDatabase = new Mongo();
