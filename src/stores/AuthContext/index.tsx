import React, { createContext, useEffect, useState } from "react";
import IAuthContextProvider from "./interfaces/IAuthContextProvider";
import { postLoginUser } from "../../requests/postLoginUser";
import IUser from "./interfaces/IUser";
import AppError from "../../errors/AppError";

const contextValue = {
  isAuthenticated: false,
  user: {},
  token: "",
  login: (user?: IUser, token?: string) => {
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

  const login = async (user: IUser = {}, token: string = "") => {
    if ((!user.email || !user.password) && !token) {
      throw new AppError("Email and password are required");
    }

    let tokenToSet = token;

    try {
      if (user.email && user.password) {
        const loginResponse = await postLoginUser({
          email: user.email,
          password: user.password,
        });

        tokenToSet = loginResponse.token;
      }
    } catch (error) {
      throw new AppError(error.response.data.message);
    }

    setContext({
      ...context,
      isAuthenticated: true,
      user,
      token: tokenToSet,
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
