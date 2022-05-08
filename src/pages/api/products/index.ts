import { NextApiRequest, NextApiResponse } from "next";
import RouteNotFoundError from "../../../errors/RouteNotFoundError";
import GetAuthenticatedUserService from "../../../back/services/user/GetAuthenticatedUserService";
import SendRequestError from "../../../back/services/app/SendRequestErrorService";
import GetUsersService from "../../../back/services/users/GetUsersService";
import CreateUserService from "../../../back/services/users/CreateUserService";
import joi from "joi";
import SanitizeEveryWordService from "../../../back/services/app/SanitizeEveryWordService";
import AppError from "../../../errors/AppError";
import GetProductsService from "../../../back/services/products/GetProductsService";

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

    const getProductsService = new GetProductsService();
    const products = await getProductsService.execute({ user });

    res.json({
      products,
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

    const { name, price, quantity, isAlcoholic, description, image, category } =
      req.body;

    const sanitizeEveryWordService = new SanitizeEveryWordService();
    const newProduct = sanitizeEveryWordService.execute({
      name,
      price,
      quantity,
      isAlcoholic,
      description,
      image,
      category,
    });

    const productSchema = joi.object({
      name: joi.string().required(),
      price: joi.number().required(),
      quantity: joi.number().required(),
      isAlcoholic: joi.boolean().required(),
      description: joi.string().required(),
      image: joi.string().required(),
      category: joi
        .object({
          name: joi.string().required(),
        })
        .required(),
    });

    const validation = productSchema.validate(newProduct);
    if (validation.error) {
      throw new AppError(validation.error.details[0].message);
    }

    const createProductService = new CreateUserService();
    const productAdded = await createProductService.execute({
      user,
      newProduct,
    });

    res.status(201).json({
      product: productAdded,
    });
  } catch (error) {
    const sendRequestError = new SendRequestError();
    sendRequestError.execute({ res, error });
  }
}
