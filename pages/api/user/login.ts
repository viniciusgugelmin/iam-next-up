import type { NextApiRequest, NextApiResponse } from "next";
import RouteNotFoundError from "../../../src/errors/RouteNotFoundError";
import CreateUserSessionsService from "../../../src/api/services/CreateUserSessionService";
import AppError from "../../../src/errors/AppError";
import InternalServerError from "../../../src/errors/InternalServerError";
import SendRequesError from "../../../src/api/services/SendRequestError";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    return await handlePost(req, res);
  }

  const { message, statusCode } = new RouteNotFoundError();
  return res.status(statusCode).json({ message });
}

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  const { email, password } = req.body;
  const createUserSession = new CreateUserSessionsService();

  try {
    const { user, token } = await createUserSession.execute({
      email,
      password,
    });

    return res.json({ user, token });
  } catch (error) {
    const sendRequestError = new SendRequesError();
    return sendRequestError.execute({ res, error });
  }
}
