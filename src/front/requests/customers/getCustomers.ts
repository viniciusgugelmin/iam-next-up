import axios from "axios";

interface IGetCustomersRequest {
  token: string;
}

export const getCustomers = async ({ token }: IGetCustomersRequest) => {
  const request = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL || `/api`}/customers`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return await request.data;
};
