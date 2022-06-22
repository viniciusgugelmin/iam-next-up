import axios from "axios";

interface IGetSalesRequest {
  token: string;
}

export const getSales = async ({ token }: IGetSalesRequest) => {
  const request = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL || `/api`}/sales`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return await request.data;
};
