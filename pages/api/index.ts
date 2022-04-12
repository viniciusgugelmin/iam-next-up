import type { NextApiRequest, NextApiResponse } from "next";
import RouteNotFoundError from "../../src/errors/RouteNotFoundError";
import SendRequestError from "../../src/api/services/SendRequestErrorService";
import User from "../../src/models/User";
import { UsersRepository } from "../../src/repositories/UsersRepository";
import AppError from "../../src/errors/AppError";
import connectMongoDB from "../../src/api/config/mongoDatabase";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    await handleGet(req, res);
    return;
  }

  const { message, statusCode } = new RouteNotFoundError();
  res.status(statusCode).json({ message });
}

async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  try {
    const usersRepository = new UsersRepository();
    const user = new User();
    user.document = "11111111111";
    user.name = "Admin";
    user.email = "admin@admin.com";
    user.password = await usersRepository.hashPassword("admin");
    user.gender = "Prefer not to say";
    user.role = {
      name: "admin",
      description: "Administrator",
      permission: 10,
    };

    const { db } = await connectMongoDB();
    const userAlreadyExists = await db
      .collection(usersRepository.collection)
      .findOne({
        document: user.document,
      });

    if (userAlreadyExists) {
      throw new AppError("", 500);
    }

    await db
      .collection(usersRepository.collection)
      .insertOne({ ...user, _id: undefined });

    res.json({ user: { ...user } });
  } catch (error) {
    const sendRequestError = new SendRequestError();
    sendRequestError.execute({ res, error });
  }
}
