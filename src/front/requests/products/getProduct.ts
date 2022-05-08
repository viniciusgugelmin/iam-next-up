import axios from "axios";

interface IGetUserRequest {
  token: string;
  id: string;
}

export const getProduct = async ({ token, id }: IGetUserRequest) => {
  const request = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL || `/api`}/products/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return await request.data;
};
