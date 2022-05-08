import axios from "axios";

interface IGetUsersRequest {
  token: string;
}

export const getProducts = async ({ token }: IGetUsersRequest) => {
  const request = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL || `/api`}/products`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return await request.data;
};
