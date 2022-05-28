import axios from "axios";

interface IGetAllStorageRequest {
  token: string;
}

export const getAllStorage = async ({ token }: IGetAllStorageRequest) => {
  const request = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL || `/api`}/storage`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return await request.data;
};
