import { NextApiRequest, NextApiResponse } from "next";
import GetAuthenticatedUserService from "../../src/api/services/GetAuthenticatedUserService";
import AppError from "../../src/errors/AppError";
import RouteNotFoundError from "../../src/errors/RouteNotFoundError";

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
  const getAuthenticatedUser = new GetAuthenticatedUserService();
  const authResponse = await getAuthenticatedUser.execute({ req });

  if (authResponse instanceof AppError) {
    res.status(401).json({
      message: authResponse.message,
    });
    return;
  }

  res.status(200).json({
    ...authResponse,
  });
}
