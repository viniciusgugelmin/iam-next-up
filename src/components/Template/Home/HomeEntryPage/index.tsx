import { useState } from "react";
import { Button } from "../../../Base/Button";

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
  const className = page ? "up-home-entry-page--disabled" : "";

  if (page && !isPageChanged && isRouteAvailable) {
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
