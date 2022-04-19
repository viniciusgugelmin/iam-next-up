import { NextApiRequest, NextApiResponse } from "next";
import RouteNotFoundError from "../../../errors/RouteNotFoundError";
import GetAuthenticatedUserService from "../../../api/services/user/GetAuthenticatedUserService";
import SendRequestError from "../../../api/services/app/SendRequestErrorService";
import GetUsersService from "../../../api/services/users/GetUsersService";
import CreateUserService from "../../../api/services/users/CreateUserService";
import joi from "joi";
import SanitizeEveryWordService from "../../../api/services/app/SanitizeEveryWordService";
import AppError from "../../../errors/AppError";

export default async function getUsers(
  req: NextApiRequest,
  res: NextApiResponse
) {
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

async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  try {
    const getAuthenticatedUserService = new GetAuthenticatedUserService();
    const user = await getAuthenticatedUserService.execute({ req });

    const getUsersService = new GetUsersService();
    const users = await getUsersService.execute({ user });

    res.json({
      users,
    });
  } catch (error) {
    const sendRequestError = new SendRequestError();
    sendRequestError.execute({ res, error });
  }
}

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { document, email, name, password, gender, hiredAt, role } = req.body;

    const sanitizeEveryWordService = new SanitizeEveryWordService();
    const newUser = sanitizeEveryWordService.execute({
      document,
      email,
      name,
      password,
      gender,
      hiredAt,
      role,
    });

    const userSchema = joi.object({
      document: joi
        .string()
        .required()
        .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/),
      email: joi.string().required().email(),
      name: joi.string().required(),
      password: joi.string().required(),
      gender: joi.string().required(),
      hiredAt: joi.date().required(),
      role: joi
        .object({
          name: joi.string().required(),
        })
        .required(),
    });

    const validation = userSchema.validate(newUser);
    if (validation.error) {
      throw new AppError(validation.error.details[0].message);
    }

    const getAuthenticatedUserService = new GetAuthenticatedUserService();
    const user = await getAuthenticatedUserService.execute({ req });

    const createUserService = new CreateUserService();
    const userAdded = await createUserService.execute({ user, newUser });

    res.json({
      user: userAdded,
    });
  } catch (error) {
    const sendRequestError = new SendRequestError();
    sendRequestError.execute({ res, error });
  }
}
