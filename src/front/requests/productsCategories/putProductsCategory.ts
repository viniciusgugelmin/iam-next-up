import axios from "axios";

interface IPutProductsCategoryRequest {
  token: string;
  productsCategory: any;
  id: string;
}

export const putProductsCategory = async ({
  token,
  productsCategory,
  id,
}: IPutProductsCategoryRequest) => {
  const request = await axios.put(
    `${process.env.NEXT_PUBLIC_API_URL || `/api`}/products/categories/${id}`,
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
