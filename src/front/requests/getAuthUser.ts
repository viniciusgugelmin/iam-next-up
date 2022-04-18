import axios from "axios";

interface IPostAuthUserRequest {
  token: string;
}

export const getAuthUser = async ({ token }: IPostAuthUserRequest) => {
  const request = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL || `/api`}/user/auth`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return await request.data;
};
