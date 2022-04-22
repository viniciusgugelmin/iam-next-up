import axios from "axios";

interface IGetUsersRequest {
  token: string;
}

export const getRoles = async ({ token }: IGetUsersRequest) => {
  const request = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL || `/api`}/roles`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return await request.data;
};
