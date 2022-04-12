import { NextApiRequest, NextApiResponse } from "next";
import GetAuthenticatedUserService from "../../src/api/services/GetAuthenticatedUserService";
import RouteNotFoundError from "../../src/errors/RouteNotFoundError";
import SendRequestError from "../../src/api/services/SendRequestErrorService";
import { mongoDatabase } from "../../src/api/config/mongoDatabase";

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
  try {
    const getAuthenticatedUser = new GetAuthenticatedUserService();
    const authResponse = await getAuthenticatedUser.execute({ req });

    res.status(200).json({
      ...authResponse,
    });
  } catch (error) {
    const sendRequestError = new SendRequestError();
    sendRequestError.execute({ res, error });
  }
}
