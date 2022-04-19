import axios from "axios";

interface IGetUsersRequest {
  token: string;
}

export const getUsers = async ({ token }: IGetUsersRequest) => {
  const request = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL || `/api`}/users`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return await request.data;
};
