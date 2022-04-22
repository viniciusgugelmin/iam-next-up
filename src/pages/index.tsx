import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { HomeEntryPage } from "../front/components/Template/Home/HomeEntryPage";
import { HomeLoginPage } from "../front/components/Template/Home/HomeLoginPage";
import { HomeSignupPage } from "../front/components/Template/Home/HomeSignupPage";
import useAuthentication from "../front/hooks/UseAuthentication";
import IPageProps from "../interfaces/IPageProps";

const Home: NextPage<IPageProps> = ({ setPageSubtitle }: IPageProps) => {
  const [page, setPage] = useState("");
  const isAuthenticated = useAuthentication(false);
  const router = useRouter();
  const isRouteAvailable = ["login", "signup"].includes(page);

  useEffect(() => {
    if (!isRouteAvailable) {
      setPage("");
    }

    const routeUrl = { pathname: "/", query: {} };

    if (page) {
      routeUrl.query = { page: page };
    }

    router.push({ ...routeUrl });
  }, [page]);

  useEffect(() => {
    let pageSubtitle = "";

    if (router.query.page === "login") {
      setPage("login");
      pageSubtitle = "Login";
    }

    if (router.query.page === "signup") {
      setPage("signup");
      pageSubtitle = "Signup";
    }

    setPageSubtitle(pageSubtitle);
  }, [router.query]);

  if (isAuthenticated) {
    router.push("/home");
  }

  return (
    <>
      <HomeEntryPage
        page={page}
        setPage={setPage}
        isRouteAvailable={isRouteAvailable}
      >
        {page === "login" && <HomeLoginPage />}
        {page === "signup" && <HomeSignupPage setPage={setPage} />}
      </HomeEntryPage>
    </>
  );
};

export default Home;
