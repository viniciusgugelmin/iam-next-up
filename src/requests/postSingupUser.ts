import axios from "axios";

interface IPostSignupUserRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  adminCode: string;
}

export const postSignupUser = async ({
  name,
  email,
  password,
  confirmPassword,
  adminCode,
}: IPostSignupUserRequest) => {
  const request = await axios.post(`/api/user`, {
    name,
    email,
    password,
    confirmPassword,
    adminCode,
  });

  return await request.data;
};
