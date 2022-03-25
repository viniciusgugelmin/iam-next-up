import type { NextApiRequest, NextApiResponse } from "next";
import RouteNotFoundError from "../../../src/errors/RouteNotFoundError";
import CreateUserSessionsService from "../../../src/api/services/CreateUserSessionService";
import AppError from "../../../src/errors/AppError";
import InternalServerError from "../../../src/errors/InternalServerError";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { message, statusCode } = new RouteNotFoundError();

    return res.status(statusCode).json({ message });
  }

  const { email, password } = req.body;
  const createUserSession = new CreateUserSessionsService();

  try {
    const { user, token } = await createUserSession.execute({
      email,
      password,
    });

    return res.json({ user, token });
  } catch (e) {
    if (e instanceof AppError) {
      return res.status(e.statusCode).json({ message: e.message });
    }

    const { message, statusCode } = new InternalServerError();

    return res.status(statusCode).json({ message: message });
  }
}
