import axios from "axios";

interface IDeleteEntryRequest {
  id: string;
  token: string;
}

export const deleteEntry = async ({ id, token }: IDeleteEntryRequest) => {
  const request = await axios.delete(
    `${process.env.NEXT_PUBLIC_API_URL || `/api`}/entries/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return await request.data;
};
