import axios from "axios";

interface IPostProductForSaleRequest {
  token: string;
  productForSale: any;
}

export const postProductForSale = async ({
  token,
  productForSale,
}: IPostProductForSaleRequest) => {
  const request = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL || `/api`}/products-for-sale`,
    {
      ...productForSale,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return await request.data;
};
