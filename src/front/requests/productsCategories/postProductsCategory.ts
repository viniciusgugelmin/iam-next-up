import axios from "axios";

interface IPostProductsCategoryRequest {
  token: string;
  productsCategory: any;
}

export const postProductsCategory = async ({
  token,
  productsCategory,
}: IPostProductsCategoryRequest) => {
  const request = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL || `/api`}/products/categories`,
    {
      ...productsCategory,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return await request.data;
};
