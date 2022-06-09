import axios from "axios";

interface IPutCustomerRequest {
  token: string;
  customer: any;
  id: string;
}

export const putCustomer = async ({
  token,
  customer,
  id,
}: IPutCustomerRequest) => {
  const request = await axios.put(
    `${process.env.NEXT_PUBLIC_API_URL || `/api`}/customers/${id}`,
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
