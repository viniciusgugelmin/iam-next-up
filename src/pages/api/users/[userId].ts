import { NextApiRequest, NextApiResponse } from "next";
import RouteNotFoundError from "../../../errors/RouteNotFoundError";
import GetAuthenticatedUserService from "../../../api/services/user/GetAuthenticatedUserService";
import SendRequestError from "../../../api/services/app/SendRequestErrorService";
import GetUserService from "../../../api/services/users/GetUserService";
import SanitizeEveryWordService from "../../../api/services/app/SanitizeEveryWordService";
import AppError from "../../../errors/AppError";
import joi from "joi";
import UpdateUserService from "../../../api/services/users/UpdateUserService";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    await handleGet(req, res);
    return;
  }

  if (req.method === "PUT") {
    await handlePut(req, res);
    return;
  }

  const { message, statusCode } = new RouteNotFoundError();
  res.status(statusCode).json({ message });
}

async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  try {
    const getAuthenticatedUserService = new GetAuthenticatedUserService();
    const user = await getAuthenticatedUserService.execute({ req });

    const { userId } = req.query;

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

async function handlePut(req: NextApiRequest, res: NextApiResponse) {
  try {
    const getAuthenticatedUserService = new GetAuthenticatedUserService();
    const user = await getAuthenticatedUserService.execute({ req });

    const { userId } = req.query;
    const { document, email, name, password, gender, hiredAt, role } = req.body;

    const sanitizeEveryWordService = new SanitizeEveryWordService();
    const userToUpdateData = sanitizeEveryWordService.execute({
      element: {
        document,
        email,
        name,
        password,
        gender,
        hiredAt,
        role,
      },
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

    const validation = userSchema.validate(userToUpdateData);
    if (validation.error) {
      throw new AppError(validation.error.details[0].message);
    }

    const getUserService = new GetUserService();
    const userToUpdate = await getUserService.execute({
      user,
      userId: userId as string,
    });

    const updateUserService = new UpdateUserService();
    const userUpdated = await updateUserService.execute({
      user,
      userToUpdate,
      userToUpdateData,
    });

    res.json({
      user: userUpdated,
    });
  } catch (error) {
    const sendRequestError = new SendRequestError();
    sendRequestError.execute({ res, error });
  }
}
