import axios from "axios";

interface IPostProductRequest {
  token: string;
  product: any;
}

export const postProduct = async ({ token, product }: IPostProductRequest) => {
  const request = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL || `/api`}/products`,
    {
      ...product,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return await request.data;
};
