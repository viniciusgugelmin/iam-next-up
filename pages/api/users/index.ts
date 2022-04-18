import { NextApiRequest, NextApiResponse } from "next";
import SendRequestError from "../../../src/api/services/SendRequestErrorService";
import RouteNotFoundError from "../../../src/errors/RouteNotFoundError";
import GetAuthenticatedUserService from "../../../src/api/services/GetAuthenticatedUserService";
import GetUsersService from "../../../src/api/services/GetUsersService";

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
    /*const getAuthenticatedUserService = new GetAuthenticatedUserService();
    await getAuthenticatedUserService.execute({ req });*/

    const getUsersService = new GetUsersService();
    const users = await getUsersService.execute();

    res.status(200).json({ users });
  } catch (error) {
    const sendRequestError = new SendRequestError();
    sendRequestError.execute({ res, error });
  }
}
