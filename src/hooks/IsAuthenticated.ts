import { useContext, useEffect, useState } from "react";
import authContext from "../stores/AuthContext";
import { useRouter } from "next/router";

const IsAuthenticated = (needsPushToHome = true) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const context = useContext(authContext);
  const router = useRouter();

  useEffect(() => {
    if (!context.init) {
      return;
    }

    if (context.token && context.isAuthenticated) {
      setIsAuthenticated(true);
      return;
    }

    const localStorageToken = localStorage.getItem("iam-token");
    if (localStorageToken) {
      (async () => {
        try {
          await context.getUser({ token: localStorageToken });
          setIsAuthenticated(true);
        } catch (error) {
          needsPushToHome && handleLogout();
        }
      })();
      return;
    }

    needsPushToHome && handleLogout();
  }, [context]);

  async function handleLogout() {
    if (context.token || context.isAuthenticated) {
      await context.logout();
    }

    router.push("/");
  }

  return isAuthenticated;
};

export default IsAuthenticated;
