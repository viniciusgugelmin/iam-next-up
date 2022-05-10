import axios from "axios";

interface IDeleteProductsCategoryRequest {
  id: string;
  token: string;
}

export const deleteProductsCategory = async ({
  id,
  token,
}: IDeleteProductsCategoryRequest) => {
  const request = await axios.delete(
    `${process.env.NEXT_PUBLIC_API_URL || `/api`}/products/categories/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return await request.data;
};
