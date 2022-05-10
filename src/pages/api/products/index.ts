import { NextApiRequest, NextApiResponse } from "next";
import RouteNotFoundError from "../../../errors/RouteNotFoundError";
import GetAuthenticatedUserService from "../../../back/services/user/GetAuthenticatedUserService";
import SendRequestError from "../../../back/services/app/SendRequestErrorService";
import joi from "joi";
import SanitizeEveryWordService from "../../../back/services/app/SanitizeEveryWordService";
import AppError from "../../../errors/AppError";
import GetProductsService from "../../../back/services/products/GetProductsService";
import CreateProductService from "../../../back/services/products/CreateProductService";

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

    const {
      name,
      brand,
      basePrice,
      price,
      liters,
      isAlcoholic,
      description,
      image,
      category,
    } = req.body;

    const sanitizeEveryWordService = new SanitizeEveryWordService();
    const newProduct = sanitizeEveryWordService.execute({
      name,
      brand,
      basePrice,
      price,
      liters,
      isAlcoholic,
      description,
      image,
      category: { name: category },
    });

    const productSchema = joi.object({
      name: joi.string().required(),
      brand: joi.string().required(),
      basePrice: joi.number().required(),
      price: joi.number().required(),
      liters: joi.number().required(),
      isAlcoholic: joi.boolean().required(),
      description: joi.string().required(),
      image: joi
        .string()
        .required()
        .regex(
          /^(ftp|http|https|chrome|:\/\/|\.|@){2,}(localhost|\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}|\S*:\w*@)*([a-zA-Z]|(\d{1,3}|\.){7}){1,}(\w|\.{2,}|\.[a-zA-Z]{2,3}|\/|\?|&|:\d|@|=|\/|\(.*\)|#|-|%)*$/
        )
        .message("Invalid image url"),
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

    const createProductService = new CreateProductService();
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
