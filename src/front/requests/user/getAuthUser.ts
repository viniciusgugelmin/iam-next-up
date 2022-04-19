import axios from "axios";

interface IGetAuthUserRequest {
  token: string;
}

export const getAuthUser = async ({ token }: IGetAuthUserRequest) => {
  const request = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL || `/api`}/user`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return await request.data;
};
