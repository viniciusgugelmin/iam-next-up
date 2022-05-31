import { NextApiRequest, NextApiResponse } from "next";
import RouteNotFoundError from "../../../errors/RouteNotFoundError";
import GetAuthenticatedUserService from "../../../back/services/user/GetAuthenticatedUserService";
import SendRequestError from "../../../back/services/app/SendRequestErrorService";
import GetEntriesService from "../../../back/services/entries/GetEntriesService";
import SanitizeEveryWordService from "../../../back/services/app/SanitizeEveryWordService";
import joi from "joi";
import AppError from "../../../errors/AppError";
import CreateEntryService from "../../../back/services/entries/CreateEntryService";

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

    const getEntriesService = new GetEntriesService();
    const entries = await getEntriesService.execute({ user });

    res.json({
      entries,
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

    const { productId, price, liters } = req.body;

    const sanitizeEveryWordService = new SanitizeEveryWordService();
    const newEntry = sanitizeEveryWordService.execute({
      productId,
      price,
      liters,
    });

    const entrySchema = joi.object({
      productId: joi.string().required(),
      price: joi.number().greater(0).required(),
      liters: joi.number().greater(0).required(),
    });

    const validation = entrySchema.validate(newEntry);
    if (validation.error) {
      throw new AppError(validation.error.details[0].message);
    }

    const createEntryService = new CreateEntryService();
    const entryAdded = await createEntryService.execute({ user, newEntry });

    res.status(201).json({
      entry: entryAdded,
    });
  } catch (error) {
    const sendRequestError = new SendRequestError();
    sendRequestError.execute({ res, error });
  }
}
