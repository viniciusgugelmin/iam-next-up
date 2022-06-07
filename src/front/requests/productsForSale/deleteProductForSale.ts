import axios from "axios";

interface IDeleteProductForSaleRequest {
  id: string;
  token: string;
}

export const deleteProductForSale = async ({
  id,
  token,
}: IDeleteProductForSaleRequest) => {
  const request = await axios.delete(
    `${process.env.NEXT_PUBLIC_API_URL || `/api`}/products-for-sale/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return await request.data;
};
