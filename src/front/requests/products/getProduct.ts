import axios from "axios";

interface IGetProductRequest {
  token: string;
  id: string;
}

export const getProduct = async ({ token, id }: IGetProductRequest) => {
  const request = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL || `/api`}/products/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return await request.data;
};
