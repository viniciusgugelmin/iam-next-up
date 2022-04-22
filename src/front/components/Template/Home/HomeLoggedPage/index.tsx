import { Navbar } from "../../../Utils/Navbar";

interface IHomeLoggedProps {
  children: any;
}

export const HomeLoggedPage = ({ children }: IHomeLoggedProps) => {
  return (
    <main className="up-home-logged-page">
      <Navbar />
      {children}
    </main>
  );
};
