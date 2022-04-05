import { FormEvent, useState } from "react";
import { Input } from "../../../Base/Input";
import { Button } from "../../../Base/Button";
import { Form } from "../../../Base/Form";

export const HomeSignupPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const color = "blue";
  const isFormFilled = name && email && password && confirmPassword;

  function signup(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log(name, email, password, confirmPassword);
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
      <Button type="submit" color={color} disabled={!isFormFilled}>
        Submit
      </Button>
    </Form>
  );
};
