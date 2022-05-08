import { NextApiRequest, NextApiResponse } from "next";
import joi from "joi";
import RouteNotFoundError from "../../../../errors/RouteNotFoundError";
import GetAuthenticatedUserService from "../../../../back/services/user/GetAuthenticatedUserService";
import SendRequestError from "../../../../back/services/app/SendRequestErrorService";
import SanitizeEveryWordService from "../../../../back/services/app/SanitizeEveryWordService";
import AppError from "../../../../errors/AppError";
import GetProductsCategoriesService from "../../../../back/services/productsCategories/GetProductsCategoriesService";
import CreateProductsCategoryService from "../../../../back/services/productsCategories/CreateProductsCategoryService";

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

    const getProductsCategoriesService = new GetProductsCategoriesService();
    const productsCategories = await getProductsCategoriesService.execute({
      user,
    });

    res.json({
      productsCategories,
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

    const { name } = req.body;

    const sanitizeEveryWordService = new SanitizeEveryWordService();
    const newProductsCategory = sanitizeEveryWordService.execute({
      name,
    });

    const productsCategorySchema = joi.object({
      name: joi.string().required(),
    });

    const validation = productsCategorySchema.validate(newProductsCategory);
    if (validation.error) {
      throw new AppError(validation.error.details[0].message);
    }

    const createProductsCategoryService = new CreateProductsCategoryService();
    const productsCategoryAdded = await createProductsCategoryService.execute({
      user,
      newProductsCategory,
    });

    res.status(201).json({
      productsCategory: productsCategoryAdded,
    });
  } catch (error) {
    const sendRequestError = new SendRequestError();
    sendRequestError.execute({ res, error });
  }
}
