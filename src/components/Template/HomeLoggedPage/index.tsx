import { Navbar } from "../../Utils/Navbar";

interface IHomeLoggedProps {
  children: any;
}

export const HomeLoggedPage = ({ children }: IHomeLoggedProps) => {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
};
