import { NextPage } from "next";
import { HomeLoggedPage } from "../../../../../front/components/Template/Home/HomeLoggedPage";
import { FormEvent, useContext, useEffect, useState } from "react";
import { checkIfHasPermission } from "../../../../../front/services/checkIfUserHasPermission";
import useAuthentication from "../../../../../front/hooks/UseAuthentication";
import authContext from "../../../../../front/stores/AuthContext";
import { useRouter } from "next/router";
import IPageProps from "../../../../../interfaces/IPageProps";
import { dispatchAlert } from "../../../../../front/services/dispatchAlert";
import { IError } from "../../../../../interfaces/IError";
import { PageLoading } from "../../../../../front/components/Base/PageLoading";
import { Form } from "../../../../../front/components/Base/Form";
import { Input } from "../../../../../front/components/Base/Input";
import { Button } from "../../../../../front/components/Base/Button";
import { getProduct } from "../../../../../front/requests/products/getProduct";
import { putProduct } from "../../../../../front/requests/products/putProduct";

const ProductsUpdateForm: NextPage<IPageProps> = ({
  setPageSubtitle,
}: IPageProps) => {
  const [loading, setLoading] = useState(false);
  const isAuthenticated = useAuthentication();
  const context = useContext(authContext);
  const router = useRouter();
  const color = "purple";

  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [, setIsAlcoholic] = useState("false");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");

  const isFormFilled = name && brand && description && image;

  useEffect(() => {
    setPageSubtitle("Products form");

    if (!isAuthenticated) return;

    if (!checkIfHasPermission(context.user, "products", "update")) {
      router.push("/home");
    }

    loadProduct();
  }, [isAuthenticated]);

  function loadProduct() {
    getProduct({
      token: context.token,
      id: router.query.productId as string,
    })
      .then((data) => {
        setName(data.product.name);
        setBrand(data.product.brand);
        setIsAlcoholic(data.product.isAlcoholic as string);
        setDescription(data.product.description);
        setImage(data.product.image);
      })
      .catch((error) => {
        // @ts-ignore
        if (!error.response?.data) {
          dispatchAlert({
            message: "Server error",
            type: "error",
          });
        } else {
          dispatchAlert({
            message: (error as IError).response.data.message,
            type: "error",
          });
        }

        router.push("/home");
      });
  }

  async function updateProduct(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!isFormFilled || loading) return;

    setLoading(true);

    try {
      await putProduct({
        token: context.token,
        product: {
          name,
          description,
          image,
        },
        id: router.query.productId as string,
      });

      dispatchAlert({
        message: "Product updated successful",
        type: "success",
      });

      router.push("/home/products/list");
    } catch (error) {
      // @ts-ignore
      if (!error.response?.data) {
        dispatchAlert({
          message: "Server error",
          type: "error",
        });
      } else {
        dispatchAlert({
          message: (error as IError).response.data.message,
          type: "error",
        });
      }
    } finally {
      setLoading(false);
    }
  }

  if (!isAuthenticated) {
    return <PageLoading />;
  }

  return (
    <HomeLoggedPage>
      <Form
        className="up-form up-admin-form"
        onSubmit={updateProduct}
        color={color}
        title="Update product"
      >
        <Input
          type="text"
          placeholder="Name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          color={color}
          required
        />
        <Input
          type="text"
          placeholder="Description"
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          color={color}
          required
        />
        <Input
          type="text"
          placeholder="Image"
          name="image"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          color={color}
          required
        />
        <Button type="submit" color={color} disabled={!isFormFilled || loading}>
          {loading ? "Loading..." : "Submit"}
        </Button>
      </Form>
    </HomeLoggedPage>
  );
};

export default ProductsUpdateForm;
