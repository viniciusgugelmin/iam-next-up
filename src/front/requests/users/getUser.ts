import axios from "axios";

interface IGetUserRequest {
  token: string;
  id: string;
}

export const getUser = async ({ token, id }: IGetUserRequest) => {
  const request = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL || `/api`}/users/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return await request.data;
};
