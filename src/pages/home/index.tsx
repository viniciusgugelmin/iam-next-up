import { NextPage } from "next";
import { Navbar } from "../../front/components/Utils/Navbar";
import useAuthentication from "../../front/hooks/UseAuthentication";
import { PageLoading } from "../../front/components/Base/PageLoading";
import { useEffect } from "react";

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
    <div>
      Hello Next.js <Navbar />
    </div>
  );
};

export default HomeLogged;
