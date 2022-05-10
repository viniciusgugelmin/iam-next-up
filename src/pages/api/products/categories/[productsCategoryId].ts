import { NextApiRequest, NextApiResponse } from "next";
import RouteNotFoundError from "../../../../errors/RouteNotFoundError";
import GetAuthenticatedUserService from "../../../../back/services/user/GetAuthenticatedUserService";
import SendRequestError from "../../../../back/services/app/SendRequestErrorService";
import SanitizeEveryWordService from "../../../../back/services/app/SanitizeEveryWordService";
import AppError from "../../../../errors/AppError";
import joi from "joi";
import GetProductService from "../../../../back/services/products/GetProductService";
import DeleteProductService from "../../../../back/services/products/DeleteProductService";
import UpdateProductService from "../../../../back/services/products/UpdateProductService";
import GetProductsCategoryService from "../../../../back/services/productsCategories/GetProductsCategoryService";
import UpdateProductsCategoryService from "../../../../back/services/productsCategories/UpdateProductsCategoryService";
import DeleteProductsCategoryService from "../../../../back/services/productsCategories/DeleteProductsCategoryService";

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

    const { productsCategoryId } = req.query;

    const getProductsCategoryService = new GetProductsCategoryService();
    const productsCategoryToReturn = await getProductsCategoryService.execute({
      user,
      productsCategoryId: productsCategoryId as string,
    });

    res.json({
      productsCategory: productsCategoryToReturn,
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

    const { productsCategoryId } = req.query;
    const { name } = req.body;

    const sanitizeEveryWordService = new SanitizeEveryWordService();
    const productsCategoryToUpdateData = sanitizeEveryWordService.execute({
      name,
    });

    const productsCategorySchema = joi.object({
      name: joi.string().required(),
    });

    const validation = productsCategorySchema.validate(
      productsCategoryToUpdateData
    );
    if (validation.error) {
      throw new AppError(validation.error.details[0].message);
    }

    const getProductsCategoryService = new GetProductsCategoryService();
    const productsCategoryToUpdate = await getProductsCategoryService.execute({
      user,
      productsCategoryId: productsCategoryId as string,
    });

    const updateProductsCategoryService = new UpdateProductsCategoryService();
    const productsCategoryUpdated = await updateProductsCategoryService.execute(
      {
        user,
        productsCategoryToUpdate,
        productsCategoryToUpdateData,
      }
    );

    res.json({
      productsCategory: productsCategoryUpdated,
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

    const { productsCategoryId } = req.query;

    const deleteProductsCategoryService = new DeleteProductsCategoryService();
    await deleteProductsCategoryService.execute({
      user,
      productsCategoryId: productsCategoryId as string,
    });

    res.status(204).send({});
  } catch (error) {
    const sendRequestError = new SendRequestError();
    sendRequestError.execute({ res, error });
  }
}
