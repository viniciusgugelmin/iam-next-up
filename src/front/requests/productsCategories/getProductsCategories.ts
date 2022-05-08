import axios from "axios";

interface IGetProductsCategoriesRequest {
  token: string;
}

export const getProductsCategories = async ({
  token,
}: IGetProductsCategoriesRequest) => {
  const request = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL || `/api`}/products/categories`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return await request.data;
};
