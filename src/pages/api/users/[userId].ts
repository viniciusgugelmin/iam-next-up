import { NextApiRequest, NextApiResponse } from "next";
import RouteNotFoundError from "../../../errors/RouteNotFoundError";
import GetAuthenticatedUserService from "../../../api/services/user/GetAuthenticatedUserService";
import SendRequestError from "../../../api/services/app/SendRequestErrorService";
import GetUserService from "../../../api/services/users/GetUserService";

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
    const { userId } = req.query;

    const getAuthenticatedUserService = new GetAuthenticatedUserService();
    const user = await getAuthenticatedUserService.execute({ req });

    const getUserService = new GetUserService();
    const userToReturn = await getUserService.execute({
      user,
      userId: userId as string,
    });

    res.json({
      user: userToReturn,
    });
  } catch (error) {
    const sendRequestError = new SendRequestError();
    sendRequestError.execute({ res, error });
  }
}
