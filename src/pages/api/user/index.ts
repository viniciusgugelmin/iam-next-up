import type { NextApiRequest, NextApiResponse } from "next";
import RouteNotFoundError from "../../../errors/RouteNotFoundError";
import SendRequestError from "../../../api/services/SendRequestErrorService";
import GetAuthenticatedUserService from "../../../api/services/GetAuthenticatedUserService";
import joi from "joi";
import CreateUserSessionsService from "../../../api/services/CreateUserSessionService";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (req.method === "GET") {
    await handleGet(req, res);
    return;
  }

  if (req.method === "POST") {
    await handlePost(req, res);
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
  }
}
