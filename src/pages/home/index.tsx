import { NextPage } from "next";
import { Navbar } from "../../front/components/Utils/Navbar";
import useAuthentication from "../../front/hooks/UseAuthentication";
import { PageLoading } from "../../front/components/Base/PageLoading";
import { useEffect } from "react";
import { HomeLoggedPage } from "../../front/components/Template/Home/HomeLoggedPage";

interface IHomeLoggedProps {
  setPageSubtitle: (subtitle: string) => void;
}

const HomeLogged: NextPage<IHomeLoggedProps> = ({
  setPageSubtitle,
}: IHomeLoggedProps) => {
  const isAuthenticated = useAuthentication();

  useEffect(() => {
    setPageSubtitle("Home");
  }, []);

  if (!isAuthenticated) {
    return <PageLoading />;
  }

  return (
    <HomeLoggedPage>
      Hello Next.js <Navbar />
    </HomeLoggedPage>
  );
};

export default HomeLogged;
