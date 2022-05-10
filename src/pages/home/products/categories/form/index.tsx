import { NextPage } from "next";
import { HomeLoggedPage } from "../../../../../front/components/Template/Home/HomeLoggedPage";
import useAuthentication from "../../../../../front/hooks/UseAuthentication";
import { FormEvent, useContext, useEffect, useState } from "react";
import { PageLoading } from "../../../../../front/components/Base/PageLoading";
import IPageProps from "../../../../../interfaces/IPageProps";
import { checkIfHasPermission } from "../../../../../front/services/checkIfUserHasPermission";
import authContext from "../../../../../front/stores/AuthContext";
import { useRouter } from "next/router";
import { Form } from "../../../../../front/components/Base/Form";
import { Input } from "../../../../../front/components/Base/Input";
import { Button } from "../../../../../front/components/Base/Button";
import { dispatchAlert } from "../../../../../front/services/dispatchAlert";
import { IError } from "../../../../../interfaces/IError";
import { postProductsCategory } from "../../../../../front/requests/productsCategories/postProductsCategory";

const ProductsCategoriesCreateForm: NextPage<IPageProps> = ({
  setPageSubtitle,
}: IPageProps) => {
  const [loading, setLoading] = useState(false);
  const isAuthenticated = useAuthentication();
  const context = useContext(authContext);
  const router = useRouter();
  const color = "purple";

  const [name, setName] = useState("");

  const isFormFilled = name;

  useEffect(() => {
    setPageSubtitle("Products categories form");

    if (!isAuthenticated) return;

    if (!checkIfHasPermission(context.user, "products_cateogories", "create")) {
      router.push("/home");
    }
  }, [isAuthenticated]);

  async function createProductCategory(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!isFormFilled || loading) return;

    setLoading(true);

    try {
      await postProductsCategory({
        token: context.token,
        productsCategory: {
          name,
        },
      });

      dispatchAlert({
        message: "Products category created successful",
        type: "success",
      });

      router.push("/home/products/categories/list");
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
        onSubmit={createProductCategory}
        color={color}
        title="Create products category"
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
        <Button type="submit" color={color} disabled={!isFormFilled || loading}>
          {loading ? "Loading..." : "Submit"}
        </Button>
      </Form>
    </HomeLoggedPage>
  );
};

export default ProductsCategoriesCreateForm;
