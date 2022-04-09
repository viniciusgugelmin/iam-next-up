import type { NextApiRequest, NextApiResponse } from "next";
import RouteNotFoundError from "../../../src/errors/RouteNotFoundError";
import SendRequestError from "../../../src/api/services/SendRequestErrorService";
import GetAuthenticatedUserService from "../../../src/api/services/GetAuthenticatedUserService";
import AppError from "../../../src/errors/AppError";
import { UsersRepositories } from "../../../src/repositories/UsersRepositories";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (req.method === "GET") {
    await handleGet(req, res);
    return;
  }

  const { message, statusCode } = new RouteNotFoundError();
  res.status(statusCode).json({ message });
}

async function handleGet(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const getAuthenticatedUserService = new GetAuthenticatedUserService();

  try {
    const { userId } = await getAuthenticatedUserService.execute({ req });
    const usersRepository = new UsersRepositories();
    const user = await usersRepository.call(() =>
      usersRepository.collection?.findOne({ _id: userId })
    );

    if (!user) {
      throw new AppError("User not found", 404);
    }

    res.json({ user: { ...user, password: undefined } });
  } catch (error) {
    const sendRequestError = new SendRequestError();
    sendRequestError.execute({ res, error });
  }
}
