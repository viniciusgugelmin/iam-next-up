import axios from "axios";

interface IPutUserRequest {
  token: string;
  user: any;
  id: string;
}

export const putProduct = async ({ token, user, id }: IPutUserRequest) => {
  const request = await axios.put(
    `${process.env.NEXT_PUBLIC_API_URL || `/api`}/products/${id}`,
    {
      ...user,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return await request.data;
};
