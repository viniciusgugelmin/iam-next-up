import React, { createContext, useEffect, useState } from "react";
import IAuthContextProvider from "./interfaces/IAuthContextProvider";

const contextValue = {
  isAuthenticated: false,
  user: {},
  token: "",
  login: (user: Object, token: string) => {
    user;
    token;
  },
  logout: () => {},
};

const AuthContext = createContext({ ...contextValue });

export const AuthContextProvider = ({ children }: IAuthContextProvider) => {
  const [context, setContext] = useState({ ...contextValue });

  useEffect(() => {
    setContext({ ...context, login, logout });
  }, []);

  const login = async (user: Object, token: string) => {
    // TODO: login request

    setContext({
      ...context,
      isAuthenticated: true,
      user,
      token,
    });
  };

  const logout = () => {
    setContext({
      ...context,
      isAuthenticated: false,
      user: {},
      token: "",
    });
  };

  return (
    <AuthContext.Provider value={context}>{children}</AuthContext.Provider>
  );
};

export default AuthContext;
