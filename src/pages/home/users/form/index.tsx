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
import genders from "../../../../constants/users/genders";
import { getRoles } from "../../../../front/requests/roles/getRoles";
import { dispatchAlert } from "../../../../front/services/dispatchAlert";
import { IError } from "../../../../interfaces/IError";
import { postUser } from "../../../../front/requests/users/postUser";

const UsersCreateForm: NextPage<IPageProps> = ({
  setPageSubtitle,
}: IPageProps) => {
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState<string[][]>([]);
  const isAuthenticated = useAuthentication();
  const context = useContext(authContext);
  const router = useRouter();
  const color = "purple";

  const [role, setRole] = useState("");
  const [document, setDocument] = useState("");
  const [documentTreated, setDocumentTreated] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("");
  const [hiredAt, setHiredAt] = useState("");
  const [hiredAtTreated, setHiredAtTreatedDate] = useState("");

  const isFormFilled =
    role && document && name && email && password && gender && hiredAt;

  const gendersArray = [["", ""], ...genders.map((gender) => [gender, gender])];

  useEffect(() => {
    setPageSubtitle("Users form");

    if (!isAuthenticated) return;

    if (!checkIfHasPermission(context.user, "users", "create")) {
      router.push("/home");
    }

    loadRoles();
  }, [isAuthenticated]);

  function loadRoles() {
    setLoading(true);

    getRoles({ token: context.token })
      .then((data) => {
        setRoles([
          ["", ""],
          ...data.roles.map((role: { name: string }) => [role.name, role.name]),
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

  const handleHiredAtChange = (date: string) => {
    const dateToInsert = date.replace(/[^0-9]/g, "").slice(0, 8);

    setHiredAt(dateToInsert);

    setHiredAtTreatedDate(
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

  async function createUser(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!isFormFilled || loading) return;

    setLoading(true);

    try {
      await postUser({
        token: context.token,
        user: {
          role,
          document,
          name,
          email,
          password,
          gender,
          hiredAt: hiredAtTreated,
        },
      });

      dispatchAlert({
        message: "User created successful",
        type: "success",
      });

      router.push("/home/users/list");
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
        onSubmit={createUser}
        color={color}
        title="Create user"
      >
        <Select
          placeholder="Role"
          name="role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          color={color}
          options={roles}
          required
        />
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
          required
        />
        <Select
          placeholder="Gender"
          name="gender"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          color={color}
          options={gendersArray}
          required
        />
        <Input
          type="text"
          placeholder="Hired date"
          name="hired_at"
          value={hiredAtTreated}
          onChange={(e) => handleHiredAtChange(e.target.value)}
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

export default UsersCreateForm;
