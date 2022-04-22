import { NextPage } from "next";
import { HomeLoggedPage } from "../../../../front/components/Template/Home/HomeLoggedPage";
import useAuthentication from "../../../../front/hooks/UseAuthentication";
import { useContext, useEffect } from "react";
import { PageLoading } from "../../../../front/components/Base/PageLoading";
import IPageProps from "../../../../interfaces/IPageProps";
import { checkIfHasPermission } from "../../../../front/services/checkIfUserHasPermission";
import authContext from "../../../../front/stores/AuthContext";
import { useRouter } from "next/router";

const UsersCreateForm: NextPage<IPageProps> = ({
  setPageSubtitle,
}: IPageProps) => {
  const isAuthenticated = useAuthentication();
  const context = useContext(authContext);
  const router = useRouter();

  useEffect(() => {
    setPageSubtitle("Users form");

    if (!isAuthenticated) return;

    if (!checkIfHasPermission(context.user, "users", "create")) {
      router.push("/home");
    }
  }, []);

  if (!isAuthenticated) {
    return <PageLoading />;
  }

  return <HomeLoggedPage>UsersCreateForm</HomeLoggedPage>;
};

export default UsersCreateForm;
