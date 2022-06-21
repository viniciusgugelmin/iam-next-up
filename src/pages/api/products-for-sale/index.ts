import { NextApiRequest, NextApiResponse } from "next";
import RouteNotFoundError from "../../../errors/RouteNotFoundError";
import GetAuthenticatedUserService from "../../../back/services/user/GetAuthenticatedUserService";
import SendRequestError from "../../../back/services/app/SendRequestErrorService";
import SanitizeEveryWordService from "../../../back/services/app/SanitizeEveryWordService";
import joi from "joi";
import AppError from "../../../errors/AppError";
import GetProductsForSaleService from "../../../back/services/productsForSale/GetProductsForSaleService";
import CreateProductForSaleService from "../../../back/services/productsForSale/CreateProductForSaleService";

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
    const getProductsForSaleService = new GetProductsForSaleService();
    const productsForSale = await getProductsForSaleService.execute();

    res.json({
      productsForSale,
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

    const { productId, pricePerLiter, promo } = req.body;

    const sanitizeEveryWordService = new SanitizeEveryWordService();
    const newProductForSale = sanitizeEveryWordService.execute({
      productId,
      pricePerLiter,
      promo,
    });

    const productForSaleSchema = joi.object({
      productId: joi.string().required(),
      pricePerLiter: joi.number().greater(0).required(),
      promo: joi.number().min(0).max(100).required(),
    });

    const validation = productForSaleSchema.validate(newProductForSale);
    if (validation.error) {
      throw new AppError(validation.error.details[0].message);
    }

    const createProductForSaleService = new CreateProductForSaleService();
    const productForSaleAdded = await createProductForSaleService.execute({
      user,
      newProductForSale,
    });

    res.status(201).json({
      productForSale: productForSaleAdded,
    });
  } catch (error) {
    const sendRequestError = new SendRequestError();
    sendRequestError.execute({ res, error });
  }
}
