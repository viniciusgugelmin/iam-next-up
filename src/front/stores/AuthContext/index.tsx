import React, { createContext, useEffect, useState } from "react";
import IAuthContextProvider from "../../../interfaces/IAuthContextProvider";
import { postLoginUser } from "../../requests/user/postLoginUser";
import { IUserAuth, IUserLogin } from "../../../interfaces/IUser";
import AppError from "../../../errors/AppError";
import { IError } from "../../../interfaces/IError";
import { useRouter } from "next/router";
import { getAuthUser } from "../../requests/user/getAuthUser";
import { dispatchAlert } from "../../services/dispatchAlert";

const contextValue = {
  isAuthenticated: false,
  user: {},
  token: "",
  login: async ({ email, password }: IUserLogin) => {},
  getUser: async ({ token }: IUserAuth) => {},
  logout: () => {},
  init: false,
};

const AuthContext = createContext({ ...contextValue });

export const AuthContextProvider = ({ children }: IAuthContextProvider) => {
  const [context, setContext] = useState({ ...contextValue });
  const router = useRouter();

  useEffect(() => {
    setContext({ ...context, login, getUser, logout, init: true });
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
      localStorage.setItem("iam-token", token);

      dispatchAlert({
        message: "Login successful",
        type: "success",
      });
    } catch (error) {
      if (!(error as { response?: any }).response) {
        dispatchAlert({
          message: "Server error",
          type: "error",
        });

        throw new AppError("Server error", 500);
      }

      dispatchAlert({
        message: (error as IError).response.data.message,
        type: "error",
      });

      throw new AppError(
        (error as IError).response.data.message,
        (error as IError).response.status
      );
    }

    setContext((c) => ({
      ...c,
      isAuthenticated: true,
      user,
      token,
    }));

    await router.push("/home");
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
      dispatchAlert({
        message: "You are not authenticated",
        type: "error",
      });

      context.logout();

      throw new AppError(
        (error as IError).response.data.message,
        (error as IError).response.status
      );
    }

    setContext((c) => ({
      ...c,
      isAuthenticated: true,
      user,
      token,
    }));
  };

  const logout = () => {
    localStorage.removeItem("iam-token");

    setContext((c) => ({
      ...c,
      isAuthenticated: false,
      user: {},
      token: "",
    }));
  };

  return (
    <AuthContext.Provider value={context}>{children}</AuthContext.Provider>
  );
};

export default AuthContext;
