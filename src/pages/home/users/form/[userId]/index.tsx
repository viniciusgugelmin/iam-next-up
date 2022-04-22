import { NextPage } from "next";
import { HomeLoggedPage } from "../../../../../front/components/Template/Home/HomeLoggedPage";
import { useContext, useEffect } from "react";
import { checkIfHasPermission } from "../../../../../front/services/checkIfUserHasPermission";
import useAuthentication from "../../../../../front/hooks/UseAuthentication";
import authContext from "../../../../../front/stores/AuthContext";
import { useRouter } from "next/router";
import IPageProps from "../../../../../interfaces/IPageProps";

const UsersUpdateForm: NextPage<IPageProps> = ({
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

  return <HomeLoggedPage>UsersUpdateForm</HomeLoggedPage>;
};

export default UsersUpdateForm;
