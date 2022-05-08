import axios from "axios";

interface IGetAuthUserRequest {
  id: string;
  token: string;
}

export const deleteProduct = async ({ id, token }: IGetAuthUserRequest) => {
  const request = await axios.delete(
    `${process.env.NEXT_PUBLIC_API_URL || `/api`}/products/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return await request.data;
};
