import { NextPage } from "next";
import useAuthentication from "../../src/hooks/UseAuthentication";
import { PageLoading } from "../../src/components/Base/PageLoading";
import { HomeLoggedPage } from "../../src/components/Template/HomeLoggedPage";

const HomeLogged: NextPage = () => {
  const isAuthenticated = useAuthentication();

  if (!isAuthenticated) {
    return <PageLoading />;
  }

  return <HomeLoggedPage>Hello Next.js</HomeLoggedPage>;
};

export default HomeLogged;
