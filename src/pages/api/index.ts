import type { NextApiRequest, NextApiResponse } from "next";
import RouteNotFoundError from "../../errors/RouteNotFoundError";
import SendRequestError from "../../back/services/app/SendRequestErrorService";
import InitDatabaseService from "../../back/services/app/InitDatabaseService";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    await handlePost(req, res);
    return;
  }

  const { message, statusCode } = new RouteNotFoundError();
  res.status(statusCode).json({ message });
}

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  try {
    const initDatabaseService = new InitDatabaseService();
    const initDatabaseResponse = await initDatabaseService.execute({ req });

    res.json({ ...initDatabaseResponse });
  } catch (error) {
    const sendRequestError = new SendRequestError();
    sendRequestError.execute({ res, error });
  }
}
