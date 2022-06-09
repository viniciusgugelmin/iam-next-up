import axios from "axios";

interface IGetCustomerRequest {
  token: string;
  id: string;
}

export const getCustomer = async ({ token, id }: IGetCustomerRequest) => {
  const request = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL || `/api`}/customers/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return await request.data;
};
