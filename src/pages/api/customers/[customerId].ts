import { NextApiRequest, NextApiResponse } from "next";
import RouteNotFoundError from "../../../errors/RouteNotFoundError";
import GetAuthenticatedUserService from "../../../back/services/user/GetAuthenticatedUserService";
import SendRequestError from "../../../back/services/app/SendRequestErrorService";
import GetUserService from "../../../back/services/users/GetUserService";
import SanitizeEveryWordService from "../../../back/services/app/SanitizeEveryWordService";
import AppError from "../../../errors/AppError";
import joi from "joi";
import DeleteUserService from "../../../back/services/users/DeleteUserService";
import UpdateCustomerService from "../../../back/services/customers/UpdateCustomerService";
import GetCustomerService from "../../../back/services/customers/GetCustomerService";
import DeleteCustomerService from "../../../back/services/customers/DeleteCustomerService";

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

  if (req.method === "DELETE") {
    await handleDelete(req, res);
    return;
  }

  const { message, statusCode } = new RouteNotFoundError();
  res.status(statusCode).json({ message });
}

async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  try {
    const getAuthenticatedUserService = new GetAuthenticatedUserService();
    const user = await getAuthenticatedUserService.execute({ req });

    const { customerId } = req.query;

    const getCustomerService = new GetCustomerService();
    const customerToReturn = await getCustomerService.execute({
      user,
      customerId: customerId as string,
    });

    res.json({
      customer: customerToReturn,
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

    const { customerId } = req.query;
    const { document, email, name, password, birthday } = req.body;

    const sanitizeEveryWordService = new SanitizeEveryWordService();
    const customerToUpdateData = sanitizeEveryWordService.execute({
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
        .regex(/^[0-9]{11}$/),
      email: joi.string().required().email(),
      name: joi.string().required(),
      password: joi.optional(),
      birthday: joi.date().required(),
    });

    const validation = customerSchema.validate(customerToUpdateData);
    if (validation.error) {
      throw new AppError(validation.error.details[0].message);
    }

    const getCustomerService = new GetCustomerService();
    const customerToUpdate = await getCustomerService.execute({
      user,
      customerId: customerId as string,
      returnPassword: true,
    });

    const updateCustomerService = new UpdateCustomerService();
    const customerUpdated = await updateCustomerService.execute({
      user,
      customerToUpdate,
      customerToUpdateData,
    });

    res.json({
      customer: customerUpdated,
    });
  } catch (error) {
    const sendRequestError = new SendRequestError();
    sendRequestError.execute({ res, error });
  }
}

async function handleDelete(req: NextApiRequest, res: NextApiResponse) {
  try {
    const getAuthenticatedUserService = new GetAuthenticatedUserService();
    const user = await getAuthenticatedUserService.execute({ req });

    const { customerId } = req.query;

    const deleteCustomerService = new DeleteCustomerService();
    await deleteCustomerService.execute({
      user,
      customerId: customerId as string,
    });

    res.status(204).send({});
  } catch (error) {
    const sendRequestError = new SendRequestError();
    sendRequestError.execute({ res, error });
  }
}
