import type { NextPage } from "next";
import { FC, useContext, useEffect, useState } from "react";
import authContext from "../stores/AuthContext";
import { Button } from "../comps/Button";

const Home: NextPage = (props) => {
  const [page, setPage] = useState("");
  // TODO check if user is logged in and redirect to home logged page
  const context = useContext(authContext);
  context;
  props;

  useEffect(() => {
    if (!["login", "signup", ""].includes(page)) {
      setPage("");
    }
  }, [page]);

  return (
    <>
      <HomeEntryPage page={page} setPage={setPage}>
        <div>{page}</div>
      </HomeEntryPage>
    </>
  );
};

export default Home;

interface IHomeEntryPageProps {
  page: string;
  setPage: (page: string) => void;
  children: any;
}

const HomeEntryPage: FC<IHomeEntryPageProps> = ({
  page,
  setPage,
  children,
}) => {
  const [isPageChanged, setIsPageChanged] = useState(false);
  const className = page ? "up-home-entry-page--disabled" : "";

  if (page && !isPageChanged) {
    setTimeout(() => {
      setIsPageChanged(true);
    }, 500);
  }

  return (
    <div className={`up-home-entry-page ${className}`}>
      {!isPageChanged && (
        <div className="up-home-entry-page__container">
          <h1 className="up-home-entry-page__title">Go Drink</h1>
          <div className="up-home-entry-page__button-container">
            <Button
              className="up-home-entry-page__button-login"
              onClick={() => setPage("login")}
            >
              Log in
            </Button>
            <Button
              className="up-home-entry-page__button-login"
              onClick={() => setPage("signup")}
            >
              Sign up
            </Button>
          </div>
        </div>
      )}
      {isPageChanged && children}
    </div>
  );
};
