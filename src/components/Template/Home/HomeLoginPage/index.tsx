import { useContext, useEffect, useState } from "react";
import authContext from "../../../../stores/AuthContext";

export const HomeLoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const context = useContext(authContext);
  console.log(context);

  useEffect(() => {
    context.login({ email: "admi", password: "admin" });
  }, []);

  return (
    <div>
      <h1>HomeLoginPage</h1>
    </div>
  );
};
