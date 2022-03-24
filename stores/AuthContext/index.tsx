import React, { createContext, useState } from "react";
import IAuthContextProvider from "./interfaces/IAuthContextProvider";

const contextValue = {
  isAuthenticated: false,
  user: null,
  token: null,
  login: () => {},
  logout: () => {},
};

const AuthContext = createContext({ ...contextValue });

export const AuthContextProvider = ({ children }: IAuthContextProvider) => {
  const [context] = useState({ ...contextValue });

  return (
    <AuthContext.Provider value={context}>{children}</AuthContext.Provider>
  );
};

export default AuthContext;
