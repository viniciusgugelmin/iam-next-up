import { NextApiRequest, NextApiResponse } from "next";
import RouteNotFoundError from "../../../errors/RouteNotFoundError";
import GetAuthenticatedUserService from "../../../back/services/user/GetAuthenticatedUserService";
import SendRequestError from "../../../back/services/app/SendRequestErrorService";
import SanitizeEveryWordService from "../../../back/services/app/SanitizeEveryWordService";
import joi from "joi";
import AppError from "../../../errors/AppError";
import CreateSaleService from "../../../back/services/sales/CreateSaleService";
import GetSalesService from "../../../back/services/sales/GetSalesService";

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

    const getSalesService = new GetSalesService();
    const sales = await getSalesService.execute({ user });

    res.json({
      sales,
    });
  } catch (error) {
    const sendRequestError = new SendRequestError();
    sendRequestError.execute({ res, error });
  }
}

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { productForSaleId, customersDocument, liters } = req.body;

    const sanitizeEveryWordService = new SanitizeEveryWordService();
    const newSale = sanitizeEveryWordService.execute({
      productForSaleId,
      customersDocument,
      liters,
    });

    const entrySchema = joi.object({
      productForSaleId: joi.string().required(),
      customersDocument: joi
        .string()
        .required()
        .regex(/^[0-9]{11}$/),
      liters: joi.number().greater(0).required(),
    });

    const validation = entrySchema.validate(newSale);
    if (validation.error) {
      throw new AppError(validation.error.details[0].message);
    }

    const createSaleService = new CreateSaleService();
    const saleAdded = await createSaleService.execute({ newSale });

    res.status(201).json({
      sale: saleAdded,
    });
  } catch (error) {
    const sendRequestError = new SendRequestError();
    sendRequestError.execute({ res, error });
  }
}
