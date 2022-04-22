import axios from "axios";

interface IGetAuthUserRequest {
  id: string;
  token: string;
}

export const deleteUser = async ({ id, token }: IGetAuthUserRequest) => {
  const request = await axios.delete(
    `${process.env.NEXT_PUBLIC_API_URL || `/api`}/users/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return await request.data;
};
