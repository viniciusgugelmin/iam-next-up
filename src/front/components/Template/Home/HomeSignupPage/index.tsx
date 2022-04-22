import { FormEvent, useState } from "react";
import { Input } from "../../../Base/Input";
import { Button } from "../../../Base/Button";
import { Form } from "../../../Base/Form";
import { IError } from "../../../../../interfaces/IError";
import { postSignupUser } from "../../../../requests/user/postSingupUser";
import { dispatchAlert } from "../../../../services/dispatchAlert";

interface IHomeSignupPageProps {
  setPage: (page: string) => void;
}

export const HomeSignupPage = ({ setPage }: IHomeSignupPageProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [adminCode, setAdminCode] = useState("");
  const [loading, setLoading] = useState(false);

  const color = "blue";
  const isFormFilled =
    name && email && password && confirmPassword && adminCode;

  async function signup(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!isFormFilled || loading) return;

    setLoading(true);

    try {
      await postSignupUser({
        name,
        email,
        password,
        confirmPassword,
        adminCode,
      });

      setPage("signup");
    } catch (error) {
      setLoading(false);
      dispatchAlert({
        message: (error as IError).response.data.message,
        type: "error",
      });
    }
  }

  return (
    <Form className="up-form" onSubmit={signup} color={color} title="Sign Up">
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
      <Input
        type="password"
        placeholder="Confirm password"
        name="confirm_password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        color={color}
        required
      />
      <Input
        type="password"
        placeholder="Admin code"
        name="admin_code"
        value={adminCode}
        onChange={(e) => setAdminCode(e.target.value)}
        color={color}
        required
      />
      <Button type="submit" color={color} disabled={!isFormFilled || loading}>
        {loading ? "Loadin..." : "Submit"}
      </Button>
    </Form>
  );
};
