import axios from "axios";

interface IPutUserRequest {
  token: string;
  user: any;
  id: string;
}

export const putUser = async ({ token, user, id }: IPutUserRequest) => {
  const request = await axios.put(
    `${process.env.NEXT_PUBLIC_API_URL || `/api`}/users/${id}`,
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
