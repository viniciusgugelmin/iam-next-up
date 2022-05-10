import axios from "axios";

interface IPutProductRequest {
  token: string;
  product: any;
  id: string;
}

export const putProduct = async ({
  token,
  product,
  id,
}: IPutProductRequest) => {
  const request = await axios.put(
    `${process.env.NEXT_PUBLIC_API_URL || `/api`}/products/${id}`,
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
