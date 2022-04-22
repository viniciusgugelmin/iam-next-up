import { NextApiRequest, NextApiResponse } from "next";
import RouteNotFoundError from "../../../errors/RouteNotFoundError";
import GetAuthenticatedUserService from "../../../back/services/user/GetAuthenticatedUserService";
import SendRequestError from "../../../back/services/app/SendRequestErrorService";
import GetUsersService from "../../../back/services/users/GetUsersService";
import CreateUserService from "../../../back/services/users/CreateUserService";
import joi from "joi";
import SanitizeEveryWordService from "../../../back/services/app/SanitizeEveryWordService";
import AppError from "../../../errors/AppError";
import GetRolesService from "../../../back/services/roles/GetUsersService";

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
    const getAuthenticatedUserService = new GetAuthenticatedUserService();
    const user = await getAuthenticatedUserService.execute({ req });

    const getRolesService = new GetRolesService();
    const roles = await getRolesService.execute({ user });

    res.json({
      roles,
    });
  } catch (error) {
    const sendRequestError = new SendRequestError();
    sendRequestError.execute({ res, error });
  }
}
