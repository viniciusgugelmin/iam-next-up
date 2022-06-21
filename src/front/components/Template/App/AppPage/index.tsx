interface IAppPage {
  children: any;
}

export const AppPage = ({ children }: IAppPage) => {
  return (
    <div className="up-app-page">
      <h1 className="up-app-page__title">Go Drink</h1>
      <main className="up-app-page__main">{children}</main>
      <footer className="up-app-page__footer">
        <p>Select your drink</p>
        <p>We have only 1 liter cups available for the time being.</p>
        <p>
          &copy;
          {"  "}
          {new Date().getFullYear()}
          {"  "}
          GoDrink. All rights reserved.
        </p>
      </footer>
    </div>
  );
};
