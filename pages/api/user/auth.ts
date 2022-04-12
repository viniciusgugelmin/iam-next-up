import type { NextApiRequest, NextApiResponse } from "next";
import RouteNotFoundError from "../../../src/errors/RouteNotFoundError";
import SendRequestError from "../../../src/api/services/SendRequestErrorService";
import GetAuthenticatedUserService from "../../../src/api/services/GetAuthenticatedUserService";

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
    const getAuthenticatedUserService = new GetAuthenticatedUserService();
    const user = await getAuthenticatedUserService.execute({ req });

    res.json({ user: { ...user, password: undefined } });
  } catch (error) {
    const sendRequestError = new SendRequestError();
    sendRequestError.execute({ res, error });
  }
}
