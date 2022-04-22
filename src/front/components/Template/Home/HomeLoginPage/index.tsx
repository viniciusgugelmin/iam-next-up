import { FormEvent, useContext, useState } from "react";
import authContext from "../../../../stores/AuthContext";
import { Button } from "../../../Base/Button";
import { Input } from "../../../Base/Input";
import { Form } from "../../../Base/Form";

export const HomeLoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const context = useContext(authContext);
  const color = "purple";
  const isFormFilled = email.length && password.length;

  async function login(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await context.login({ email, password });
  }

  return (
    <Form className="up-form" onSubmit={login} color={color} title="Login">
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
      <Button type="submit" color={color} disabled={!isFormFilled}>
        Submit
      </Button>
    </Form>
  );
};
