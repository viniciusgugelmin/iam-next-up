import { NextPage } from "next";
import { Navbar } from "../../src/components/Utils/Navbar";
import useAuthentication from "../../src/hooks/UseAuthentication";
import { PageLoading } from "../../src/components/Base/PageLoading";

const HomeLogged: NextPage = () => {
  const isAuthenticated = useAuthentication();

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
