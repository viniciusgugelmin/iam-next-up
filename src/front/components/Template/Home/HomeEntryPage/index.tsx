import { useState, useEffect } from "react";
import { Button } from "../../../Base/Button";
import { IoIosArrowDropleftCircle as GoBackIcon } from "react-icons/io";

interface IHomeEntryPageProps {
  page: string;
  setPage: (page: string) => void;
  children: any;
  isRouteAvailable: boolean;
}

export const HomeEntryPage = ({
  page,
  setPage,
  children,
  isRouteAvailable,
}: IHomeEntryPageProps) => {
  const [isPageChanged, setIsPageChanged] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false);
  const [isPageUnmounting, setIsPageUnmounting] = useState(false);
  const entryPageClassName = page ? "up-home-entry-page--disabled" : "";
  const sectionPageClassName = isPageUnmounting
    ? "up-home-section-page--disabled"
    : "";

  useEffect(() => {
    if (!isRouteAvailable && page !== "") return;

    changePage(page, true);
  }, [page]);

  function changePage(newPage: string, initPage: boolean = false) {
    !initPage && setIsPageUnmounting(true);

    setTimeout(() => {
      setIsPageChanged(!!newPage);
      setTimeout(() => {
        setPageLoaded(true);
      }, 100);

      if (!initPage) {
        setPage(newPage);
        setIsPageUnmounting(false);
      }
    }, 500);
  }

  return (
    <div className={`up-home-entry-page ${entryPageClassName}`}>
      {!isPageChanged && pageLoaded && (
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
      {isPageChanged && (
        <div className={`up-home-section-page ${sectionPageClassName}`}>
          <Button
            className="up-home-section-page__button-back"
            onClick={() => changePage("")}
          >
            <GoBackIcon />
          </Button>
          <div className="up-home-section-page__container">{children}</div>
        </div>
      )}
    </div>
  );
};
