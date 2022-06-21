import axios from "axios";

interface IPostSaleRequest {
  sale: any;
}

export const postSale = async ({ sale }: IPostSaleRequest) => {
  const request = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL || `/api`}/sales`,
    {
      ...sale,
    }
  );

  return await request.data;
};
