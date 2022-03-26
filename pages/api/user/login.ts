import type { NextApiRequest, NextApiResponse } from "next";
import RouteNotFoundError from "../../../src/errors/RouteNotFoundError";
import CreateUserSessionsService from "../../../src/api/services/CreateUserSessionService";
import SendRequesError from "../../../src/api/services/SendRequestError";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (req.method === "POST") {
    await handlePost(req, res);
    return;
  }

  const { message, statusCode } = new RouteNotFoundError();
  res.status(statusCode).json({ message });
}

async function handlePost(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const { email, password } = req.body;
  const createUserSession = new CreateUserSessionsService();

  try {
    const { user, token } = await createUserSession.execute({
      email,
      password,
    });

    res.json({ user, token });
  } catch (error) {
    const sendRequestError = new SendRequesError();
    sendRequestError.execute({ res, error });
  }
}
