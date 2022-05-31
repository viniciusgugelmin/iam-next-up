import axios from "axios";

interface IPostEntryRequest {
  token: string;
  entry: any;
}

export const postEntry = async ({ token, entry }: IPostEntryRequest) => {
  const request = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL || `/api`}/entries`,
    {
      ...entry,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return await request.data;
};
