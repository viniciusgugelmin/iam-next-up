import { NextPage } from "next";
import { HomeLoggedPage } from "../../../../../front/components/Template/Home/HomeLoggedPage";
import { FormEvent, useContext, useEffect, useState } from "react";
import { checkIfHasPermission } from "../../../../../front/services/checkIfUserHasPermission";
import useAuthentication from "../../../../../front/hooks/UseAuthentication";
import authContext from "../../../../../front/stores/AuthContext";
import { useRouter } from "next/router";
import IPageProps from "../../../../../interfaces/IPageProps";
import genders from "../../../../../constants/users/genders";
import { getRoles } from "../../../../../front/requests/roles/getRoles";
import { dispatchAlert } from "../../../../../front/services/dispatchAlert";
import { IError } from "../../../../../interfaces/IError";
import { postUser } from "../../../../../front/requests/users/postUser";
import { PageLoading } from "../../../../../front/components/Base/PageLoading";
import { Form } from "../../../../../front/components/Base/Form";
import { Select } from "../../../../../front/components/Base/Select";
import { Input } from "../../../../../front/components/Base/Input";
import { Button } from "../../../../../front/components/Base/Button";
import { getUser } from "../../../../../front/requests/users/getUser";
import { putUser } from "../../../../../front/requests/users/putUser";
import { postProduct } from "../../../../../front/requests/products/postProduct";
import { getProductsCategories } from "../../../../../front/requests/productsCategories/getProductsCategories";
import { getProduct } from "../../../../../front/requests/products/getProduct";

const ProductsUpdateForm: NextPage<IPageProps> = ({
  setPageSubtitle,
}: IPageProps) => {
  const [loading, setLoading] = useState(false);
  const [productsCategories, setProductsCategories] = useState<string[][]>([]);
  const isAuthenticated = useAuthentication();
  const context = useContext(authContext);
  const router = useRouter();
  const color = "purple";

  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [isAlcoholic, setIsAlcoholic] = useState("false");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("");

  const isFormFilled =
    name &&
    brand &&
    basePrice &&
    price &&
    quantity &&
    isAlcoholic &&
    description &&
    image &&
    category;

  useEffect(() => {
    setPageSubtitle("Products form");

    if (!isAuthenticated) return;

    if (!checkIfHasPermission(context.user, "products", "update")) {
      router.push("/home");
    }

    loadProductsCategories();
    loadProduct();
  }, [isAuthenticated]);

  function loadProductsCategories() {
    setLoading(true);

    getProductsCategories({ token: context.token })
      .then((data) => {
        setProductsCategories([
          ["", ""],
          ...data.productsCategories.map(
            (productCategory: { name: string }) => [
              productCategory.name,
              productCategory.name,
            ]
          ),
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

  function loadProduct() {
    getProduct({
      token: context.token,
      id: router.query.productId as string,
    }).then((data) => {
      setName(data.product.name);
      setBrand(data.product.brand);
      setBasePrice(data.product.basePrice);
      setPrice(data.product.price);
      setQuantity(data.product.quantity);
      setIsAlcoholic(data.product.isAlcoholic as string);
      setDescription(data.product.description);
      setImage(data.product.image);
      setCategory(data.product.category.name);
    });
  }

  const handleNumberChange = (number: string, setFunction: Function) => {
    const numberToInsert = number.replace("e", "").replace("-", "");

    setFunction(numberToInsert);
  };

  async function createProduct(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!isFormFilled || loading) return;

    setLoading(true);

    try {
      await postProduct({
        token: context.token,
        product: {
          name,
          brand,
          basePrice,
          price,
          quantity,
          isAlcoholic: isAlcoholic === "true",
          description,
          image,
          category,
        },
      });

      dispatchAlert({
        message: "Product created successful",
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
        onSubmit={createProduct}
        color={color}
        title="Update product"
      >
        <Input
          type="text"
          placeholder="Name"
          name="document"
          value={name}
          onChange={(e) => setName(e.target.value)}
          color={color}
          required
        />
        <Input
          type="text"
          placeholder="Brand"
          name="email"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          color={color}
          required
        />
        <Input
          type="number"
          placeholder="Base price"
          name="base_price"
          value={basePrice}
          onChange={(e) => handleNumberChange(e.target.value, setBasePrice)}
          color={color}
          required
        />
        <Input
          type="number"
          placeholder="Price"
          name="price"
          value={price}
          onChange={(e) => handleNumberChange(e.target.value, setPrice)}
          color={color}
          required
        />
        <Input
          type="number"
          placeholder="Quantity"
          name="quantity"
          value={quantity}
          onChange={(e) => handleNumberChange(e.target.value, setQuantity)}
          color={color}
          required
        />
        <Select
          placeholder="Is alcoholic"
          name="is_alcoholic"
          value={isAlcoholic}
          onChange={(e) => setIsAlcoholic(e.target.value)}
          color={color}
          options={[
            ["true", "Yes"],
            ["false", "No"],
          ]}
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
        <Select
          placeholder="Category"
          name="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          color={color}
          options={productsCategories}
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
