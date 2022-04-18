import axios from "axios";

interface IPostLoginUserRequest {
  email: string;
  password: string;
}

export const postLoginUser = async ({
  email,
  password,
}: IPostLoginUserRequest) => {
  const request = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL ?? `/api`}/user/login`,
    {
      email,
      password,
    }
  );

  return await request.data;
};
