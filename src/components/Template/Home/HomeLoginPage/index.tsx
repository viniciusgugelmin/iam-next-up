import { useContext, useEffect, useState } from "react";
import authContext from "../../../../stores/AuthContext";
import { Button } from "../../../Base/Button";
import { Input } from "../../../Base/Input";

export const HomeLoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const context = useContext(authContext);
  console.log(context);

  return (
    <form>
      <Input
        type="text"
        placeholder="Email"
        name="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        type="password"
        placeholder="Password"
        name="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button onClick={() => context.login({ email, password })}>Login</Button>
    </form>
  );
};
