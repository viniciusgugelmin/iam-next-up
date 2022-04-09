import type { NextApiRequest, NextApiResponse } from "next";
import RouteNotFoundError from "../../../src/errors/RouteNotFoundError";
import CreateUserSessionsService from "../../../src/api/services/CreateUserSessionService";
import SendRequestError from "../../../src/api/services/SendRequestErrorService";
import joi from "joi";
import { mongoDatabase } from "../../../src/api/config/mongoDatabase";

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
  const reqSchema = joi.object({
    email: joi.string().required(),
    password: joi.string().required(),
  });

  const { email, password } = req.body;

  const validation = reqSchema.validate({ email, password });
  if (validation.error) {
    const sendRequestError = new SendRequestError();
    return sendRequestError.execute({ res, error: validation.error.details });
  }

  try {
    const createUserSession = new CreateUserSessionsService();
    const { user, token } = await createUserSession.execute({
      email,
      password,
    });

    res.json({ user, token });
  } catch (error) {
    const sendRequestError = new SendRequestError();
    sendRequestError.execute({ res, error });
  } finally {
    await mongoDatabase.closeInstance();
  }
}
