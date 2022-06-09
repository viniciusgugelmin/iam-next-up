import axios from "axios";

interface IPostCustomerRequest {
  token: string;
  customer: any;
}

export const postCustomer = async ({
  token,
  customer,
}: IPostCustomerRequest) => {
  const request = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL || `/api`}/customers`,
    {
      ...customer,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return await request.data;
};
