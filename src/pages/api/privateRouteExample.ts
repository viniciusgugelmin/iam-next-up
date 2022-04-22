import { NextApiRequest, NextApiResponse } from "next";
import GetAuthenticatedUserService from "../../back/services/user/GetAuthenticatedUserService";
import RouteNotFoundError from "../../errors/RouteNotFoundError";
import SendRequestError from "../../back/services/app/SendRequestErrorService";

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
    const authResponse = await getAuthenticatedUserService.execute({ req });

    res.json({
      ...authResponse,
    });
  } catch (error) {
    const sendRequestError = new SendRequestError();
    sendRequestError.execute({ res, error });
  }
}
