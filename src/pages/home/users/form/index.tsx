import { NextPage } from "next";
import { HomeLoggedPage } from "../../../../front/components/Template/Home/HomeLoggedPage";
import useAuthentication from "../../../../front/hooks/UseAuthentication";
import { useEffect } from "react";
import { PageLoading } from "../../../../front/components/Base/PageLoading";
import IPageProps from "../../../../interfaces/IPageProps";

const UsersCreateForm: NextPage<IPageProps> = ({
  setPageSubtitle,
}: IPageProps) => {
  const isAuthenticated = useAuthentication();

  useEffect(() => {
    setPageSubtitle("Users form");
  }, []);

  if (!isAuthenticated) {
    return <PageLoading />;
  }

  return <HomeLoggedPage>UsersCreateForm</HomeLoggedPage>;
};

export default UsersCreateForm;
