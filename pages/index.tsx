import type { NextPage } from "next";
import { useContext, useEffect, useState } from "react";
import authContext from "../src/stores/AuthContext";
import { useRouter } from "next/router";
import { HomeEntryPage } from "../src/components/Template/Home/HomeEntryPage";

interface IHomeProps {
  setPageSubtitle: (subtitle: string) => void;
}

const Home: NextPage<IHomeProps> = ({ setPageSubtitle }: IHomeProps) => {
  const [page, setPage] = useState("");
  // TODO check if user is logged in and redirect to home logged page
  const context = useContext(authContext);
  context;
  const router = useRouter();
  const isRouteAvailable = ["login", "signup"].includes(page);

  useEffect(() => {
    if (!isRouteAvailable) {
      setPage("");
      return;
    }

    router.push({ pathname: "/", query: { page: page } });
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
        <div>{page}</div>
      </HomeEntryPage>
    </>
  );
};

export default Home;
