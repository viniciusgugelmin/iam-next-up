import { NextApiRequest, NextApiResponse } from "next";
import RouteNotFoundError from "../../../errors/RouteNotFoundError";
import GetAuthenticatedUserService from "../../../back/services/user/GetAuthenticatedUserService";
import SendRequestError from "../../../back/services/app/SendRequestErrorService";
import SanitizeEveryWordService from "../../../back/services/app/SanitizeEveryWordService";
import AppError from "../../../errors/AppError";
import joi from "joi";
import GetProductService from "../../../back/services/products/GetProductService";
import DeleteProductService from "../../../back/services/products/DeleteProductService";
import UpdateProductService from "../../../back/services/products/UpdateProductService";

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

    const { productId } = req.query;

    const getProductsService = new GetProductService();
    const productToReturn = await getProductsService.execute({
      user,
      productId: productId as string,
    });

    res.json({
      product: productToReturn,
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

    const { productId } = req.query;
    const { name, description, image, category } = req.body;

    const sanitizeEveryWordService = new SanitizeEveryWordService();
    const productToUpdateData = sanitizeEveryWordService.execute({
      name,
      description,
      image,
    });

    const productSchema = joi.object({
      name: joi.string().required(),
      description: joi.string().required(),
      image: joi
        .string()
        .required()
        .regex(
          /^(ftp|http|https|chrome|:\/\/|\.|@){2,}(localhost|\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}|\S*:\w*@)*([a-zA-Z]|(\d{1,3}|\.){7}){1,}(\w|\.{2,}|\.[a-zA-Z]{2,3}|\/|\?|&|:\d|@|=|\/|\(.*\)|#|-|%)*$/
        )
        .message("Invalid image url"),
    });

    const validation = productSchema.validate(productToUpdateData);
    if (validation.error) {
      throw new AppError(validation.error.details[0].message);
    }

    const getProductService = new GetProductService();
    const productToUpdate = await getProductService.execute({
      user,
      productId: productId as string,
    });

    const updateProductService = new UpdateProductService();
    const productUpdated = await updateProductService.execute({
      user,
      productToUpdate,
      productToUpdateData,
    });

    res.json({
      product: productUpdated,
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

    const { productId } = req.query;

    const deleteProductService = new DeleteProductService();
    await deleteProductService.execute({
      user,
      productId: productId as string,
    });

    res.status(204).send({});
  } catch (error) {
    const sendRequestError = new SendRequestError();
    sendRequestError.execute({ res, error });
  }
}
