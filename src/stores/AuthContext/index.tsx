import React, { createContext, useEffect, useState } from "react";
import IAuthContextProvider from "../../interfaces/IAuthContextProvider";
import { postLoginUser } from "../../requests/postLoginUser";
import { IUserAuth, IUserLogin } from "../../interfaces/IUser";
import AppError from "../../errors/AppError";
import { IError } from "../../interfaces/IError";
import { useRouter } from "next/router";
import { getAuthUser } from "../../requests/getAuthUser";

const contextValue = {
  isAuthenticated: false,
  user: {},
  token: "",
  login: ({ email, password }: IUserLogin) => {},
  getUser: ({ token }: IUserAuth) => {},
  logout: () => {},
};

const AuthContext = createContext({ ...contextValue });

export const AuthContextProvider = ({ children }: IAuthContextProvider) => {
  const [context, setContext] = useState({ ...contextValue });
  const router = useRouter();

  useEffect(() => {
    setContext({ ...context, login, getUser, logout });
  }, []);

  const login = async ({ email, password }: IUserLogin) => {
    if (!email || !password) {
      throw new AppError("Email and password are required", 422);
    }

    let user = {};
    let token = "";

    try {
      const loginResponse = await postLoginUser({
        email,
        password,
      });

      user = loginResponse.user;
      token = loginResponse.token;
    } catch (error) {
      throw new AppError(
        (error as IError).response.data.message,
        (error as IError).response.status
      );
    }

    setContext({
      ...context,
      isAuthenticated: true,
      user,
      token,
    });
  };

  const getUser = async ({ token }: IUserAuth) => {
    if (!token) {
      throw new AppError("Token is required", 422);
    }

    let user = {};

    try {
      const getUserResponse = await getAuthUser({ token });

      user = getUserResponse.user;
    } catch (error) {
      throw new AppError(
        (error as IError).response.data.message,
        (error as IError).response.status
      );
    }

    setContext({
      ...context,
      isAuthenticated: true,
      user,
      token,
    });
  };

  const logout = () => {
    router.push("/");

    setContext({
      ...context,
      isAuthenticated: false,
      user: {},
      token: "",
    });

    setTimeout(() => {
      router.reload();
    }, 500);
  };

  return (
    <AuthContext.Provider value={context}>{children}</AuthContext.Provider>
  );
};

export default AuthContext;
