import axios from "axios";

interface IGetProductsCategoryRequest {
  token: string;
  id: string;
}

export const getProductsCategory = async ({
  token,
  id,
}: IGetProductsCategoryRequest) => {
  const request = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL || `/api`}/products/categories/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return await request.data;
};
