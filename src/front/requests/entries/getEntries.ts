import axios from "axios";

interface IGetEntriesRequest {
  token: string;
}

export const getEntries = async ({ token }: IGetEntriesRequest) => {
  const request = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL || `/api`}/entries`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return await request.data;
};
