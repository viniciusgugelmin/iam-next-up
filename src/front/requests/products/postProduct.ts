import axios from "axios";

interface IGetUsersRequest {
  token: string;
  user: any;
}

export const postProduct = async ({ token, user }: IGetUsersRequest) => {
  const request = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL || `/api`}/products`,
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
