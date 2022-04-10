import axios from "axios";

interface IPostLoginUserRequest {
  email: string;
  password: string;
}

export const postLoginUser = async ({
  email,
  password,
}: IPostLoginUserRequest) => {
  const request = await axios.post(`/api/user/login`, {
    email,
    password,
  });

  return await request.data;
};
