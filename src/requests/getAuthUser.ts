import axios from "axios";

interface IPostAuthUserRequest {
  token: string;
}

export const getAuthUser = async ({ token }: IPostAuthUserRequest) => {
  const request = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/user/auth`,
    {
      token,
    }
  );

  return await request.data;
};
