import axios from "axios";

interface IGetProductsForSaleRequest {
  token: string;
}

export const getProductsForSale = async ({
  token,
}: IGetProductsForSaleRequest) => {
  const request = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL || `/api`}/products-for-sale`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return await request.data;
};
