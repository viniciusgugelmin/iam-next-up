import axios from "axios";

interface IGetUsersRequest {
  token: string;
  user: any;
}

export const postUser = async ({ token, user }: IGetUsersRequest) => {
  const request = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL || `/api`}/users`,
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
