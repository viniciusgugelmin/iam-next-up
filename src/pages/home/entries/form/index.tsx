import { NextPage } from "next";
import { HomeLoggedPage } from "../../../../front/components/Template/Home/HomeLoggedPage";
import useAuthentication from "../../../../front/hooks/UseAuthentication";
import { FormEvent, useContext, useEffect, useState } from "react";
import { PageLoading } from "../../../../front/components/Base/PageLoading";
import IPageProps from "../../../../interfaces/IPageProps";
import { checkIfHasPermission } from "../../../../front/services/checkIfUserHasPermission";
import authContext from "../../../../front/stores/AuthContext";
import { useRouter } from "next/router";
import { Form } from "../../../../front/components/Base/Form";
import { Input } from "../../../../front/components/Base/Input";
import { Button } from "../../../../front/components/Base/Button";
import { Select } from "../../../../front/components/Base/Select";
import { dispatchAlert } from "../../../../front/services/dispatchAlert";
import { IError } from "../../../../interfaces/IError";
import { postEntry } from "../../../../front/requests/entries/postEntry";
import { getProducts } from "../../../../front/requests/products/getProducts";

const EntriesCreateForm: NextPage<IPageProps> = ({
  setPageSubtitle,
}: IPageProps) => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<string[][]>([]);
  const isAuthenticated = useAuthentication();
  const context = useContext(authContext);
  const router = useRouter();
  const color = "purple";

  const [productId, setProductId] = useState("");
  const [price, setPrice] = useState("");
  const [liters, setLiters] = useState("");

  const isFormFilled = productId && price && liters;

  useEffect(() => {
    setPageSubtitle("Users form");

    if (!isAuthenticated) return;

    if (!checkIfHasPermission(context.user, "entries", "create")) {
      router.push("/home");
    }

    loadProducts();
  }, [isAuthenticated]);

  function loadProducts() {
    setLoading(true);

    getProducts({ token: context.token })
      .then((data) => {
        setProducts([
          ["", ""],
          ...data.products.map((product: { name: string; _id: string }) => [
            product._id,
            product.name,
          ]),
        ]);
      })
      .catch((error) => {
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
      })
      .finally(() => {
        setLoading(false);
      });
  }

  async function createEntry(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!isFormFilled || loading) return;

    setLoading(true);

    try {
      await postEntry({
        token: context.token,
        entry: {
          productId,
          price,
          liters,
        },
      });

      dispatchAlert({
        message: "Entry created successful",
        type: "success",
      });

      router.push("/home/entries/list");
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
        onSubmit={createEntry}
        color={color}
        title="Create entry"
      >
        <Select
          placeholder="Product"
          name="product"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          color={color}
          options={products}
          required
        />
        <Input
          type="number"
          placeholder="Price"
          name="price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          color={color}
          required
        />
        <Input
          type="number"
          placeholder="Liters"
          name="liters"
          value={liters}
          onChange={(e) => setLiters(e.target.value)}
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

export default EntriesCreateForm;
