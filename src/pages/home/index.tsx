import { NextPage } from "next";
import useAuthentication from "../../front/hooks/UseAuthentication";
import { PageLoading } from "../../front/components/Base/PageLoading";
import { useEffect } from "react";
import { HomeLoggedPage } from "../../front/components/Template/Home/HomeLoggedPage";
import IPageProps from "../../interfaces/IPageProps";

const HomeLogged: NextPage<IPageProps> = ({ setPageSubtitle }: IPageProps) => {
  const isAuthenticated = useAuthentication();

  useEffect(() => {
    setPageSubtitle("Home");
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <PageLoading />;
  }

  return <HomeLoggedPage>Hello Next.js</HomeLoggedPage>;
};

export default HomeLogged;
