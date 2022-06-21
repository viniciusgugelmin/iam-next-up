interface IAppPage {
  children: any;
}

export const AppPage = ({ children }: IAppPage) => {
  return <main className="up-app-page">{children}</main>;
};
