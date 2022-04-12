import { Db, MongoClient } from "mongodb";

interface IConnectType {
  db: Db;
  client: MongoClient;
}

let cachedDb: Db;

const client = new MongoClient(`${process.env.NEXT_PUBLIC_MONGO_URI}`, {
  // @ts-ignore
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

export default async function connectMongoDB(): Promise<IConnectType> {
  if (cachedDb) {
    return { db: cachedDb, client };
  }

  await client.connect();

  const db = client.db(process.env.NEXT_PUBLIC_MONGO_DB);
  cachedDb = db;

  return { db, client };
}
