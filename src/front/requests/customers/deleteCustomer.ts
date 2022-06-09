import axios from "axios";

interface IDeleteCustomerRequest {
  id: string;
  token: string;
}

export const deleteCustomer = async ({ id, token }: IDeleteCustomerRequest) => {
  const request = await axios.delete(
    `${process.env.NEXT_PUBLIC_API_URL || `/api`}/customers/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return await request.data;
};
