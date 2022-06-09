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
import { putUser } from "../../../../../front/requests/users/putUser";
import { getCustomer } from "../../../../../front/requests/customers/getCustomer";
import { putCustomer } from "../../../../../front/requests/customers/putCustomer";

const CustomersUpdateForm: NextPage<IPageProps> = ({
  setPageSubtitle,
}: IPageProps) => {
  const [loading, setLoading] = useState(false);
  const isAuthenticated = useAuthentication();
  const context = useContext(authContext);
  const router = useRouter();
  const color = "purple";

  const [document, setDocument] = useState("");
  const [documentTreated, setDocumentTreated] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [birthday, setBirthday] = useState("");
  const [birthdayTreated, setBirthdayTreatedDate] = useState("");

  const isFormFilled = document && name && email && birthday;

  useEffect(() => {
    setPageSubtitle("Customers form");

    if (!isAuthenticated) return;

    if (!checkIfHasPermission(context.user, "customers", "update")) {
      router.push("/home");
    }

    loadCustomer();
  }, [isAuthenticated]);

  function loadCustomer() {
    getCustomer({
      token: context.token,
      id: router.query.customerId as string,
    })
      .then((data) => {
        setDocument(data.customer.document);
        setDocumentTreated(data.customer.document);
        setName(data.customer.name);
        setEmail(data.customer.email);
        const _birthdayDate = new Date(data.customer._birthday);
        const _birthdayDateTreated = _birthdayDate.toJSON().slice(0, 10);

        handleBirthdayChange(
          _birthdayDateTreated.replace(
            /^(\d{4})-(\d{1,2})-(\d{1,2})$/,
            "$3/$2/$1"
          )
        );
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

  const handleDocumentChange = (doc: string) => {
    const documentToInsert = doc.replace(/[^0-9]/g, "").slice(0, 11);

    setDocument(documentToInsert);

    setDocumentTreated(
      documentToInsert
        .split("")
        .map((char, index) => {
          if (index === 3 || index === 6) {
            return `.${char}`;
          } else if (index === 9) {
            return `-${char}`;
          } else {
            return char;
          }
        })
        .join("")
    );
  };

  const handleBirthdayChange = (date: string) => {
    const dateToInsert = date.replace(/[^0-9]/g, "").slice(0, 8);

    setBirthday(dateToInsert);

    setBirthdayTreatedDate(
      dateToInsert
        .split("")
        .map((char, index) => {
          if (index === 2 || index === 4) {
            return `/${char}`;
          } else if (index === 8) {
            return `/${char}`;
          } else {
            return char;
          }
        })
        .join("")
    );
  };

  async function updateCustomer(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!isFormFilled || loading) return;

    setLoading(true);

    try {
      await putCustomer({
        token: context.token,
        customer: {
          document,
          name,
          email,
          password,
          birthday: birthdayTreated,
        },
        id: router.query.customerId as string,
      });

      dispatchAlert({
        message: "Customer updated successful",
        type: "success",
      });

      router.push("/home/customers/list");
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
        onSubmit={updateCustomer}
        color={color}
        title="Update customer"
      >
        <Input
          type="text"
          placeholder="Document"
          name="document"
          value={documentTreated}
          onChange={(e) => handleDocumentChange(e.target.value)}
          color={color}
          required
        />
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
          type="email"
          placeholder="Email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          color={color}
          required
        />
        <Input
          type="password"
          placeholder="Password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          color={color}
        />
        <Input
          type="text"
          placeholder="Birthday"
          name="birthday"
          value={birthdayTreated}
          onChange={(e) => handleBirthdayChange(e.target.value)}
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

export default CustomersUpdateForm;
