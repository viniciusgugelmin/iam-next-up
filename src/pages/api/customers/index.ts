import { NextApiRequest, NextApiResponse } from "next";
import RouteNotFoundError from "../../../errors/RouteNotFoundError";
import GetAuthenticatedUserService from "../../../back/services/user/GetAuthenticatedUserService";
import SendRequestError from "../../../back/services/app/SendRequestErrorService";
import GetUsersService from "../../../back/services/users/GetUsersService";
import CreateUserService from "../../../back/services/users/CreateUserService";
import joi from "joi";
import SanitizeEveryWordService from "../../../back/services/app/SanitizeEveryWordService";
import AppError from "../../../errors/AppError";
import CreateCustomerService from "../../../back/services/customers/CreateCustomerService";
import GetCustomersService from "../../../back/services/customers/GetCustomersService";

export default async function handler(
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

    const getCustomersService = new GetCustomersService();
    const customers = await getCustomersService.execute({ user });

    res.json({
      customers,
    });
  } catch (error) {
    const sendRequestError = new SendRequestError();
    sendRequestError.execute({ res, error });
  }
}

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  try {
    const getAuthenticatedUserService = new GetAuthenticatedUserService();
    const user = await getAuthenticatedUserService.execute({ req });

    const { document, email, name, password, birthday } = req.body;

    const sanitizeEveryWordService = new SanitizeEveryWordService();
    const newCustomer = sanitizeEveryWordService.execute({
      document,
      email,
      name,
      password,
      birthday: birthday.replace(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/, "$3-$2-$1"),
    });

    const customerSchema = joi.object({
      document: joi
        .string()
        .required()
        .regex(/^[0-9]{11}$/)
        .message("Invalid document"),
      email: joi.string().required().email(),
      name: joi.string().required(),
      password: joi.string().required(),
      birthday: joi.date().required(),
    });

    const validation = customerSchema.validate(newCustomer);
    if (validation.error) {
      throw new AppError(validation.error.details[0].message);
    }

    const createCustomerService = new CreateCustomerService();
    const customerAdded = await createCustomerService.execute({
      user,
      newCustomer,
    });

    res.status(201).json({
      customer: customerAdded,
    });
  } catch (error) {
    const sendRequestError = new SendRequestError();
    sendRequestError.execute({ res, error });
  }
}
