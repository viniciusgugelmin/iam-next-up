import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { HomeEntryPage } from "../src/components/Template/Home/HomeEntryPage";
import { HomeLoginPage } from "../src/components/Template/Home/HomeLoginPage";
import { HomeSignupPage } from "../src/components/Template/Home/HomeSignupPage";

interface IHomeProps {
  setPageSubtitle: (subtitle: string) => void;
}

const Home: NextPage<IHomeProps> = ({ setPageSubtitle }: IHomeProps) => {
  const [page, setPage] = useState("");
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
